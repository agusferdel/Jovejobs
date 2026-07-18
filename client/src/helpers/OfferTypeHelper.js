import { fetchAxios } from './axiosHelper';

//obtener todos los tipos de contrato
export const getOfferTypesApi = async (token) => {
  return await fetchAxios('/offerType/offerTypes', 'GET', null, token);
};

//guardar nuevo tipo de contrato
export const saveOfferTypeApi = async (name, token) => {
  return await fetchAxios('/offerType/offerTypes', 'POST', { name }, token);
};

//editar tipo de contrato
export const updateOfferTypeApi = async (id, name, token) => {
  return await fetchAxios(`/offerType/update/${id}`, 'PUT', { name }, token);
};

//eliminar tipo de contrato
export const deleteOfferTypeApi = async (id, token) => {
  return await fetchAxios(`/offerType/delete/${id}`, 'DELETE', null, token);
};
