import { z } from 'zod';

const noEmojiRegEx = /^(?!.*\p{Extended_Pictographic}).*$/u;

export const CreatePackSchema = z.object({
  name: z
    .string({ message: 'Campo obligatorio' })
    .min(3, { message: 'Debe ser mayor de 3 caracteres' })
    .max(50, { message: 'Debe ser menor de 50 caracteres' })
    .regex(noEmojiRegEx, {message:"Deben ser caracteres válidos"})
    .trim(),

  price: z
    .string({ message: 'Campo obligatorio' })
    .min(1, { message: 'Campo obligatorio' })
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'El precio debe ser un número mayor a 0',
    }),

  included_offers: z
    .string({ message: 'Campo obligatorio' })
    .min(1, { message: 'Campo obligatorio' })
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), { message: 'Debe introducir un número válido' })
    .refine((val) => val >= 1, { message: 'Debe incluir al menos 1 oferta' })
    .refine((val) => val <= 255, { message: 'El número máximo de ofertas permitidas es 255' }),

  description: z
    .string()
    .max(255, { message: 'Debe ser menor de 255 caracteres' })
    .trim()
    .optional()
    .or(z.literal('')),
});
