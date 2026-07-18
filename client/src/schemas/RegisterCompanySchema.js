import { z } from 'zod';

const passRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/;

const nifCifRegEx = /^(?:[0-9]{8}[A-Z]|[XYZ][0-9]{7}[A-Z]|[A-Z][0-9]{7}[0-9A-Z])$/;

const numRegEx = /^\+?[0-9]{9,15}$/;

const personNameRegEx = /^[\p{L}\p{M}]+(?:[ '-][\p{L}\p{M}]+)*$/u;

const noEmojiRegEx = /^(?!.*\p{Extended_Pictographic}).*$/u;

export const RegisterCompanySchema = z
  .object({
    email: z
      .string({ message: 'Campo obligatorio' })
      .email({ message: 'Email no valido' })
      .trim(),
    repEmail: z.string(),
    password: z
      .string({ message: 'Campo obligatorio' })
      .min(6, { message: 'Debe ser mayor de 6 caracteres' })
      .max(20, { message: 'Deben ser menos de 20 caracteres' })
      .regex(passRegEx, {message:"Contraseña poco segura, debe contener mayuscula/s, minuscula/s, número/s y carácter especial"}),
    repPassword: z.string(),
    company_title: z
      .string({ message: 'Campo obligatorio' })
      .min(3, { message: 'Debe ser mayor de 3 caracteres' })
      .max(50, { message: 'Debe ser menor de 50 caracteres' })
      .regex(noEmojiRegEx, {message:"Deben ser caracteres válidos"})
      .trim(),
    name: z
      .string({ message: 'Campo obligatorio' })
      .min(3, { message: 'Debe ser mayor de 3 caracteres' })
      .max(50, { message: 'Debe ser menor de 50 caracteres' })
      .regex(personNameRegEx, {message:"Deben ser caracteres válidos"})
      .trim(),
    phone_number: z
      .string({ message: 'Campo obligatorio' })
      .regex(numRegEx, { message: 'El teléfono introducido no es válido' }),
    address: z
      .string({ message: 'Campo obligatorio' })
      .min(3, { message: 'Debe ser mayor de 3 caracteres' })
      .max(100, { message: 'Debe ser menos de 100 caracteres' }),
    identification: z
      .string({ message: 'Campo obligatorio' })
      .toUpperCase()
      .length(9, {
        message: 'El documento debe tener exactamente 9 carácteres',
      })
      .regex(nifCifRegEx, { message: 'Formato no válido' }),
    terms: z
    .literal(true, {message:"Debes aceptar la política de privacidad y los términos y condiciones"}),
    city_id: z.coerce
      .number({ errorMap: () => ({ message: 'Debes seleccionar una ciudad de la lista' }) })
      .min(1, { message: 'Debes seleccionar una ciudad de la lista' }),

    province_id: z.coerce
      .number({ errorMap: () => ({ message: 'Provincia no válida o no seleccionada' }) })
      .min(1, { message: 'Provincia no válida o no seleccionada' }),
  })
  .refine((data) => data.email === data.repEmail, {
    message: 'Los emails no coinciden',
    path: ['repEmail'],
  })
  .refine((data) => data.password === data.repPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['repPassword'],
  });