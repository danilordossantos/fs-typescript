import axios from "axios";
import type { DiaryEntry, NewDiaryEntry, NonSensitiveDiaryEntry } from "./types";

const baseUrl = '/api/diaries';

const getAll = () => {
    return axios
        .get<NonSensitiveDiaryEntry[]>(baseUrl)
        .then(response => response.data)
}

const create = (object: NewDiaryEntry) => {
    return axios
        .post<DiaryEntry>(baseUrl, object)
        .then(response => response.data)
}

export default { getAll, create };
