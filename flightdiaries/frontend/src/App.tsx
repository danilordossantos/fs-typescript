import { useEffect, useState } from 'react'
import { type Visibility, type NonSensitiveDiaryEntry, type Weather, type ValidationErrorResponse } from './types'
import diaryService from './diaryService'
import axios from 'axios';

function App() {

  const [diaries, setDiaries] = useState<NonSensitiveDiaryEntry[]>([]);
  const [date, setDate] = useState('');
  const [comment, setComment] = useState('');
  const [weather, setWeather] = useState('');
  const [visibility, setVisibility] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    diaryService.getAll().then(initialDiaries => {
      setDiaries(initialDiaries)
    })
  }, []);

  const diaryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault()
    diaryService.create({
      date: date, comment: comment,
      weather: weather as Weather, // remove in 9.22
      visibility: visibility as Visibility, // remove in 9.22
    })
      .then(returnedDiary => {
        setDiaries(diaries.concat(returnedDiary))
        setDate('')
        setComment('')
        setWeather('')
        setVisibility('')
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
        <p>Date: <input value={date} onChange={(event) => setDate(event.target.value)} /></p>
        <p>Comment: <input value={comment} onChange={(event) => setComment(event.target.value)} /></p>
        <p>Weather: <input value={weather} onChange={(event) => setWeather(event.target.value)} /></p>
        <p>Visibility: <input value={visibility} onChange={(event) => setVisibility(event.target.value)} /></p>
        <button type="submit">Add</button>
      </form>
    </>
  );
}

export default App
