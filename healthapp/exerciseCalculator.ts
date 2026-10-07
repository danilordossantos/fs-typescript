interface ExercisesValues {
    target: number;
    trainingHours: number[];
}

interface ExercisesResult {
    periodLength: number;
    trainingDays: number;
    success: boolean;
    rating: number;
    ratingDescription: string;
    target: number;
    average: number;
}

const parseArgumentsExercises = (args: string[]): ExercisesValues => {
    if (args.length < 4) throw new Error('Not enough arguments');
    if (!isNaN(Number(args[2])) && !args.slice(3).map(Number).some(isNaN)) {
        return {
            target: Number(args[2]),
            trainingHours: args.slice(3).map(Number)
        };
    } else {
        throw new Error('Provided values were not numbers!');
    }
};

const calculateExercises = (target: number, trainingHours: number[]): ExercisesResult => {
    const average = trainingHours.reduce((sum, current) => {
        return sum + current;
    }, 0) / trainingHours.length;
    const percentage = average / target;
    const success = average >= target;
    let rating: number;
    let ratingDescription: string;

    if (percentage >= 1) {
        rating = 3;
        ratingDescription = 'excellent';
    } else if (percentage >= 0.7) {
        rating = 2;
        ratingDescription = 'not too bad but could be better';
    } else {
        rating = 1;
        ratingDescription = 'too bad';
    }

    return {
        periodLength: trainingHours.length,
        trainingDays: trainingHours.filter(trainingHour => trainingHour > 0).length,
        success,
        rating,
        ratingDescription,
        target,
        average
    };
};

try {
    const { target, trainingHours } = parseArgumentsExercises(process.argv);
    console.log(calculateExercises(target, trainingHours));
} catch (error: unknown) {
    let errorMessage = 'Something bad happened. ';
    if (error instanceof Error) {
        errorMessage += 'Error: ' + error.message;
    }

    console.log(errorMessage);
}
