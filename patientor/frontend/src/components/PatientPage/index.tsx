import { useParams } from "react-router-dom";
import patientService from '../../services/patients';
import { Diagnosis, EntryWithoutId, Gender, Patient, ValidationErrorResponse } from "../../types";
import { useEffect, useState } from "react";
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';
import { assertNever } from "../../utils";
import EntryDetails from "../EntryDetails";
import axios from "axios";
import AddEntryForm from "../AddEntryForm";

interface Props {
    diagnoses: Diagnosis[]
}

const GenderIcon = ({ gender }: { gender: Gender }) => {
    switch (gender) {
        case Gender.Male:
            return <MaleIcon />;
        case Gender.Female:
            return <FemaleIcon />;
        case Gender.Other:
            return <TransgenderIcon />;
        default:
            return assertNever(gender);
    }
};

const PatientPage = ({ diagnoses }: Props) => {
    const [patient, setPatient] = useState<Patient>();
    const [errorMessage, setErrorMessage] = useState('');
    const params = useParams();

    useEffect(() => {
        const fetchPatientPage = async () => {
            if (params.id) {
                const patient = await patientService.getPatient(params.id);
                setPatient(patient);
            }
        };
        void fetchPatientPage();
    }, [params.id]);

    const submitNewEntry = async (entry: EntryWithoutId): Promise<boolean> => {
        if (!patient) {
            return false;
        }

        try {
            const newEntry = await patientService.addEntry(patient.id, entry);
            setPatient({ ...patient, entries: patient.entries.concat(newEntry) });
            setErrorMessage('');
            return true;
        } catch (error: unknown) {
            if (axios.isAxiosError<ValidationErrorResponse>(error)) {
                const data = error.response?.data;
                if (data) {
                    const message = data.error.map(item => `${item.path.join('.')}: ${item.message}`).join(', ');
                    setErrorMessage(message);
                } else {
                    setErrorMessage('Something went wrong');
                }
            }
            return false;
        }
    };

    if (!patient) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <h1>{patient.name} <GenderIcon gender={patient.gender} /> </h1>
            <p>SSN: {patient.ssn}</p>
            <p>Occupation: {patient.occupation}</p><br />
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <AddEntryForm onSubmit={submitNewEntry} />
            <h2>Entries</h2>
            {patient.entries.length === 0 ? (
                <p>No entries</p>
            ) : (patient.entries.map(entry => (
                <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
            )))}
        </>
    );
};

export default PatientPage;
