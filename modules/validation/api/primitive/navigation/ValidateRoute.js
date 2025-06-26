import { z } from 'zod/v4';
 
const ValidateRoute = z.object({
  id: z.number().min(1).optional(),
  parent_id: z.number().min(1).optional(),
  render_type: z.enum(['page', 'topic']).optional(),
  render_method: z.enum(['SSR', 'SSG', 'CSR']).optional()
}).strip().refine(
  data => data.id !== undefined || data.parent_id !== undefined,
  {
    message: 'One of "id" and "parent_id" must be provided.',
    path: ['id']
  }
);


export default ValidateRoute;