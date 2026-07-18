import { Cardjj } from "../../../../components/Card/Card"
import { PageContainer } from "../../../../components/PageContainer/PageContainer"
import { PageSection } from "../../../../components/PageSection/PageSection"

import './ValidationRegister.css'


const ValidationRegister = () =>{
  return (
    <PageSection variant="validation">
      <PageContainer>
        <div className="validation">
          <div className="card-validation">
            <Cardjj variant="transparent">
              <h2>¡REGISTRO COMPLETADO!</h2>
              <h5>Te hemos enviado un correo electrónico para verificar tu cuenta. Puede tardar unos minutos en llegar.</h5>
              <h5>Revisa tu bandeja de entrada y haz clic en el enlace de confirmación para activar tu perfil en <span>joveJOBS.</span> </h5>
              <p>Si no lo encuentras, revisa la carpeta de spam o correo no deseado.</p>
            </Cardjj>
          </div>
        </div>  
      </PageContainer>
    </PageSection>
  )
}

export default ValidationRegister