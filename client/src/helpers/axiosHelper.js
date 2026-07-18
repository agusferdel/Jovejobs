import axios from 'axios';

const apiUrl =import.meta.env.VITE_SERVER_URL; 
export const fetchAxios = async(url, method, data=null, token=null) => {


  let headers = {}
  if(token){
    headers={Authorization:`Bearer ${token}`}
  }
  let config = {
    url: apiUrl + url,
    method,
    data,
    headers
  }
  return await axios(config);
}