import express from 'express';
import { calculateBmi } from './bmiCalculator.ts';
const app = express();

app.get('/hello', (_req, res) => {
    res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
    const reqHeight = Number(req.query.height);
    const reqWeight = Number(req.query.weight);

    if (!reqHeight || !reqWeight) {
        res.status(400).json({error: 'malformatted parameters'});
    } else {
        res.json({height: reqHeight, weight: reqWeight, bmi: calculateBmi(reqHeight, reqWeight)});
    }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
