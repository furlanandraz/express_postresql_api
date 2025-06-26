import { z } from 'zod/v4';

const ValidateLanguage = z.object({
    code: z.string().length(2),
    is_default: z.boolean().optional(),
    is_enabled: z.boolean().optional()
}).strip();

export default ValidateLanguage;