import { useParams } from "react-router-dom";
import patientService from '../../services/patients';
import { Patient } from "../../types";
import { useEffect, useState } from "react";



const PatientPage = () => {
    const [patient, setPatient] = useState<Patient>();
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

    if (!patient) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <h1>Name: {patient.name} </h1>
            <p>Gender: {patient.gender}</p>
            <p>SSN: {patient.ssn}</p>
            <p>Occupation: {patient.occupation}</p>

            <h2>Entries</h2>
            { patient.entries.length === 0 ? (
                <p>No entries</p>
             ) : (patient.entries.map(entry => (
                <div key={entry.id}>
                    <p>{entry.date} {entry.description}</p>
                    {entry.diagnosisCodes && (
                        <ul>
                            {entry.diagnosisCodes.map(code => (
                                <li key={code}>{code}</li>
                            ))}
                        </ul>
                    )}
                </div>
            )))}
        </>
    );
};

export default PatientPage;
