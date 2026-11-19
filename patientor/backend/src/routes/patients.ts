import express, { type Request, type Response } from 'express';
import patientService from '../services/patientService.ts';
import { type Entry, type EntryWithoutId, type NewPatient, type NonSensitivePatient, type Patient } from '../types.ts';
import { newPatientParser, errorMiddleware, newEntryParser } from '../middleware.ts';

const router = express.Router();

router.get('/', (_req, res: Response<NonSensitivePatient[]>) => {
    const data = patientService.getNonSensitivePatients();
    res.send(data);
});

router.get('/:id', (req, res: Response<Patient>) => {
    const patient = patientService.getPatient(req.params.id);
    if (patient) {
        res.send(patient);
    } else {
        res.sendStatus(404);
    }
});

router.post('/', newPatientParser, (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
    const addedPatient = patientService.addPatient(req.body);
    res.json(addedPatient);
});

router.post('/:id/entries', newEntryParser, (req: Request<{ id: string }, unknown, EntryWithoutId>, res: Response<Entry>) => {
    const addedEntry = patientService.addEntry(req.params.id, req.body);
    if (!addedEntry) {
        res.sendStatus(404);
    } else {
        res.status(201).json(addedEntry);
    }
});

router.use(errorMiddleware);

export default router;
