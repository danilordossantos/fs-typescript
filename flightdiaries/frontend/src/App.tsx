import { useEffect, useState } from "react"
import type { NonSensitiveDiaryEntry } from "./types"
import diaryService from './diaryService'

function App() {

  const [diaries, setDiaries] = useState<NonSensitiveDiaryEntry[]>([]);

  useEffect(() => {
    diaryService.getAll().then(initialDiaries => {
      setDiaries(initialDiaries)
    })
  }, []);

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
    </>
  );
}

export default App
