import { useParams } from "react-router-dom";
import patientService from '../../services/patients';
import { Diagnosis, Gender, Patient } from "../../types";
import { useEffect, useState } from "react";
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';
import { assertNever } from "../../utils";
import EntryDetails from "../EntryDetails";

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
            <h1>{patient.name} <GenderIcon gender={patient.gender} /> </h1>
            <p>SSN: {patient.ssn}</p>
            <p>Occupation: {patient.occupation}</p><br />

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
