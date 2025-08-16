import { z } from 'zod/v4';
 
const ValidateRoute = z.object({
  id: z.number().min(1),
  parent_id: z.number().min(1).nullable(),
  prev_id: z.number().min(1).nullable(),
  next_id: z.number().min(1).nullable(),
  render_type: z.enum(['page', 'topic']),
  render_method: z.enum(['SSR', 'SSG', 'CSR'])
})
.strip()
.refine(data => data.id !== data.parent_id, {
  message: 'Value of "id" and "parent_id" must be different.',
  path: ['parent_id']
})
.refine(data => !(data.parent_id === null && data.id !== 1), {
  message: 'Only route with id=1 can have parent_id = null.',
  path: ['parent_id']
});


export default ValidateRoute;