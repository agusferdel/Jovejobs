import { useNavigate } from "react-router"
import { ButtonJJ } from "../../../../components/Button/Button"
import './HomeCandidate.css'
import { Cardjj } from "../../../../components/Card/Card";
import { ButtonGroupJJ } from "../../../../components/Button/ButtonGroup";
import userDefault from '../../../../assets/userDefault.jpg';

import { useEffect, useState } from "react";
import { fetchAxios } from "../../../../helpers/axiosHelper";
import { getModality } from "../../../../helpers/getModality";
import location from '../../../../assets/location-dot-solid-full.svg';
import briefcase from '../../../../assets/briefcase-solid-full.svg'
import building from '../../../../assets/building-solid-full.svg'
  



const HomeCandidate = () => {
   const navigate = useNavigate();
   const [offers, setOffers] = useState([]);

   useEffect(() => {
      const fetchOffersData = async () => {
        try {
          let res = await fetchAxios('/offers/top3', 'GET', null, null);
          setOffers(res.data);
        } catch (error) {
          console.log('Error de conexión: oferta', error);
        }
      };
      fetchOffersData();
    }, []);

return (
  
  <div>

    
    <section >
      

      <div className="section-1">
        <div className="section-1-1">
          <h3> ✦ PARA CANDIDATOS </h3>
          <h2>
            Tu próxima <span>práctica</span> te está esperando
          </h2>
          <p>
            Conectamos a estudiantes y recién graduados con las mejores
            empresas. Sube tu CV, descubre ofertas y da el primer paso
            en tu carrera profesional.
          </p>
       <div>
         
           <ButtonGroupJJ>
             <ButtonJJ
               variant="tertiary"
               onClick={() => navigate('/registerCandidate')}
             >
               Empezar ahora
             </ButtonJJ>
             <ButtonJJ
               variant="black "
               onClick={() => navigate('/offers')}
             >
               Ver ofertas →
             </ButtonJJ>
           </ButtonGroupJJ>
       </div>
        
        </div>
      </div>
    </section>

    
    <section>
      <div className="section-2">
        <h6> CÓMO FUNCIONA </h6>
        <h3> Tres pasos para tu primer empleo </h3>
        <div className="section-2-1" >
          <Cardjj >
            <span> 1 </span>
            <h5> 📖 </h5>
            <h4> Sube tu CV </h4>
            <p>
              Crea tu perfil en minutos y añade tus habilidades,
              formación y experiencias. Nada complicado.
            </p>
          </Cardjj>
          <Cardjj >
            <span> 2 </span>
            <h5> 🔍 </h5>
            <h4> Descubre ofertas </h4>
            <p>
              Filtra por sector, ciudad o modalidad. Encontrarás
              prácticas y empleos junior hechos a tu medida.
            </p>
          </Cardjj>
          <Cardjj >
            <span> 3 </span>
            <h5> ✉️ </h5>
            <h4> Aplica y conecta </h4>
            <p>
              Envía tu candidatura con un clic. Las empresas te
              contactarán directamente a través de la plataforma.
            </p>
          </Cardjj>
        </div>
      </div>
    </section>

  
    <section >
    
      <div  className="section-3">
        <div className="section-3-1">
          <h3> Ofertas para ti </h3>
          <ButtonJJ variant="black" onClick={() => navigate('/offers')}>
            Ver todas →
          </ButtonJJ>
        </div>
           <div className="offer-candidate">
                    {offers &&
                      offers.map((offer) => (
                        <Cardjj variant="transparent" key={offer.offer_id} >
                          
                          <div className="offer-card">
                            <img
                              className="company-logo-profile"
                              src={
                                offer?.company_icon
                                ? `${import.meta.env.VITE_SERVER_IMAGES_URL}/user/${offer.company_icon}`
                                : userDefault
                              }
                              alt="Logo de empresa"
                              />
                            <h3 className="offer-card-title">{offer.title}</h3>
                            <p className="iconos-candidate"> <img src={building} alt="" /> {offer.company_title}</p>
                            <p className="iconos-candidate" ><img src={location} alt="localización" /> {offer.city_name}</p>
                           <p className="iconos-candidate" > <img src={briefcase} alt="" /> {getModality(offer.modality)}</p>
          
                            <ButtonJJ variant='black' onClick={() => navigate(`/offer/${offer.offer_id}`)}>
                              Ver Oferta
                            </ButtonJJ>
                          </div>
                        </Cardjj>
                      ))}
                  </div>

   
      
       
<div className="section-3-2-candidate">
  <Cardjj variant="secondary">
          <div className="section-3-2-0">
            <div className="section-3-2-1">
                <h3 >
                  ¿Listo para empezar tu carrera?
                </h3>
                <p>
                  Únete a más de 12.000 estudiantes que ya han encontrado
                  sus prácticas.
                </p>
            </div>
            
                <ButtonJJ
                  variant="yellow"
                  onClick={() => navigate('/registerCandidate')}
                  >
                  Crear mi perfil gratis
              </ButtonJJ>
            
          </div>
  </Cardjj>
</div>
        </div>
    </section>
  </div>
  
);}
         


export default HomeCandidate