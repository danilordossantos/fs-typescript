import { useEffect, useState } from 'react'
import { Weather, Visibility, type NonSensitiveDiaryEntry, type ValidationErrorResponse } from './types'
import diaryService from './diaryService'
import axios from 'axios';

function App() {

  const [diaries, setDiaries] = useState<NonSensitiveDiaryEntry[]>([]);
  const [date, setDate] = useState('');
  const [comment, setComment] = useState('');
  const [weather, setWeather] = useState<Weather>(Weather.Sunny);
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Great);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    diaryService.getAll().then(initialDiaries => {
      setDiaries(initialDiaries)
    })
  }, []);

  const diaryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault()
    diaryService.create({
      date, comment,
      weather,
      visibility,
    })
      .then(returnedDiary => {
        setDiaries(diaries.concat(returnedDiary))
        setDate('')
        setComment('')
        setWeather(Weather.Sunny)
        setVisibility(Visibility.Great)
        setErrorMessage('')
      })
      .catch((error: unknown) => {
        if (axios.isAxiosError<ValidationErrorResponse>(error)) {
          const data = error.response?.data;
          if (data) {
            const message = data.error.map(item => `${item.path.join('.')}: ${item.message}`).join(', ')
            setErrorMessage(message);
          }
        }
      });
  };

  return (
    <>
      <h1>Flight diaries</h1>
      <ul>
        {diaries.map(diary =>
          <li key={diary.id}>
            <p>{diary.date}</p>
            <p>Weather: {diary.weather}</p>
            <p>Visibility: {diary.visibility}</p>
          </li>
        )}
      </ul>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={diaryCreation}>
        <p>Date: <input type='date' required value={date} onChange={(event) =>
          setDate(event.target.value)} /></p>
        <p>Comment: <input value={comment} onChange={(event) => setComment(event.target.value)} /></p>
        <p>Weather:
          {Object.values(Weather).map(option => (
            <label key={option}>
              <input
                type='radio'
                name='weather'
                checked={option === weather}
                onChange={() => setWeather(option)}
              />
              {option}
            </label>
          ))}
        </p>
        <p>Visibility:
          {Object.values(Visibility).map(option => (
            <label key={option}>
              <input
                type='radio'
                name='visibility'
                checked={option === visibility}
                onChange={() => setVisibility(option)}
              />
              {option}
            </label>
          ))}
        </p>
        <button type="submit">Add</button>
      </form>
    </>
  );
}

export default App
