import express, { type Request, type Response } from 'express';
import patientService from '../services/patientService.ts';
import { type NewPatient, type NonSensitivePatient, type Patient } from '../types.ts';
import { newPatientParser, errorMiddleware } from '../middleware.ts';

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

router.use(errorMiddleware);

export default router;
