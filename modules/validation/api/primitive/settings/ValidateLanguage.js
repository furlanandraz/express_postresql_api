import { z } from 'zod/v4';

export const ValidateLanguage = z.object({
  code: z.string().length(2).optional().nullable(),

  is_default: z
    .string()
    .optional()
    .transform(val => val === 'true' ? true : val === 'false' ? false : null)
    .nullable(),

  is_enabled: z
    .string()
    .optional()
    .transform(val => val === 'true' ? true : val === 'false' ? false : null)
    .nullable()
}).strip();
