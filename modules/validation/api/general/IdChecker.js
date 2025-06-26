import { z } from 'zod/v4';

const IdChecker = z.object({
  id: z.number().min(1)
}).strip();


export default IdChecker;