import express from 'express';
import { calculateBmi } from './bmiCalculator.ts';
import { calculateExercises } from './exerciseCalculator.ts';
const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
    res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
    const reqHeight = Number(req.query.height);
    const reqWeight = Number(req.query.weight);

    if (!reqHeight || !reqWeight) {
        res.status(400).json({ error: 'malformatted parameters' });
    } else {
        res.json({ height: reqHeight, weight: reqWeight, bmi: calculateBmi(reqHeight, reqWeight) });
    }
});

app.post('/exercises', (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    const target = req.body.target;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    const daily_exercises = req.body.daily_exercises;

    if (target === undefined || daily_exercises === undefined) {
        res.status(400).json({ error: 'parameters missing' });
    } else if (isNaN(Number(target)) || !Array.isArray(daily_exercises) || daily_exercises.map(Number).some(isNaN)) {
        res.status(400).json({ error: 'malformatted parameters' });
    } else {
        res.json(calculateExercises(Number(target), daily_exercises.map(Number)));
    }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
