import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../../../context/AuthContext';
import { fetchAxios } from '../../../../../helpers/axiosHelper';
import { ButtonJJ } from '../../../../../components/Button/Button';
import { ButtonGroupJJ } from '../../../../../components/Button/ButtonGroup';
import { Cardjj } from '../../../../../components/Card/Card';
import Swal from "sweetalert2";
import company_icon from "../../../../../assets/building-solid-full.svg"
import location_icon from "../../../../../assets/location-dot-solid-full.svg"
import calendar_icon from "../../../../../assets/calendar-days-solid-full.svg"
import job_icon from "../../../../../assets/briefcase-solid-full.svg"
import inbox from "../../../../../assets/inbox-solid-full.svg"
import warning from "../../../../../assets/triangle-exclamation-solid-full.svg"

import './CandidateApplicationOutlet.css'
import { useNavigate } from 'react-router';

  const statusLabel = {
    1: 'Inscrito',
    2: 'Preseleccionado',
    3: 'Descartado'
  };

  const ModalityLabel = {
    1: 'Remoto',
    2: 'Presencial',
    3: 'Híbrido'
  };

const CandidateApplicationOutlet = () => {
  const { user, token } = useContext(AuthContext);
  const [user_offer, setUserOffer] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {    
    const getApplications = async () => {
      try {
        if (user) {
          let res = await fetchAxios(
            '/offers/candidateApplications',
            'GET',
            null,
            token
          );
          setUserOffer(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getApplications();
  }, [user, token]);

  const deleteApplication = async (offerId) => {
      const result = await Swal.fire({
          title: "¿Eliminar candidatura?",
          text: "Se eliminará tu inscripción a esta oferta.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, eliminar",
          cancelButtonText: "Cancelar",
          reverseButtons: true,
          focusCancel: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#6c757d",
          scrollbarPadding: false
      });

      if (!result.isConfirmed) return;

      try {
          await fetchAxios(`/offers/delApplication/${offerId}`, 'DELETE', null, token);

          setUserOffer(prev => prev.filter(elem => elem.offer_id !== offerId));

          await Swal.fire({
              title: "Candidatura eliminada",
              text: "Tu inscripción se ha eliminado correctamente.",
              icon: "success",
              confirmButtonText: "Aceptar",
          });

      } catch (error) {
          await Swal.fire({
              title: "Error",
              text: error.response?.data?.message || "No se pudo eliminar la candidatura.",
              icon: "error",
              confirmButtonText: "Aceptar",
          });
      }
  };

  return (
    <div className="candidate-applicationOutlet-container">
      <Cardjj>
      <div className='candidate-applicationOutlet'>
        <div className='title-candidate' >
          <h2>Candidaturas</h2>
          <p>Consulta el estado de las ofertas a las que has aplicado y haz
             seguimiento de cada proceso.</p>
        </div>
        <div className='send-candidate'>
          <h6>Enviadas:</h6>
          <p className='num-send'>{user_offer.length}</p>
        </div>
      </div>
      </Cardjj>

      {user_offer.length === 0 ? (
        <Cardjj>
          <div className='emtpy-applications'>
            <img src={inbox} alt="" width="40" height="40" />
            <p>No tienes candidaturas</p>
          </div>
        </Cardjj>
      ) : (
      user_offer &&
        user_offer.map((elem) => (
          <Cardjj key={elem.offer_id}>
                  {elem.is_active === 0 && (
                    <p className='offer-finished-label'><img src={warning} alt="" width="24" height="24" /> Oferta finalizada</p>
                  )}
            <div className='candidate-applicationOutlet-container-1'>
              <div>
                <div className={elem.is_active === 0 ? 'offer-inactive' : ''}>
                  <h3>{elem.title}</h3>
                  <p>
                    <img src={company_icon} alt="" width="24" height="24" /> {elem.company_title} &nbsp;&nbsp; 
                    <img src={location_icon} alt="" width="24" height="24" /> {elem.city_name}, {elem.province_name}
                  </p> 
                  <p>
                    <img src={calendar_icon} alt="" width="24" height="24" /> Aplicada el {elem.application_date.slice(0, 10).split('-').reverse().join('/')}
                  </p>
                  <p>
                    <img src={job_icon} alt="" width="24" height="24" /> Puesto: {elem.job_name}
                  </p>
                </div>
                <ButtonGroupJJ align="left">
                  {elem.is_active === 1 && (
                    <ButtonJJ variant="content-primary" onClick={()=>navigate(`/offer/${elem.offer_id}`)}>Ver oferta</ButtonJJ>
                  )}
                  <ButtonJJ variant="content-delete" onClick={() => deleteApplication(elem.offer_id)}>
                    Eliminar candidatura
                  </ButtonJJ>
                </ButtonGroupJJ>
              </div>
              <div className={`modality ${elem.is_active === 0 ? 'offer-inactive' : ''}`}>
                <p>Modalidad: {ModalityLabel[elem.modality]}</p>
                <p className={`status status-${elem.application_status}`}>{statusLabel[elem.application_status]}</p>
              </div>
            </div>
          </Cardjj>
        ))
      )} 
    </div>
  );
};

export default CandidateApplicationOutlet;
