import { useEffect, useState } from "react"
import { type Visibility, type NonSensitiveDiaryEntry, type Weather } from "./types"
import diaryService from './diaryService'

function App() {

  const [diaries, setDiaries] = useState<NonSensitiveDiaryEntry[]>([]);
  const [date, setDate] = useState('');
  const [comment, setComment] = useState('');
  const [weather, setWeather] = useState('');
  const [visibility, setVisibility] = useState('');

  useEffect(() => {
    diaryService.getAll().then(initialDiaries => {
      setDiaries(initialDiaries)
    })
  }, []);

  const diaryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault()
    diaryService.create({
      date: date, comment: comment,
      weather: weather as Weather, // left at 9.22
      visibility: visibility as Visibility, // left at 9.22
    }).then(returnedDiary => {
      setDiaries(diaries.concat(returnedDiary))
    })
    setDate('')
    setComment('')
    setWeather('')
    setVisibility('')
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
