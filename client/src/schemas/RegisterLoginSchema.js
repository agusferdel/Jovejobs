import { z } from 'zod';
export const RegisterLoginSchema = z
  .object({
    email: z
    .string({message: 'Campo obligatorio'})
    .email({message: 'Email no valido'})
    .trim(),
    password: z
    .string({message: 'Campo obligatorio'})
    .min(6, {message: 'Debe ser mayor de 6 carácteres'})
    .max(20, {message: 'Debe ser menos de 20 carácteres'}),
  })
