import { useContext, useState } from "react"
import { AuthContext } from "../../../../context/AuthContext"
import { useNavigate, useParams } from "react-router";
import { validateForm } from "../../../../helpers/ValidateForms";
import { newExperienceSchema } from "../../../../schemas/NewExperienceSchema";
import { fetchAxios } from "../../../../helpers/axiosHelper";
import { FormJJ } from "../../../../components/Form/Form";
import { InputJJ } from "../../../../components/Form/Input";
import { TextAreaJJ } from "../../../../components/Form/TextArea";
import { MonthJJ } from "../../../../components/Form/Month";
import { PageSection } from "../../../../components/PageSection/PageSection";
import { PageContainer } from "../../../../components/PageContainer/PageContainer";
import { ButtonGroupJJ } from "../../../../components/Button/ButtonGroup";
import { ButtonJJ } from "../../../../components/Button/Button";

 const EditExperience = () => {

  const {token, experience, setExperience} = useContext(AuthContext);
  const {id} = useParams();
  const navigate = useNavigate();
  

  const currentExp = experience.find((exp) => String(exp.experience_id) === String(id));
  
  const [editExp, setEditExp] = useState({
    experience_id: currentExp.experience_id,
    title: currentExp.title,
    experience_company: currentExp.experience_company,
    start_month_year: currentExp.start_month_year?.slice(0, 7) || "",
    end_month_year: currentExp.end_month_year?.slice(0, 7) || "",
    description: currentExp.description || "",
  });

  
  const [errorsVal, setErrorsVal] = useState();
  const [otherError, setOtherError] = useState("");
  
  const handleChange = (e) => {
    const {name, value} = e.target;
    setEditExp({...editExp,[name]:value});
  }

  const onSubmit = async() => {
    setErrorsVal({});
    setOtherError("");
    try {
       validateForm(newExperienceSchema, editExp);

      const expData = {
        title: editExp.title,
        experience_company: editExp.experience_company,
        start_month_year: editExp.start_month_year
          ? `${editExp.start_month_year}-01`
          : "",
        end_month_year: editExp.end_month_year
          ? `${editExp.end_month_year}-01`
          : "",
        description: editExp.description,
      };
      await fetchAxios(`/experience/editExp/${editExp.experience_id}`,"PUT",expData,token);

      const resList = await fetchAxios("/experience/myExperience","GET",null,token);
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
  }
  
  return (
    <PageSection variant="candidate">
      <PageContainer>
        <FormJJ title="Editar experiencia" variant="glass">
          <InputJJ 
            label="Cargo*"
            name="title"
            type="text"
            placeholder="Ej. Jefe de cocina"
            value={editExp.title}
            onChange={handleChange}
            error={errorsVal?.title}
          />

          <InputJJ 
            label="Empresa u organización*"
            name="experience_company"
            type="text"
            placeholder="Ej. Amazon"
            value={editExp.experience_company}
            onChange={handleChange}
            error={errorsVal?.experience_company}
          />

          <MonthJJ 
            label="Fecha de inicio*"
            name="start_month_year"
            value={editExp.start_month_year}
            onChange={handleChange}
            error={errorsVal?.start_month_year}
          />

          <MonthJJ
            label="Fecha de finalización"
            name="end_month_year"
            value={editExp.end_month_year}
            onChange={handleChange}
            error={errorsVal?.end_month_year}
          />
    

          <TextAreaJJ
            label="Descripción"
            name="description"
            rows="5"
            placeholder="Describe la experiencia..."
            value={editExp.description ?? ''}
            onChange={handleChange}
            error={errorsVal?.description}
          />

          { otherError && <p className="errMsg">{otherError}</p>} 
          <ButtonGroupJJ>
            <ButtonJJ onClick={onSubmit}>Confirmar</ButtonJJ>
            <ButtonJJ variant="black" onClick={() => navigate(-1)}>Cancelar</ButtonJJ>
          </ButtonGroupJJ>
        </FormJJ>
      </PageContainer>
    </PageSection>
  )
}

export default EditExperience 