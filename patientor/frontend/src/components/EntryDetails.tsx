import { assertNever } from "../utils";
import { Diagnosis, Entry } from "../types";
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import HealthRatingBar from "./HealthRatingBar";
import { Card, CardContent, List, ListItem, ListItemText, Typography } from "@mui/material";

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
                        <Typography variant="body1">Discharge: {entry.discharge.date} {entry.discharge.criteria}</Typography>
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
                        <Typography variant="body1">Employer: {entry.employerName}</Typography>
                        {entry.sickLeave && (
                            <Typography variant="body1">
                                Sick Leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}
                            </Typography>
                        )}
                    </>
                );
            default:
                return assertNever(entry);
        }
    };

    return (
        <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
                <Typography variant="body1">{entry.date}</Typography>
                <Typography variant="body1">{entry.description}</Typography>
                {entry.diagnosisCodes && (
                    <List dense>
                        {entry.diagnosisCodes.map(code => {
                            const diagnosis = diagnoses.find(d => d.code === code);
                            return (
                                <ListItem key={code}>
                                    <ListItemText primary={code} secondary={diagnosis?.name} />
                                </ListItem>
                            );
                        })}
                    </List>
                )}
                {typeDetails()}
                <Typography variant="body1">diagnosed by {entry.specialist}</Typography>
            </CardContent>
        </Card>
    );

};



export default EntryDetails;
