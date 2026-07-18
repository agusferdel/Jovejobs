import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../../context/AuthContext.js';
import {
  getOfferTypesApi,
  saveOfferTypeApi,
} from '../../../../helpers/OfferTypeHelper.js';
import { getJobsApi, saveJobApi } from '../../../../helpers/JobHelper.js';
import {
  getWorkdaysApi,
  saveWorkdayApi,
} from '../../../../helpers/workdayHelper.js';
import { Outlet, useNavigate } from 'react-router';
import { ButtonJJ } from '../../../../components/Button/Button';
import { InputJJ } from '../../../../components/Form/Input.jsx'; // Asegúrate de que la ruta de importación sea la correcta
import './configOffers.css';

const ConfigOffersOutlet = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [newWorkdayType, setNewWorkdayType] = useState('');
  const [workdayTypes, setWorkdayTypes] = useState([]);

  const [newOfferType, setNewOfferType] = useState('');
  const [offerTypes, setOfferTypes] = useState([]);

  const [newJob, setNewJob] = useState('');
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          const resOfferTypes = await getOfferTypesApi(token);
          setOfferTypes(resOfferTypes.data.result || []);

          const resJobs = await getJobsApi(token);
          setJobs(resJobs.data.result || []);

          const resWorkdays = await getWorkdaysApi(token);
          setWorkdayTypes(resWorkdays.data.result || []);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [token]);

  const handleOfferTypeChange = (e) => {
    setNewOfferType(e.target.value);
  };

  const handleWorkdayTypeChange = (e) => {
    setNewWorkdayType(e.target.value);
  };

  const handleJobChange = (e) => {
    setNewJob(e.target.value);
  };

  const saveOfferType = async () => {
    if (!newOfferType.trim()) return;
    try {
      await saveOfferTypeApi(newOfferType, token);
      setNewOfferType('');
      const res = await getOfferTypesApi(token);
      setOfferTypes(res.data.result || []);
    } catch (error) {
      console.log(error);
    }
  };

  const saveWorkdayType = async () => {
    if (!newWorkdayType.trim()) return;
    try {
      await saveWorkdayApi(newWorkdayType, token);
      setNewWorkdayType('');
      const res = await getWorkdaysApi(token);
      setWorkdayTypes(res.data.result || []);
    } catch (error) {
      console.log(error);
    }
  };

  const saveJob = async () => {
    if (!newJob.trim()) return;
    try {
      await saveJobApi(newJob, token);
      setNewJob('');
      const res = await getJobsApi(token);
      setJobs(res.data.result || []);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="config-offers-layout">
      <div className="config-offers-left">
        <form className="config-offers-flex-column">
          <InputJJ
            label="Tipo de Contrato"
            name="offerType"
            value={newOfferType}
            onChange={handleOfferTypeChange}
            placeholder="Tipo de contrato"
          />
          <div className="config-offers-actions">
            <ButtonJJ
              type="button"
              onClick={saveOfferType}
              variant={'content-quaternary'}
            >
              Añadir
            </ButtonJJ>
            <ButtonJJ
              type="button"
              onClick={() => navigate('offerTypes')}
              variant={'white'}
            >
              Ver todos
            </ButtonJJ>
          </div>
        </form>

        <form className="config-offers-flex-column">
          <InputJJ
            variant="label"
            label="Tipo de Jornada"
            name="workdayType"
            value={newWorkdayType}
            onChange={handleWorkdayTypeChange}
            placeholder="Tipo de jornada"
          />
          <div className="config-offers-actions">
            <ButtonJJ
              type="button"
              onClick={saveWorkdayType}
              variant={'content-quaternary'}
            >
              Añadir
            </ButtonJJ>
            <ButtonJJ
              type="button"
              onClick={() => navigate('workdayTypes')}
              variant={'white'}
            >
              Ver todos
            </ButtonJJ>
          </div>
        </form>

        <form className="config-offers-flex-column">
          <InputJJ
            label="Nombre del Area"
            name="jobArea"
            value={newJob}
            onChange={handleJobChange}
            placeholder="Área de trabajo"
          />
          <div className="config-offers-actions">
            <ButtonJJ
              type="button"
              onClick={saveJob}
              variant={'content-quaternary'}
            >
              Añadir
            </ButtonJJ>
            <ButtonJJ
              type="button"
              onClick={() => navigate('jobs')}
              variant={'white'}
            >
              Ver todos
            </ButtonJJ>
          </div>
        </form>
      </div>

      <div className="config-offers-right">
        <Outlet
          context={{
            offerTypes,
            setOfferTypes,
            jobs,
            setJobs,
            workdayTypes,
            setWorkdayTypes,
            token,
          }}
        />
      </div>
    </div>
  );
};

export default ConfigOffersOutlet;
