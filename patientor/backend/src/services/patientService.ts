import { v1 as uuid } from 'uuid';
import patients from '../../data/patients.ts';
import type { Patient, NonSensitivePatient, NewPatient, Entry, EntryWithoutId } from '../types.ts';

const getPatients = (): Patient[] => {
    return patients;
};

const getNonSensitivePatients = (): NonSensitivePatient[] => {
    return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation,
    }));
};

const addPatient = (patient: NewPatient): Patient => {
    const newPatient = {
        ...patient,
        id: uuid(),
        entries: []
    };

    patients.push(newPatient);
    return newPatient;
};

const getPatient = (id: string): Patient | undefined => {
    return patients.find(p => p.id === id);
};

const addEntry = (patientId: string, entry: EntryWithoutId): Entry | undefined => {
    const patient = getPatient(patientId);
    if (!patient) {
        return undefined;
    }
    const newEntry = {
        ...entry,
        id: uuid(),
    };

    patient.entries.push(newEntry);
    return newEntry;
};

export default { getPatients, getNonSensitivePatients, addPatient, getPatient, addEntry };
