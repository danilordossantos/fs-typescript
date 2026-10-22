import type { NewPatient } from "./types.ts";

const parseNewPatient = (object: unknown): NewPatient => {
    if (!object || typeof object !== 'object') {
        throw new Error('Incorrect or missing data');
    }

    if ('name' in object && 'ssn' in object && 'occupation' in object && 'dateOfBirth' in object) {
        const newPatient: NewPatient = {
            name: parseString(object.name, 'name'),
            dateOfBirth: parseDate(object.dateOfBirth),
            ssn: parseString(object.ssn, 'ssn'),
            gender: 'male',
            occupation: parseString(object.occupation, 'occupation')
        };

        return newPatient;
    }

    throw new Error('Incorrect data: some fields are missing');
};

const isString = (text: unknown): text is string => {
    return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
    return !isNaN(Date.parse(date));
};

const parseString = (value: unknown, field: string): string => {
    if (!isString(value) || !value.trim()) {
        throw new Error(`Incorrect or missing ${field}`);
    }

    return value;
};

const parseDate = (date: unknown): string => {
    if (!isString(date) || !isDate(date)) {
        throw new Error('Incorrect or missing dateOfBirth');
    }
    return date;
};

export default parseNewPatient;
