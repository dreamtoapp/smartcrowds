import { z } from 'zod';
import { validateSaudiID } from './saudi-id';

// Schema for basic event creation (without requirements and jobs)
export const eventBasicSchema = z.object({
  title: z.string().min(2, 'Title is too short'),
  date: z.string().min(1, 'Date is required'),
  description: z.string().min(2, 'Description is too short'),
  imageUrl: z.string().url().optional().or(z.literal('')).default(''),
  locationId: z.string().min(1, 'Location is required'),
});

export type EventBasicInput = z.infer<typeof eventBasicSchema>;

// Full schema for backward compatibility
export const eventInputSchema = z.object({
  title: z.string().min(2, 'Title is too short'),
  date: z.string().min(1, 'Date is required'),
  description: z.string().min(2, 'Description is too short'),
  imageUrl: z.string().url().optional().or(z.literal('')).default(''),
  requirements: z.array(z.string().min(1)).default([]),
  locationId: z.string().min(1, 'Location is required'),
  jobs: z
    .array(
      z.object({
        jobId: z.string().min(1, 'Job is required'),
        ratePerDay: z.number().positive('Rate per day must be a positive number'),
      })
    )
    .default([]),
});

export type EventInput = z.infer<typeof eventInputSchema>;

// Schema for event job requirement
export const eventJobRequirementSchema = z.object({
  jobId: z.string().min(1, 'Job is required'),
  ratePerDay: z.number().positive('Rate per day must be a positive number'),
});

export type EventJobRequirementInput = z.infer<typeof eventJobRequirementSchema>;

// Schema for managing requirements and jobs together
export const eventRequirementsJobsSchema = z.object({
  requirements: z.array(z.string().min(1)).default([]),
  jobs: z.array(eventJobRequirementSchema).default([]),
});

// Schema for reading job requirement (allows null for existing data)
export const eventJobRequirementReadSchema = z.object({
  jobId: z.string().min(1, 'Job is required'),
  ratePerDay: z.number().positive('Rate per day must be a positive number').nullable(),
});

export type EventRequirementsJobsInput = z.infer<typeof eventRequirementsJobsSchema>;

export const eventSchema = eventInputSchema.extend({
  id: z.string(),
  createdAt: z.number(),
});

export type EventItem = z.infer<typeof eventSchema>;

// Function to create registration schema with locale-aware messages
export function createRegistrationInputSchema(
  translations: {
    eventIdRequired: string;
    nameTooShort: string;
    mobileTooShort: string;
    invalidEmail: string;
    idNumberRequired: string;
    idNumberInvalid: string;
    idNumberNotString: string;
    nationalityRequired: string;
    agePositive: string;
    ageMin: string;
    ageMax: string;
    agreeRequired: string;
    idNumberDigitsOnly: string;
    idNumberLength: string;
    idNumberInvalidFormat: string;
    idNumberCheckDigit: string;
    jobRequired: string;
    idImageRequired: string;
    personalImageRequired: string;
    nameTooLong: string;
    mobileTooLong: string;
    emailTooLong: string;
  },
  hasJobs: boolean = false
) {
  return z.object({
    eventId: z.string().min(1, translations.eventIdRequired),
    jobRequirementId: hasJobs 
      ? z.string().min(1, translations.jobRequired)
      : z.string().optional(),
    name: z.string().min(2, translations.nameTooShort).max(100, translations.nameTooLong),
    mobile: z.string().min(5, translations.mobileTooShort).max(15, translations.mobileTooLong),
    email: z.string().email(translations.invalidEmail).max(255, translations.emailTooLong),
    idNumber: z.string()
      .min(10, translations.idNumberLength)
      .max(10, translations.idNumberLength)
      .superRefine((val, ctx) => {
        if (typeof val !== 'string') {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: translations.idNumberNotString });
          return;
        }
        const validation = validateSaudiID(val, {
          notString: translations.idNumberNotString,
          digitsOnly: translations.idNumberDigitsOnly,
          length: translations.idNumberLength,
          invalidFormat: translations.idNumberInvalidFormat,
          checkDigit: translations.idNumberCheckDigit,
        });
        if (!validation.valid) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: validation.error || translations.idNumberInvalid });
        }
      }),
    nationalityId: z.string().min(1, translations.nationalityRequired),
    age: z.coerce.number().int().positive(translations.agePositive).min(1, translations.ageMin).max(150, translations.ageMax),
    idImageUrl: z.string().min(1, translations.idImageRequired),
    personalImageUrl: z.string().min(1, translations.personalImageRequired),
    agreeToRequirements: z.boolean().refine((v) => v === true, { message: translations.agreeRequired }),
  });
}

// Default schema (backward compatibility - uses English)
export const registrationInputSchema = z.object({
  eventId: z.string().min(1, 'Event ID is required'),
  jobRequirementId: z.string().optional(),
  name: z.string().min(2, 'Name is too short'),
  mobile: z.string().min(5, 'Mobile number is too short'),
  email: z.string().email('Invalid email'),
  idNumber: z.string()
    .min(1, 'ID number is required')
    .superRefine((val, ctx) => {
      if (typeof val !== 'string') {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid ID number' });
        return;
      }
      const validation = validateSaudiID(val);
      if (!validation.valid) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: validation.error || 'Invalid ID number' });
      }
    }),
  nationalityId: z.string().min(1, 'Nationality is required'),
  age: z.coerce.number().int().positive('Age must be a positive number').min(1, 'Age must be at least 1').max(150, 'Age must be at most 150'),
  idImageUrl: z.string().url().optional().or(z.literal('')).default(''),
  personalImageUrl: z.string().url().optional().or(z.literal('')).default(''),
  agreeToRequirements: z.boolean().refine((v) => v === true, { message: 'You must agree to the requirements' }),
});

export type RegistrationInput = z.infer<typeof registrationInputSchema>;


