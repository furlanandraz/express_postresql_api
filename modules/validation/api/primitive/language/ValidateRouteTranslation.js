import { z } from 'zod/v4';

export const ValidateRouteTranslation = z.object({
    route_id: z.number().min(1),
    language_code: z.string().length(2),
    slug: z.string().min(3),
    label: z.string().min(3),
    title: z.string(),
    meta_description: z.string(),
    meta_keywords: z.string()
}).strip();