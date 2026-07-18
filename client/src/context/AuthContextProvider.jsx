import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { fetchAxios } from '../helpers/axiosHelper';

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [experience, setExperience] = useState([]); 
  const [study, setStudy] = useState([]);
  const [language, setLanguage] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
        const fetchJob = async() => {
      try {
        const res = await fetchAxios('/offers/jobs', 'GET');
        setJobs(res.data || []);
      } catch (error) {
        console.error('Error al cargar áreas de trabajo:', error);
      }
    }

    fetchJob();
  },[])


  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setUser(null);
        setExperience([]);
        setStudy([]);
        setLanguage([]);
        setAuthLoading(false);
        return;
      }

      try {
        const res = await fetchAxios('/auth/userById', 'GET', null, token);

        setUser(res.data.user);
        setExperience(res.data.experience || []);
        setStudy(res.data.study || []);
        setLanguage(res.data.language || []);
      } catch (error) {
        console.error('Error al recuperar el usuario', error);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setExperience([]);
        setStudy([]);
        setLanguage([]);
      } finally {
        setAuthLoading(false)
      }
    };

    fetchData();
  }, [token]);

  const logout = () => {
    setToken(null);
    setUser(null);
    setExperience([]);
    setStudy([]);
    setLanguage([]);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
        value={{ 
          user, 
          setUser, 
          logout, 
          token,
          setToken,
          experience,
          setExperience,
          study,
          setStudy,
          language,
          setLanguage,
          jobs,
          setJobs
        }}>
      {children}
    </AuthContext.Provider>
  );
};
