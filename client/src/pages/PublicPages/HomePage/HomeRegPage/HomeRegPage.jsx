import { useNavigate } from "react-router";
import { ButtonJJ } from "../../../../components/Button/Button"
import { Cardjj } from "../../../../components/Card/Card";
import './HomeRegPage.css'
import { PageSection } from "../../../../components/PageSection/PageSection";
import { PageContainer } from "../../../../components/PageContainer/PageContainer";

const HomeRegPage = () => {
  const navigate = useNavigate();
  return (
    <PageSection variant="homeregpage">
      <PageContainer>
        <div className="container-HomeReg">
        
            <h2>¿Quién eres?</h2>
        
          <div className="card-cc" >
            <Cardjj variant="transparent">
              <h3>Candidato</h3>
              <p>Encuentra prácticas profesionales  y empleos junior </p>
              
              <ButtonJJ variant="tertiary" onClick={() => navigate('/registerCandidate')} >
                Comenzar
              </ButtonJJ>
          
            </Cardjj>
          
            <Cardjj className="transparent">
              <h3>Empresa</h3>
              <p>Accede al mejor talento joven y potencia tu proceso de reclutamiento</p>
              <ButtonJJ variant="primary" onClick={() => navigate('/registerCompany')}>
                  Comenzar
              </ButtonJJ>
            </Cardjj>
          </div>
        </div>
      </PageContainer>
    </PageSection>
  )
}

export default HomeRegPage