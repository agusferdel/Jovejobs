import {z} from 'zod';

const noEmojiRegEx = /^(?!.*\p{Extended_Pictographic}).*$/u;

export const newLanguageSchema = z.object({
  name: z
    .string({ message: "Campo obligatorio" })
    .trim()
    .min(2, { message: "Debe tener al menos 2 caracteres" })
    .max(50, { message: "Debe ser menor de 50 caracteres" })
    .regex(noEmojiRegEx, {message:"Deben ser caracteres válidos"}),

  level: z
    .string({ message: "Campo obligatorio" })
    .trim()
    .min(1, { message: "Campo obligatorio" })
    .max(50, { message: "Debe ser menor de 50 caracteres" })
    .regex(noEmojiRegEx, {message:"Deben ser caracteres válidos"}),

  description: z
    .string()
    .trim()
    .max(300, { message: "Debe ser menor de 300 caracteres" })
    .optional()
    .or(z.literal(""))
    
});