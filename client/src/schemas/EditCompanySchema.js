import { z } from 'zod';

const numRegEx = /^\+?[0-9]{9,15}$/;

const personNameRegEx = /^[\p{L}\p{M}]+(?:[ '-][\p{L}\p{M}]+)*$/u;

const noEmojiRegEx = /^(?!.*\p{Extended_Pictographic}).*$/u;

export const editCompanySchema = z.object({
  company_title: z
    .string({ message: 'Campo obligatorio' })
    .min(3, { message: 'Debe ser mayor de 3 caracteres' })
    .max(50, { message: 'Debe ser menor de 50 caracteres' })
    .trim()
    .regex(noEmojiRegEx, {message:"Deben ser caracteres válidos"}),

  email: z
    .string({ message: 'Campo obligatorio' })
    .email({ message: 'Email no válido' })
    .trim(),

  linkedin: z
    .string()
    .url({ message: 'Debe ser una URL válida' })
    .or(z.literal(''))
    .nullable()
    .optional(),

  address: z
    .string({ message: 'Campo obligatorio' })
    .min(3, { message: 'Debe ser mayor de 3 caracteres' })
    .max(100, { message: 'Debe ser menos de 100 caracteres' }),

  zip_code: z
  .string({ message: 'Campo obligatorio' })
  .trim()
  .min(1, { message: 'Campo obligatorio' })
  .regex(/^\d{5}$/, { message: 'El código postal es obligatorio y debe contener exactamente 5 números' }),

  province_id: z.coerce
    .number({ errorMap: () => ({ message: 'Provincia no válida o no seleccionada' }) })
    .min(1, { message: 'Provincia no válida o no seleccionada' }),

  city_id: z.coerce
    .number({ errorMap: () => ({ message: 'Debes seleccionar una ciudad de la lista' }) })
    .min(1, { message: 'Debes seleccionar una ciudad de la lista' }),

  company_description: z
    .string()
    .max(500, { message: 'La descripción no puede superar los 500 caracteres' })
    .nullable()
    .optional(),

  name: z
    .string({ message: 'Campo obligatorio' })
    .min(3, { message: 'Debe ser mayor de 3 caracteres' })
    .max(50, { message: 'Debe ser menor de 50 caracteres' })
    .regex(personNameRegEx, {message:"Deben ser caracteres válidos"})
    .trim(),

  lastname: z
    .string({ message: 'Campo obligatorio' })
    .min(3, { message: 'Debe ser mayor de 3 caracteres' })
    .max(50, { message: 'Debe ser menor de 50 caracteres' })
    .trim(),

  phone_number: z
    .string({ message: 'Campo obligatorio' })
    .regex(numRegEx, { message: 'El teléfono introducido no es válido' }),
});