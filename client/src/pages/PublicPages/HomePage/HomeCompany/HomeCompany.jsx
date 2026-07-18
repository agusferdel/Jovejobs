import { Link, useNavigate } from "react-router"
import { ButtonJJ } from "../../../../components/Button/Button"
import { Cardjj } from "../../../../components/Card/Card";
import './HomeCompany.css'
import { ButtonGroupJJ } from "../../../../components/Button/ButtonGroup";
import { fetchAxios } from "../../../../helpers/axiosHelper";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext";
const HomeCompany = () => {
   const navigate = useNavigate();
   const [packs, setPacks] = useState([]);
     const { token } = useContext(AuthContext);

   useEffect(() => {
       const fetchPacksData = async () => {
         try {
           const resPacks = await fetchAxios('/pack', 'GET', null);
           const listPacks =
             resPacks?.result ?? resPacks?.data?.result ?? resPacks?.data ?? [];
           setPacks(listPacks);
         } catch (error) {
           console.error('Error fetching packs:', error);
           setPacks([]);
         }
       };
        fetchPacksData();
  }, [token]);
  return (
    <>
    
    
      <section>
        <div className="section-company">
          <div className="section-company-1">
            <h3>✦ PARA EMPRESAS</h3>
            <h2> Conectamos empresas con <span>talento joven</span></h2>
            <p>
             Especialistas en la selección de estudiantes y recién graduados. Utilizamos metodología y criterio profesional para quitarte un peso de encima.
              </p>
             <ButtonGroupJJ>
               <ButtonJJ variant="primary" onClick={() => navigate('/registerCompany')}>
                 Registrar mi empresa
               </ButtonJJ>
                 <ButtonJJ variant="black " onClick={() => navigate('/rates')} >
                  Ver tarifas de ofertas
               </ButtonJJ>
             </ButtonGroupJJ>
          </div>
        </div>
      </section>
      
      <section>
        <div className="section-2-company">
          <span>METODOLIGÍA JOVEJOBS</span>
          <h3>Tu proceso de contratación en 3 pasos </h3>
           <div className="cards-row">
             <Cardjj>
              <h5>1</h5>
                   <h4>Registrate</h4>
                    
                     <p>Crea tu cuenta corporativa y elige el plan que mejor se adapte a los objetivos de contratación de tu marca.</p>
             </Cardjj>
              <Cardjj>
              <h5>2</h5>
             <h4>Evaluamos al candidato</h4>
                     <p>Analizamos las habilidades técnicas, motivación y encaje cultural de los postulantes de forma exhaustiva.</p>
             </Cardjj>
              <Cardjj>
              <h5>3</h5>
              <h4>Elige y contrata</h4>
              <p>Te presentamos una selección refinada con el Top 3 de talentos idóneos. Tú decides a quién incorporar.</p>
             </Cardjj>
           </div>
        </div>
        
         <div className="section-2-company">
           <span>¿POR QUÉ ELEGIRNOS?</span>
                   <h3>Soluciones a tus retos de Recursos Humanos </h3>
           <div>
             <Cardjj>
              <h4>⏱️</h4>
                   <h4>¿Sin tiempo para gestionar procesos?</h4>
                     <p>Nos encargamos de todo el flujo de trabajo operativo: desde la publicación masiva y el primer cribado
                     curricular preliminar hasta las entrevistas iniciales.</p>
             </Cardjj>
              <Cardjj>
              <h4>🎓</h4>
             <h4>¿Poco potencial en prácticas?</h4>
              <p>Te ayudamos a estructurar y encontrar estudiantes universitarios o de FP con verdadero potencial de
              desarrollo para convertirse en futuras incorporaciones clave.</p>
             </Cardjj>
              <Cardjj>
              <h3>🎯</h3>
              <h4>¿Vacantes urgentes o difíciles?</h4>
              <p>Si publicas ofertas y solo recibes cientos de CVs que no     encajan, aplicamos filtros de coincidencia técnica
              para entregarte únicamente perfiles cualificados.</p>
             </Cardjj>
           </div>
         </div>
      </section>
       
         <section>
          <div className="section-3-company">
              <h3>Planes flexibles para tu empresa</h3>
             <div className="section-3-1-company">
        {packs.slice(0, 3).map((pack) => (
          <Cardjj key={pack.pack_id} variant="card-pack" className="card-pack-home">
            <h3>{pack.name}</h3>
             <p className="pack-subtitle">
                  Bono {pack.included_offers}{' '}
                  {pack.included_offers === 1 ? 'Oferta' : 'Ofertas'}
                </p>

                <div className="pack-price">
                  <span className="price-amount">
                    €{pack.price}
                  </span>
                </div>

                <p className="pack-tax">+IVA</p>
                <p className="pack-desc">{pack.description}</p>

            <div className="pack-actions">
              <ButtonJJ
                variant="primary"
                onClick={() =>
                  navigate(`/rates`)
                }
              >
               Mas info
              </ButtonJJ>
            
            </div>
          </Cardjj>
        ))}
     
      </div>
       <div className="links-to-packs">
         <Link className="link-to-packs" to="/rates">Ver más packs</Link>
       </div>
          </div>
         
         </section>

    
    </>
  )
}

export default HomeCompany