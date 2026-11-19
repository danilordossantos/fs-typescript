import { z } from 'zod';

export interface Diagnosis {
    code: string;
    name: string;
    latin?: string;
}

export const Gender = {
    Female: 'female',
    Male: 'male',
    Other: 'other',
} as const;

export type Gender = typeof Gender[keyof typeof Gender];

export const NewPatientSchema = z.object({
    name: z.string().trim().min(1),
    dateOfBirth: z.iso.date(),
    ssn: z.string().trim().min(1),
    gender: z.enum(Gender),
    occupation: z.string().trim().min(1)
});

export type NewPatient = z.infer<typeof NewPatientSchema>;
export interface Patient extends NewPatient {
    id: string;
    entries: Entry[]
}
export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;

interface BaseEntry {
    id: string;
    description: string;
    date: string;
    specialist: string;
    diagnosisCodes?: Array<Diagnosis['code']>;
}

const BaseEntrySchema = z.object({
    description: z.string().trim().min(1),
    date: z.iso.date(),
    specialist: z.string().trim().min(1),
    diagnosisCodes: z.array(z.string()).optional(),
});

export const HealthCheckRating = {
    Healthy: 0,
    LowRisk: 1,
    HighRisk: 2,
    CriticalRisk: 3,
} as const;

type HealthCheckRating = typeof HealthCheckRating[keyof typeof HealthCheckRating];

interface HealthCheckEntry extends BaseEntry {
    type: "HealthCheck";
    healthCheckRating: HealthCheckRating;
}

const HealthCheckEntrySchema = BaseEntrySchema.extend({
    type: z.literal('HealthCheck'),
    healthCheckRating: z.union([
        z.literal(HealthCheckRating.Healthy),
        z.literal(HealthCheckRating.LowRisk),
        z.literal(HealthCheckRating.HighRisk),
        z.literal(HealthCheckRating.CriticalRisk),
    ],
        { error: 'healthCheckRating must be 0, 1, 2 or 3' }
    ),
});

interface OccupationalHealthcareEntry extends BaseEntry {
    type: "OccupationalHealthcare";
    sickLeave?: { startDate: string, endDate: string };
    employerName: string;
}

const OccupationalHealthcareEntrySchema = BaseEntrySchema.extend({
    type: z.literal('OccupationalHealthcare'),
    sickLeave: z.object({
        startDate: z.iso.date(),
        endDate: z.iso.date(),
    }).optional(),
    employerName: z.string().trim().min(1),
});

interface HospitalEntry extends BaseEntry {
    type: "Hospital";
    discharge: { date: string, criteria: string }
}

const HospitalEntrySchema = BaseEntrySchema.extend({
    type: z.literal('Hospital'),
    discharge: z.object({
        date: z.iso.date(),
        criteria: z.string().trim().min(1),
    }),
});

export type Entry =
    | HospitalEntry
    | OccupationalHealthcareEntry
    | HealthCheckEntry;

export const NewEntrySchema = z.discriminatedUnion('type', [
    HealthCheckEntrySchema,
    OccupationalHealthcareEntrySchema,
    HospitalEntrySchema,
]);

type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;

export type EntryWithoutId = UnionOmit<Entry, 'id'>;
