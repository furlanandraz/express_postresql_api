import { z } from 'zod/v4';

export const ValidateRouteLayoutInsert = z.object({
    layout_type_id: z.number().min(1)
}).strip();