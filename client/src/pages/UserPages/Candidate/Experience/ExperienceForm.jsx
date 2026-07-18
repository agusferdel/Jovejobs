import { useContext, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import { useNavigate } from "react-router";
import { validateForm } from "../../../../helpers/ValidateForms";
import { fetchAxios } from "../../../../helpers/axiosHelper";
import { newExperienceSchema } from "../../../../schemas/NewExperienceSchema";
import { FormJJ } from "../../../../components/Form/Form";
import { InputJJ } from "../../../../components/Form/Input";
import { TextAreaJJ } from "../../../../components/Form/TextArea";
import { MonthJJ } from "../../../../components/Form/Month";
import { ButtonJJ } from "../../../../components/Button/Button";
import { ButtonGroupJJ } from "../../../../components/Button/ButtonGroup";
import { PageSection } from "../../../../components/PageSection/PageSection";
import { PageContainer } from "../../../../components/PageContainer/PageContainer";

const initialValue = {
  title: "",
  experience_company: "",
  start_month_year: "",
  end_month_year: "",
  description: "",
};

const ExperienceForm = () => {
  const { token, setExperience } = useContext(AuthContext);
  const [newExperience, setNewExperience] = useState(initialValue);
  const [errorsVal, setErrorsVal] = useState();
  const [otherError, setOtherError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewExperience({ ...newExperience, [name]: value });
  };

  const onSubmit = async () => {
    setErrorsVal({});
    setOtherError("");

    try {
      validateForm(newExperienceSchema, newExperience);

      const experienceData = {
        ...newExperience,
        start_month_year: newExperience.start_month_year
          ? `${newExperience.start_month_year}-01`
          : "",
        end_month_year: newExperience.end_month_year
          ? `${newExperience.end_month_year}-01`
          : "",
      };

      await fetchAxios("/experience/newExperience", "POST", experienceData, token);

      const resList = await fetchAxios("/experience/myExperience", "GET", null, token);
      const result = resList.data?.result || [];

      setExperience(result);
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
        <FormJJ title="Añadir experiencia" variant="glass">
          <InputJJ
            label="Cargo*"
            name="title"
            type="text"
            placeholder="Ej. Jefe de cocina"
            value={newExperience.title}
            onChange={handleChange}
            error={errorsVal?.title}
          />

          <InputJJ
            label="Empresa u organización*"
            name="experience_company"
            type="text"
            placeholder="Ej. Amazon"
            value={newExperience.experience_company}
            onChange={handleChange}
            error={errorsVal?.experience_company}
          />

          <MonthJJ
            label="Fecha de inicio*"
            name="start_month_year"
            value={newExperience.start_month_year}
            onChange={handleChange}
            error={errorsVal?.start_month_year}
          />

          <MonthJJ
            label="Fecha de finalización"
            name="end_month_year"
            value={newExperience.end_month_year}
            onChange={handleChange}
            error={errorsVal?.end_month_year}
          />

          <div className="full">
            <TextAreaJJ
              label="Descripción"
              name="description"
              rows={5}
              placeholder="Describe la experiencia..."
              value={newExperience.description ?? ""}
              onChange={handleChange}
              error={errorsVal?.description}
            />
          </div>

          {otherError && <p className="errMsg full">{otherError}</p>}

          <div className="full">
            <ButtonGroupJJ>
              <ButtonJJ onClick={onSubmit}>Confirmar</ButtonJJ>
              <ButtonJJ variant="black" onClick={() => navigate(-1)}>
                Cancelar
              </ButtonJJ>
            </ButtonGroupJJ>
          </div>
        </FormJJ>
      </PageContainer>
    </PageSection>
  );
};

export default ExperienceForm;