interface ExercisesResult {
    periodLength: number;
    trainingDays: number;
    success: boolean;
    rating: number;
    ratingDescription: string;
    target: number;
    average: number;
}

const calculateExercises = (trainingHours: number[], target: number): ExercisesResult => {
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

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));

