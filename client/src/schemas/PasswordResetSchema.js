import { z } from 'zod';

const passRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,}$/

export const PasswordResetSchema = z
  .object({
  password: z
      .string({message:"Campo obligatorio"})
      .min(6,{message:"Debe ser mayor de 6 caracteres"})
      .max(20, {message: "Deben ser menos de 20 caracteres"})
      .regex(passRegEx, {message:"Contraseña poco segura"}),
  repPassword: z
      .string()
  }).refine((data) =>  data.password === data.repPassword, {
    message:"Las contraseñas no coinciden",
    path:["repPassword"]
  })
