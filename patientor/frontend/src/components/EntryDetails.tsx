import { assertNever } from "../utils";
import { Diagnosis, Entry } from "../types";
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import HealthRatingBar from "./HealthRatingBar";

interface Props {
    entry: Entry;
    diagnoses: Diagnosis[];
}

const EntryDetails = ({ entry, diagnoses }: Props) => {
    const typeDetails = () => {
        switch (entry.type) {
            case "Hospital":
                return (
                    <>
                        <LocalHospitalIcon />
                        <p>Discharge: {entry.discharge.date} {entry.discharge.criteria}</p>
                    </>
                );
            case "HealthCheck":
                return (
                    <>
                        <MonitorHeartIcon />
                        <HealthRatingBar showText={false} rating={entry.healthCheckRating} />
                    </>
                );
            case "OccupationalHealthcare":
                return (
                    <>
                        <HealthAndSafetyIcon />
                        <p>Employer: {entry.employerName}</p>
                        {entry.sickLeave && (
                            <p>
                                Sick Leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}
                            </p>
                        )}
                    </>
                );
            default:
                return assertNever(entry);
        }
    };

    return (
        <div style={{ border: '1px solid gray', borderRadius: 5, padding: 10, marginBottom: 10 }}>
            <p>{entry.date}</p>
            <p>{entry.description}</p>
            {entry.diagnosisCodes && (
                <ul>
                    {entry.diagnosisCodes.map(code => {
                        const diagnosis = diagnoses.find(d => d.code === code);
                        return <li key={code}>{code} {diagnosis?.name}</li>;
                    })}
                </ul>
            )}
            {typeDetails()}
            <p>diagnosed by {entry.specialist}</p>
        </div>
    );

};



export default EntryDetails;
