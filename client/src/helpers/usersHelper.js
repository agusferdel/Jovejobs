import { fetchAxios } from './axiosHelper';

export const changePasswordApi = async (data, token) => {
  const dataToSend = {
    currentPassword: data.currentPassword,
    newPassword: data.newPassword
  };

  return await fetchAxios('/users/changePassword', 'PUT', dataToSend, token);
};
