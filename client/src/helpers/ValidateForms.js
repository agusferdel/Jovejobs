import { ZodError } from "zod";

//validar formularios comparando los schemas con los datos

export const validateForm = (schema, data) => {
  try {
    schema.parse(data);
    return
  } catch (error) {
    //llevar el error en forma de objeto mas simple
    if (error instanceof ZodError) {
      const fieldErrors ={errType:"validator"}
      error.issues.forEach((err) => {
        fieldErrors[err.path[0]] = err.message
      })
      throw fieldErrors;
    }
  }
}