import { z } from 'zod/v4';
 
export const ValidateRoute = z.object({
  id: z.number().min(1),
  parent_id: z.number().min(1).nullable(),
  prev_id: z.number().min(1).nullable(),
  next_id: z.number().min(1).nullable(),
  render_type: z.enum(['page', 'topic']),
  render_method: z.enum(['SSR', 'SSG', 'CSR'])
}).strip().refine(
  data => data.id !== data.parent_id,
    {
      message: 'Vaulue of "id" and "parent_id" must be different.',
      path: ['id']
    }
  
).refine(
  data => !(data.parent_id === null && data.id !== 1),
    {
      message: 'Vaulue of null on "parent_id" only applicable on route "id" of 1.',
      path: ['parent_id']
    }
  
);