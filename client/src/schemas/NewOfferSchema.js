import { z } from 'zod';

const noEmojiRegEx = /^(?!.*\p{Extended_Pictographic}).*$/u;

export const NewOfferSchema = z
.object({
  title: z
    .string({ required_error: 'El cargo es obligatorio' })
    .min(3, { message: 'El cargo debe tener al menos 3 caracteres' })
    .max(100, { message: 'El cargo no puede superar los 100 caracteres' })
    .regex(noEmojiRegEx, {message:"Deben ser caracteres válidos"})
    .trim(),
  modality: z.coerce
      .number({ errorMap: () => ({ message: 'Debes seleccionar una modalidad de trabajo' }) })
      .min(1, { message: 'Debes seleccionar una modalidad de trabajo' }),
  job_id: z.coerce
    .number({ errorMap: () => ({ message: 'Debes seleccionar un área de trabajo' }) })
    .min(1, { message: 'Debes seleccionar un área de trabajo' }),
  city_id: z.coerce
    .number({ errorMap: () => ({ message: 'Debes seleccionar una ciudad de la lista' }) })
    .min(1, { message: 'Debes seleccionar una ciudad de la lista' }),
  province_id: z.coerce
    .number({ errorMap: () => ({ message: 'Provincia no válida o no seleccionada' }) })
    .min(1, { message: 'Provincia no válida o no seleccionada' }),
  workday_type_id: z.coerce
    .number({ errorMap: () => ({ message: 'Debes seleccionar un tipo de jornada' }) })
    .min(1, { message: 'Debes seleccionar un tipo de jornada' }),
  offer_type_id: z.coerce
    .number({ errorMap: () => ({ message: 'Debes seleccionar un tipo de empleo' }) })
    .min(1, { message: 'Debes seleccionar un tipo de empleo' }),
  description: z
    .string({ required_error: 'La descripción es obligatoria' })
    .min(10, { message: 'La descripción debe tener al menos 10 caracteres' })
    .max(10000, { message: 'La descripción no puede superar los 10.000 caracteres' })
    .trim(),
});