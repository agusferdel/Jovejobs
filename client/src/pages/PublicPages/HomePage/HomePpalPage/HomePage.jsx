import { useNavigate } from "react-router";
import { ButtonJJ } from "../../../../components/Button/Button"
import './HomePage.css'
import { Cardjj } from "../../../../components/Card/Card";
import { PageSection } from "../../../../components/PageSection/PageSection";
import { PageContainer } from "../../../../components/PageContainer/PageContainer";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <PageSection variant="homepage">
      <PageContainer>
        <div className="section">
          <h2>Conectamos tu talento con las mejores prácticas</h2>
          <div className="section-0">
              <Cardjj variant="transparent">
                <h3>PARA CANDIDATOS</h3>
                <p>Encuentra prácticas profesionales y empleos junior</p>
                <ButtonJJ variant="tertiary" onClick={() => navigate('homeCandidate')} >
                  Comenzar
                </ButtonJJ> 
              </Cardjj>
              <Cardjj variant="transparent">
                <h3>PARA EMPRESAS</h3>
                <p>Accede al mejor talento joven y potencia tu proceso de reclutamiento</p>
                <ButtonJJ variant="primary" onClick={() => navigate('homeCompany')}>
                    Comenzar
                </ButtonJJ>
              </Cardjj>
            </div>
          </div>
      </PageContainer>
    </PageSection>
  )
}

export default HomePage