import { useParams } from "react-router-dom";
import patientService from '../../services/patients';
import { Diagnosis, Entry, EntryWithoutId, Gender, HealthCheckRating, Patient, ValidationErrorResponse } from "../../types";
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
    const [type, setType] = useState<Entry['type']>('HealthCheck');
    const [employerName, setEmployerName] = useState('');
    const [dischargeDate, setDischargeDate] = useState('');
    const [dischargeCriteria, setDischargeCriteria] = useState('');
    const [sickLeaveStart, setSickLeaveStart] = useState('');
    const [sickLeaveEnd, setSickLeaveEnd] = useState('');
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

        const buildEntry = (): EntryWithoutId => {
            const base = {
                description,
                date,
                specialist,
                diagnosisCodes: diagnosisCodes === '' ? undefined : diagnosisCodes.split(',').map(d => d.trim()),
            };

            switch (type) {
                case 'HealthCheck':
                    return {
                        ...base,
                        type: 'HealthCheck',
                        healthCheckRating: Number(healthCheckRating) as HealthCheckRating, // remove in 9.32
                    };
                case 'Hospital':
                    return {
                        ...base,
                        type: 'Hospital',
                        discharge: {
                            date: dischargeDate,
                            criteria: dischargeCriteria,
                        },
                    };
                case 'OccupationalHealthcare':
                    return {
                        ...base,
                        type: 'OccupationalHealthcare',
                        employerName,
                        sickLeave: !sickLeaveStart && !sickLeaveEnd ? undefined : {
                            startDate: sickLeaveStart,
                            endDate: sickLeaveEnd,
                        },
                    };
                default:
                    return assertNever(type);
            }
        };

        try {
            const newEntry = await patientService.addEntry(patient.id, buildEntry());
            setPatient({ ...patient, entries: patient.entries.concat(newEntry) });
            setDescription('');
            setDate('');
            setSpecialist('');
            setHealthCheckRating('');
            setDiagnosisCodes('');
            setErrorMessage('');
            setEmployerName('');
            setDischargeDate('');
            setDischargeCriteria('');
            setSickLeaveStart('');
            setSickLeaveEnd('');
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
                <p>
                    Type:
                    <select value={type} onChange={(event) => setType(event.target.value as Entry['type'])}>
                        <option value="HealthCheck">HealthCheck</option>
                        <option value="Hospital">Hospital</option>
                        <option value="OccupationalHealthcare">OccupationalHealthcare</option>
                    </select>
                </p>
                <p>Description: <input value={description} onChange={(event) => setDescription(event.target.value)} /></p>
                <p>Date: <input value={date} onChange={(event) => setDate(event.target.value)} /></p>
                <p>Specialist: <input value={specialist} onChange={(event) => setSpecialist(event.target.value)} /></p>
                <p>Diagnosis Codes: <input value={diagnosisCodes} onChange={(event) => setDiagnosisCodes(event.target.value)} /></p>
                {type === 'HealthCheck' && (
                    <p>
                        HealthCheckRating: <input value={healthCheckRating} onChange={(event) => setHealthCheckRating(event.target.value)} />
                    </p>
                )}
                {type === 'Hospital' && (
                    <>
                        <p>
                            Discharge date: <input value={dischargeDate} onChange={(event) => setDischargeDate(event.target.value)} />
                        </p>
                        <p>
                            Discharge criteria: <input value={dischargeCriteria} onChange={(event) => setDischargeCriteria(event.target.value)} />
                        </p>
                    </>
                )}
                {type === 'OccupationalHealthcare' && (
                    <>
                        <p>
                            Employer: <input value={employerName} onChange={(event) => setEmployerName(event.target.value)} />
                        </p>
                        <div>
                            Sick Leave:
                            <div>
                                Start Date: <input value={sickLeaveStart} onChange={(event) => setSickLeaveStart(event.target.value)} />
                            </div>
                            <div>
                                End Date: <input value={sickLeaveEnd} onChange={(event) => setSickLeaveEnd(event.target.value)} />
                            </div>
                        </div>
                    </>
                )}
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
