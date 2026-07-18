import { fetchAxios } from './axiosHelper';

//obtener todos los tipos de contrato
export const getJobsApi = async (token) => {
  return await fetchAxios('/job/jobs', 'GET', null, token);
};

//guardar nuevo tipo de contrato
export const saveJobApi = async (name, token) => {
  return await fetchAxios('/job/jobs', 'POST', { name }, token);
};

//editar tipo de contrato
export const updateJobApi = async (id, name, token) => {
  return await fetchAxios(`/job/update/${id}`, 'PUT', { name }, token);
};

//eliminar tipo de contrato
export const deleteJobApi = async (id, token) => {
  // Pasamos null en el cuerpo antes del token
  return await fetchAxios(`/job/delete/${id}`, 'DELETE', null, token);
};
