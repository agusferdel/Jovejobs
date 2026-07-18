import { z } from "zod";

const currentMonth = new Date().toISOString().slice(0, 7);

const noEmojiRegEx = /^(?!.*\p{Extended_Pictographic}).*$/u;

export const newExperienceSchema = z.object({
  title: z
    .string({ message: "Campo obligatorio" })
    .trim()
    .min(2, { message: "Debe tener al menos 2 caracteres" })
    .max(100, { message: "Debe ser menor de 100 caracteres" })
    .regex(noEmojiRegEx, {message:"Deben ser caracteres válidos"}),
  experience_company: z
    .string({ message: "Campo obligatorio" })
    .trim()
    .min(2, { message: "Debe tener al menos 2 caracteres" })
    .max(150, { message: "Debe ser menor de 150 caracteres" })
    .regex(noEmojiRegEx, {message:"Deben ser caracteres válidos"}),
  start_month_year: z
    .string({ message: "Campo obligatorio" })
    .min(1, { message: "Campo obligatorio" }),
  end_month_year: z
    .string()
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .trim()
    .max(500, { message: "Debe ser menor de 500 caracteres" })
    .optional()
    .or(z.literal(""))
}).refine(
  (data) => data.start_month_year <= currentMonth,
  {
    message: "La fecha de inicio no puede ser posterior a la fecha actual",
    path: ["start_month_year"]
  }
)
.refine(
  (data) => !data.end_month_year || data.end_month_year >= data.start_month_year,
  {
    message: "La fecha de finalización no puede ser anterior a la de inicio",
    path: ["end_month_year"]
  }
);