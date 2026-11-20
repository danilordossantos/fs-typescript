import { useParams } from "react-router-dom";
import patientService from '../../services/patients';
import { Diagnosis, Gender, HealthCheckRating, Patient, ValidationErrorResponse } from "../../types";
import React, { useEffect, useState } from "react";
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';
import { assertNever } from "../../utils";
import EntryDetails from "../EntryDetails";
import axios from "axios";

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
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [specialist, setSpecialist] = useState('');
    const [healthCheckRating, setHealthCheckRating] = useState('');
    const [diagnosisCodes, setDiagnosisCodes] = useState('');
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

    const entryCreation = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        if (!patient) {
            return;
        }
        try {
            const newEntry = await patientService.addEntry(patient.id, {
                type: 'HealthCheck',
                description,
                date,
                specialist,
                healthCheckRating: Number(healthCheckRating) as HealthCheckRating,
                diagnosisCodes: diagnosisCodes === '' ? undefined : diagnosisCodes.split(',').map(d => d.trim())
            });
            setPatient({...patient, entries: patient.entries.concat(newEntry)});
            setDescription('');
            setDate('');
            setSpecialist('');
            setHealthCheckRating('');
            setDiagnosisCodes('');
            setErrorMessage('');
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

            <form onSubmit={(event) => void entryCreation(event)}>
                <h2>New Entry</h2>
                <p>Description: <input value={description} onChange={(event) => setDescription(event.target.value)} /></p>
                <p>Date: <input value={date} onChange={(event) => setDate(event.target.value)} /></p>
                <p>Specialist: <input value={specialist} onChange={(event) => setSpecialist(event.target.value)} /></p>
                <p>HealthCheckRating: <input value={healthCheckRating} onChange={(event) => setHealthCheckRating(event.target.value)} /></p>
                <p>Diagnosis Codes: <input value={diagnosisCodes} onChange={(event) => setDiagnosisCodes(event.target.value)} /></p>
                <button type="submit">Submit</button>
            </form><br />

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
