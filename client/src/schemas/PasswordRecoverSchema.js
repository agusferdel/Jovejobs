import { z } from 'zod';

export const PasswordRecoverSchema = z
  .object({
    email: z
    .string({message: 'Campo obligatorio'})
    .email({message: 'Email no válido'})
    .trim()
  })
