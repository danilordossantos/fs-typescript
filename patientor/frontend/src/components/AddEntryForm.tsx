import React, { useState } from "react";
import { Diagnosis, Entry, EntryWithoutId, HealthCheckRating } from "../types";
import { assertNever } from "../utils";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';

interface Props {
    onSubmit: (entry: EntryWithoutId) => Promise<boolean>;
    diagnoses: Diagnosis[];
}

const AddEntryForm = ({ onSubmit, diagnoses }: Props) => {
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [specialist, setSpecialist] = useState('');
    const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(HealthCheckRating.Healthy);
    const [type, setType] = useState<Entry['type']>('HealthCheck');
    const [employerName, setEmployerName] = useState('');
    const [dischargeDate, setDischargeDate] = useState('');
    const [dischargeCriteria, setDischargeCriteria] = useState('');
    const [sickLeaveStart, setSickLeaveStart] = useState('');
    const [sickLeaveEnd, setSickLeaveEnd] = useState('');
    const [selectedCodes, setSelectedCodes] = useState<Array<Diagnosis['code']>>([]);

    const buildEntry = (): EntryWithoutId => {
        const base = {
            description,
            date,
            specialist,
            diagnosisCodes: selectedCodes.length === 0 ? undefined : selectedCodes,
        };

        switch (type) {
            case 'HealthCheck':
                return {
                    ...base,
                    type: 'HealthCheck',
                    healthCheckRating,
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
            setHealthCheckRating(HealthCheckRating.Healthy);
            setEmployerName('');
            setDischargeDate('');
            setDischargeCriteria('');
            setSickLeaveStart('');
            setSickLeaveEnd('');
            setSelectedCodes([]);
        }
    };

    return (
        <Box sx={{ maxWidth: 500 }}>
            <form onSubmit={(event) => void submit(event)}>
                <Typography variant="h5" sx={{ mt: 3 }}>New Entry</Typography>
                <TextField
                    select
                    label="Type"
                    size="small"
                    fullWidth
                    margin="dense"
                    value={type}
                    onChange={({ target }) => setType(target.value as Entry['type'])}
                >
                    <MenuItem value="HealthCheck">Health Check</MenuItem>
                    <MenuItem value="Hospital">Hospital</MenuItem>
                    <MenuItem value="OccupationalHealthcare">Occupational Healthcare</MenuItem>
                </TextField>
                <TextField
                    label="Description"
                    size="small"
                    fullWidth
                    margin="dense"
                    value={description}
                    onChange={({ target }) => setDescription(target.value)}
                />
                <TextField
                    label="Date"
                    size="small"
                    fullWidth
                    margin="dense"
                    value={date}
                    onChange={({ target }) => setDate(target.value)}
                    type="date"
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        },
                    }}
                />
                <TextField
                    label="Specialist"
                    size="small"
                    fullWidth
                    margin="dense"
                    value={specialist}
                    onChange={({ target }) => setSpecialist(target.value)}
                />
                <FormControl size="small" fullWidth margin="dense">
                    <InputLabel id="diagnosisCodesSelect">Diagnosis Codes</InputLabel>
                    <Select
                        labelId="diagnosisCodesSelect"
                        label="Diagnosis Codes"
                        value={selectedCodes}
                        onChange={({ target }) => {
                            setSelectedCodes(typeof target.value === 'string' ? target.value.split(',') : target.value);
                        }}
                        multiple
                        renderValue={(selected) => selected.join(', ')}
                        >
                            {diagnoses.map(d => (
                                <MenuItem key={d.code} value={d.code}>
                                    {d.code} - {d.name}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
                {type === 'HealthCheck' && (
                    <FormControl size="small" fullWidth margin="dense">
                        <InputLabel id="healthCheckSelect">HealthCheck Rating</InputLabel>
                        <Select
                            labelId="healthCheckSelect"
                            label="HealthCheck Rating"
                            value={healthCheckRating}
                            onChange={({ target }) => {
                                if (typeof target.value === 'number') {
                                    setHealthCheckRating(target.value);
                                }
                            }}
                        >
                            {Object.entries(HealthCheckRating).map(([name, value]) => (
                                <MenuItem key={name} value={value}>
                                    {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
                {type === 'Hospital' && (
                    <>
                        <TextField
                            label="Discharge date"
                            size="small"
                            fullWidth
                            margin="dense"
                            value={dischargeDate}
                            onChange={({ target }) => setDischargeDate(target.value)}
                            type="date"
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                        />
                        <TextField
                            label="Discharge Criteria"
                            size="small"
                            fullWidth
                            margin="dense"
                            value={dischargeCriteria}
                            onChange={({ target }) => setDischargeCriteria(target.value)}
                        />
                    </>
                )}
                {type === 'OccupationalHealthcare' && (
                    <>
                        <TextField
                            label="Employer"
                            size="small"
                            fullWidth
                            margin="dense"
                            value={employerName}
                            onChange={({ target }) => setEmployerName(target.value)}
                        />
                        <Typography variant="subtitle1" sx={{ mt: 1 }}>
                            Sick leave
                        </Typography>
                        <Box sx={{ ml: 2 }}>
                            <TextField
                                label="Start Date"
                                size="small"
                                fullWidth
                                margin="dense"
                                value={sickLeaveStart}
                                onChange={({ target }) => setSickLeaveStart(target.value)}
                                type="date"
                                slotProps={{
                                    inputLabel: {
                                        shrink: true,
                                    },
                                }}
                            />
                            <TextField
                                label="End Date"
                                size="small"
                                fullWidth
                                margin="dense"
                                value={sickLeaveEnd}
                                onChange={({ target }) => setSickLeaveEnd(target.value)}
                                type="date"
                                slotProps={{
                                    inputLabel: {
                                        shrink: true,
                                    },
                                }}
                            />
                        </Box>
                    </>
                )}
                <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                    Add
                </Button>
            </form>
        </Box>
    );
};

export default AddEntryForm;
