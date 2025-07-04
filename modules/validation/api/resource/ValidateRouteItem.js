import { z } from 'zod/v4';

import {ValidateRouteTranslation} from '#validation/api/primitive/language/ValidateRouteTranslation.js';

export const ValidateRouteItemInsert = z.object({
    parent_id: z.number().min(1),
    prev_id: z.number().min(1).nullable(),
    next_id: z.number().min(1).nullable(),
    render_type: z.enum(['page', 'topic']),
    render_method: z.enum(['SSR', 'SSG', 'CSR']),
    translation: z.array(ValidateRouteTranslation.omit({'route_id': true})).min(1)
}).strip();

export const ValidateRouteItemUpdate = z.object({
    id: z.number().min(1),
    parent_id: z.number().min(1),
    render_type: z.enum(['page', 'topic']),
    render_method: z.enum(['SSR', 'SSG', 'CSR']),
    prev_id: z.number().min(1).nullable(),
    next_id: z.number().min(1).nullable(),
    translation: z.array(ValidateRouteTranslation.omit({'route_id': true})).min(1)
}).strip();
  
