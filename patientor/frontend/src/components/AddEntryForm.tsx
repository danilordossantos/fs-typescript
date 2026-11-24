import React, { useState } from "react";
import { Entry, EntryWithoutId, HealthCheckRating } from "../types";
import { assertNever } from "../utils";

interface Props {
    onSubmit: (entry: EntryWithoutId) => Promise<boolean>
}

const AddEntryForm = ({ onSubmit }: Props) => {
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [specialist, setSpecialist] = useState('');
    const [healthCheckRating, setHealthCheckRating] = useState('');
    const [diagnosisCodes, setDiagnosisCodes] = useState('');
    const [type, setType] = useState<Entry['type']>('HealthCheck');
    const [employerName, setEmployerName] = useState('');
    const [dischargeDate, setDischargeDate] = useState('');
    const [dischargeCriteria, setDischargeCriteria] = useState('');
    const [sickLeaveStart, setSickLeaveStart] = useState('');
    const [sickLeaveEnd, setSickLeaveEnd] = useState('');

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

    const submit = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        const ok = await onSubmit(buildEntry());
        if (ok) {
            setDescription('');
            setDate('');
            setSpecialist('');
            setHealthCheckRating('');
            setDiagnosisCodes('');
            setEmployerName('');
            setDischargeDate('');
            setDischargeCriteria('');
            setSickLeaveStart('');
            setSickLeaveEnd('');
        }
    };

    return (
        <form onSubmit={(event) => void submit(event)}>
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
        </form>
    );
};

export default AddEntryForm;
