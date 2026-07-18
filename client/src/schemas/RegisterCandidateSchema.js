import {z} from 'zod';

const passRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/

const personNameRegEx = /^[\p{L}\p{M}]+(?:[ '-][\p{L}\p{M}]+)*$/u;

const numRegEx = /^\+?[0-9]{9,15}$/

export const registerCandidateSchema = z.object({
  email: z
      .string({message:"Campo obligatorio"})
      .email({message:"Email no valido"})
      .trim(),
  repEmail: z
      .string(),
  password: z
      .string({message:"Campo obligatorio"})
      .min(6,{message:"Debe ser mayor de 6 caracteres"})
      .max(20, {message: "Deben ser menos de 20 caracteres"})
      .regex(passRegEx, {message:"Contraseña poco segura, debe contener mayuscula/s, minuscula/s, número/s y carácter especial"}),
  repPassword: z
      .string(),
  name: z
      .string({message: "Campo obligatorio"})
      .min(3, {message:"Debe ser mayor de 3 caracteres"})
      .max(50, {message:"Debe ser menor de 50 caracteres"})
      .regex(personNameRegEx, {message:"Deben ser caracteres válidos"})
      .trim(),
  lastname: z
      .string({message:"Campo obligatorio"})
      .min(3,{message:"Debe ser mayor de 3 caracteres"})
      .max(100, {message:"Debe ser menor de 100 caracteres"})
      .regex(personNameRegEx, {message:"Deben ser caracteres válidos"})
      .trim(),
  phone_number: z
      .string({ message: "El teléfono introducido no es válido" })
      .regex(numRegEx, { message: "El teléfono introducido no es válido" }),
  terms: z
      .literal(true, {message:"Debes aceptar la política de privacidad y los términos y condiciones"})
  
}).refine((data) =>  data.email === data.repEmail, {
      message:"Los emails no coinciden",
      path:["repEmail"]
    }).refine((data) =>  data.password === data.repPassword, {
    message:"Las contraseñas no coinciden",
    path:["repPassword"]
  })
  
  
  
  
  
  
 
