import { z } from 'zod';

const numRegEx = /^\+?[0-9]{9,15}$/;
// Regex para DNI: 8 dígitos y una letra (mayúscula o minúscula)
const dniRegEx = /^[0-9]{8}[A-Za-z]{1}$/; 
const personNameRegEx = /^[\p{L}\p{M}]+(?:[ '-][\p{L}\p{M}]+)*$/u;

export const editCandidateSchema = z.object({
  name: z
    .string({ message: "Campo obligatorio" })
    .min(3, { message: "Debe ser mayor de 3 caracteres" })
    .max(50, { message: "Debe ser menor de 50 caracteres" })
    .regex(personNameRegEx, {message:"Deben ser caracteres válidos"})
    .trim(),
  lastname: z
    .string({ message: "Campo obligatorio" })
    .min(3, { message: "Debe ser mayor de 3 caracteres" })
    .max(100, { message: "Debe ser menor de 100 caracteres" })
    .regex(personNameRegEx, {message:"Deben ser caracteres válidos"})
    .trim(),
  email: z
    .string({ message: "Campo obligatorio" })
    .email({ message: "Email no válido" })
    .trim(),
  phone_number: z
    .string({ message: "El teléfono introducido no es válido" })
    .regex(numRegEx, { message: "El teléfono introducido no es válido" }),
  
  // LÓGICA DEL DNI:
  // .or(z.literal("")) permite que sea una cadena vacía (opcional)
  // .refine comprueba el formato solo si el valor no es vacío
  dni_cif: z
    .string()
    .trim()
    .nullable() // Permite null
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || dniRegEx.test(val), {
      message: "Formato de DNI no válido (8 números y una letra)",
    }),
    
  zip_code: z
  .string()
  .trim()
  .regex(/^\d{5}$/, "El código postal debe contener exactamente 5 números")
  .nullable() 
  .optional()
  .or(z.literal("")),
    
  about_me: z
    .string()
    .max(500, { message: "Máximo 500 caracteres" }) 
    .nullable() // Permite null
    .optional()
    .or(z.literal("")),
    
  linkedin: z
    .string()
    .url({ message: "URL no válida" })
    .nullish() // Esto permite null o undefined
    .or(z.literal("")),
    
  location_pref: z
    .string()
    .max(500, { message: "Máximo 500 caracteres" })
    .nullable() // Permite null
    .optional()
    .or(z.literal("")),
    
  modality: z.string().nullable().optional().or(z.literal("")),

 // CAMBIOS Preprocess para manejar strings vacíos/null como undefined
  province_id: z.preprocess(
    (val) => (val === "" || val === null ? undefined : val),
    z.number({ invalid_type_error: "Selecciona una provincia de la lista" }).nullable().optional()
  ),

  city_id: z.preprocess(
    (val) => (val === "" || val === null ? undefined : val),
    z.number({ invalid_type_error: "Selecciona una ciudad de la lista" }).nullable().optional()
  ),
})
// VALIDACIONES CRUZADAS
.refine((data) => {
  if (data.province_id && !data.city_id) return false;
  return true;
}, { message: "Debes seleccionar una ciudad para esta provincia", path: ["city_id"] })
.refine((data) => {
  if (data.city_id && !data.province_id) return false;
  return true;
}, { message: "Debes seleccionar una provincia primero", path: ["province_id"] });