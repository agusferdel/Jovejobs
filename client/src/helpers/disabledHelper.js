import { fetchAxios } from './axiosHelper';

export const disabledUser = async (token, id = null) => {
  const url = `/users/disabled/${id}`;

  return await fetchAxios(url, 'PUT', null, token);
};

export const enabledUser = async (token, id = null) => {
  const url = `/users/enabled/${id}`;

  return await fetchAxios(url, 'PUT', null, token);
};
