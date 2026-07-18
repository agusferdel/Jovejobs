import { useContext, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import { useNavigate, useParams } from "react-router";
import { validateForm } from "../../../../helpers/ValidateForms";
import { newLanguageSchema } from "../../../../schemas/NewLanguageSchema";
import { fetchAxios } from "../../../../helpers/axiosHelper";
import { FormJJ } from "../../../../components/Form/Form";
import { InputJJ } from "../../../../components/Form/Input";
import { TextAreaJJ } from "../../../../components/Form/TextArea";
import { ButtonGroupJJ } from "../../../../components/Button/ButtonGroup";
import { ButtonJJ } from "../../../../components/Button/Button";
import { PageSection } from "../../../../components/PageSection/PageSection";
import { PageContainer } from "../../../../components/PageContainer/PageContainer";

const EditLanguage = () => {
  const { token, language, setLanguage } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
 
  const currentLang = language.find(
    (lang) => String(lang.language_id) === String(id)
  );
 
  const [editLang, setEditLang] = useState({
    language_id: currentLang.language_id,
    name: currentLang.name,
    level: currentLang.level,
    description: currentLang.description || "",
  });
 
  const [errorsVal, setErrorsVal] = useState();
  const [otherError, setOtherError] = useState("");
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditLang({ ...editLang, [name]: value });
  };
 
  const onSubmit = async () => {
    setErrorsVal({});
    setOtherError("");
    try {
      validateForm(newLanguageSchema, editLang);
 
      const langData = {
        name: editLang.name,
        level: editLang.level,
        description: editLang.description,
      };
 
      await fetchAxios(`/languages/editLanguage/${editLang.language_id}`,"PUT",langData,token);
      const resList = await fetchAxios("/languages/myLanguages","GET",null,token);
      const result = resList.data?.result || [];
      setLanguage(result);
 
      navigate("/candidateProfile");
    } catch (error) {
      if (error.errType === "validator") {
        setErrorsVal(error);
      } else {
        setOtherError("Ha habido un error");
      }
      console.log(error);
    }
  };
 
  return (
    <PageSection variant="candidate">
      <PageContainer>
        <FormJJ title="Editar idioma" variant='glass'>
          <InputJJ
            label="Idioma*"
            name="name"
            type="text"
            placeholder="Ej. Inglés"
            value={editLang.name}
            onChange={handleChange}
            error={errorsVal?.name}
          />

          <InputJJ
            label="Nivel*"
            name="level"
            type="text"
            placeholder="Ej. B1/B2/C1..."
            value={editLang.level}
            onChange={handleChange}
            error={errorsVal?.level}
          />

          <TextAreaJJ
            label="Descripción"
            name="description"
            value={editLang?.description || ""}
            onChange={handleChange}
            rows="5"
            placeholder="Describe la experiencia..."
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
  );
};
 
export default EditLanguage;