import { z } from 'zod';

const passRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,}$/;

export const ChangePasswordSchema = z
  .object({
    currentPassword: z
      .string({ message: "Campo obligatorio" })
      .min(1, { message: "Debe ingresar su contraseña actual" }),
    newPassword: z
      .string({ message: "Campo obligatorio" })
      .min(6, { message: "Debe ser mayor de 6 caracteres" })
      .max(20, { message: "Deben ser menos de 20 caracteres" })
      .regex(passRegEx, { message: "Contraseña poco segura" }),
    repPassword: z
      .string({ message: "Campo obligatorio" })
  })
  .refine((data) => data.newPassword === data.repPassword, {
    message: "Las contraseñas no coinciden",
    path: ["repPassword"]
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "La nueva contraseña no debe ser igual a la anterior",
    path: ["newPassword"]
  });
