import { fetchAxios } from './axiosHelper.js';

//obtener todos los tipos de contrato
export const getWorkdaysApi = async (token) => {
  return await fetchAxios('/workdayType/workdayTypes', 'GET', null, token);
};

//guardar nuevo tipo de contrato
export const saveWorkdayApi = async (name, token) => {
  return await fetchAxios('/workdayType/workdayTypes', 'POST', { name }, token);
};

//editar tipo de contrato
export const updateWorkdayApi = async (id, name, token) => {
  return await fetchAxios(`/workdayType/update/${id}`, 'PUT', { name }, token);
};

//eliminar tipo de contrato
export const deleteWorkdayApi = async (id, token) => {
  return await fetchAxios(`/workdayType/delete/${id}`, 'DELETE', null, token);
};
