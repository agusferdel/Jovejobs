import { useContext, useState } from "react"
import { useNavigate } from "react-router";
import { fetchAxios } from "../../../../helpers/axiosHelper";
import { AuthContext } from "../../../../context/AuthContext";
import { validateForm } from "../../../../helpers/ValidateForms";
import { newLanguageSchema } from "../../../../schemas/NewLanguageSchema";
import { FormJJ } from "../../../../components/Form/Form";
import { InputJJ } from "../../../../components/Form/Input";
import { TextAreaJJ } from "../../../../components/Form/TextArea";
import { ButtonGroupJJ } from "../../../../components/Button/ButtonGroup";
import { ButtonJJ } from "../../../../components/Button/Button";
import { PageSection } from "../../../../components/PageSection/PageSection";
import { PageContainer } from "../../../../components/PageContainer/PageContainer";

const initialValue = {
  name:"",
  level:"",
  description:""
}

const LanguageForm = () => {

  const {token, setLanguage} = useContext(AuthContext);
  const [newLanguage, setNewLanguage] = useState(initialValue);
  const [errorsVal, setErrorsVal] = useState();
  const [otherError, setOtherError] = useState("")


  const navigate = useNavigate();


  const handleChange = (e) => {
    const {name, value} = e.target;
    setNewLanguage({...newLanguage, [name] : value});
  }


  const onSubmit = async() => {
    setErrorsVal({});
    setOtherError("");
    try {
      validateForm(newLanguageSchema, newLanguage);
      await fetchAxios('/languages/newLanguage', 'POST', newLanguage, token);
      const resList = await fetchAxios("/languages/myLanguages","GET",null,token);
      const result = resList.data?.result || [];

      setLanguage(result);
      navigate('/candidateProfile');
    } catch (error) {
      if (error.errType === "validator"){
        console.log("errores de validación");
        setErrorsVal(error);
      }
      else {
        setOtherError("Ha habido un error");
      }
      console.log(error);
    }

  }

  return (
    <PageSection variant="candidate">
      <PageContainer>
        <FormJJ title="Añadir idioma" variant='glass'>
          <InputJJ
            label="Idioma*"
            name="name"
            type="text"
            placeholder="Ej. Inglés"
            value={newLanguage.name}
            onChange={handleChange}
            error={errorsVal?.name}
          />

          <InputJJ
            label="Nivel*"
            name="level"
            type="text"
            placeholder="B1/B2/C1..."
            value={newLanguage.level}
            onChange={handleChange}
            error={errorsVal?.level}
          />

          <TextAreaJJ
            label="Descripción"
            name="description"
            value={newLanguage?.description || ""}
            onChange={handleChange}
            rows="5"
            placeholder="Datos adicionales"
            error={errorsVal?.description}
          />

          {otherError && <p className="errMsg">{otherError}</p>}
          <ButtonGroupJJ>
            <ButtonJJ onClick={onSubmit}>Confirmar</ButtonJJ>
            <ButtonJJ variant="black" onClick={() => navigate(-1)}>Cancelar</ButtonJJ>
          </ButtonGroupJJ>
        </FormJJ>
      </PageContainer>
    </PageSection>
  )
}

export default LanguageForm