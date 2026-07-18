import { fetchAxios } from './axiosHelper';

export const softDelete = async (token, id = null) => {
  const url = id ? `/users/delete/${id}` : `/users/delete`;

  return await fetchAxios(url, 'PUT', null, token);
};

export const restoreUser = async (token, id = null) => {
  const url = `/users/restore/${id}`;

  return await fetchAxios(url, 'PUT', null, token);
};
