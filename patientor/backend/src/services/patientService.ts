import { v1 as uuid } from 'uuid';
import patients from '../../data/patients.ts';
import type { Patient, NonSensitivePatient, NewPatient } from '../types.ts';

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

export default { getPatients, getNonSensitivePatients, addPatient, getPatient };
