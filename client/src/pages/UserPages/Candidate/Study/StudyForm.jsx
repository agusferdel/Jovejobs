import { useContext, useState } from "react"
import { fetchAxios } from "../../../../helpers/axiosHelper";
import { AuthContext } from "../../../../context/AuthContext";
import { validateForm } from "../../../../helpers/ValidateForms";
import { newStudySchema } from "../../../../schemas/NewStudySchema";
import { useNavigate } from "react-router";
import { FormJJ } from "../../../../components/Form/Form";
import { InputJJ } from "../../../../components/Form/Input";
import { MonthJJ } from "../../../../components/Form/Month";
import { TextAreaJJ } from "../../../../components/Form/TextArea";
import { FileInputJJ } from "../../../../components/Form/FileInput";
import uploadIcon from '../../../../assets/upload-solid-full.svg';
import { ButtonGroupJJ } from "../../../../components/Button/ButtonGroup";
import { ButtonJJ } from "../../../../components/Button/Button";
import { PageSection } from "../../../../components/PageSection/PageSection";
import { PageContainer } from "../../../../components/PageContainer/PageContainer";

const initialValue = {
  studies_center: "",
  studies: "",
  start_month_year:"",
  end_month_year:"",
  description:""
}

const StudyForm = () => {

  const {token, setStudy} = useContext(AuthContext);
  const [newStudy, setNewStudy] = useState(initialValue);
  const [certificate, setCertificate] = useState();
  const [errorsVal, setErrorsVal] = useState();
  const [otherError, setOtherError] = useState("")

  const navigate = useNavigate();

  const handleChange = (e) => {
    
    if (e.target.type === 'file'){
      setCertificate(e.target.files[0]);
    }
    else {
      const {name, value} = e.target;
      setNewStudy({...newStudy, [name]: value});
    }
  }

  const onSubmit = async() => {
    setErrorsVal({});
    setOtherError("");
    const newFormData = new FormData();

    try {
      validateForm(newStudySchema,newStudy)

      const studyData = {
      ...newStudy,
      start_month_year: newStudy.start_month_year ? `${newStudy.start_month_year}-01` : "",
      end_month_year: newStudy.end_month_year ? `${newStudy.end_month_year}-01` : "",
    };
      newFormData.append("data",JSON.stringify(studyData));
  
      if (certificate){
        newFormData.append("img",certificate);
      }
      await fetchAxios('/studies/newStudy', "POST", newFormData, token);

      const resList = await fetchAxios("/studies/myStudies","GET",null,token);
      const result = resList.data?.result || [];

      setStudy(result);
      navigate('/candidateProfile')
    } catch (error) {
      if (error.errType === "validator") {
        setErrorsVal(error);
      } else if (error.response?.data?.details) {
        setOtherError(error.response.data.details);
      } else {
        setOtherError("Ha habido un error");
      }
    }
  }
  return (
  <PageSection variant="candidate">
    <PageContainer>
      <FormJJ title="Añadir estudio" variant='glass'>
        <InputJJ
          label="Institución educativa*"
          name="studies_center"
          type="text"
          placeholder="Ej. Universidad de Granada"
          value={newStudy.studies_center}
          onChange={handleChange}
          error={errorsVal?.studies_center}
        />

        <InputJJ
          label="Título*"
          name="studies"
          type="text"
          placeholder="Grado/licenciatura en Ingeniería Informática"
          value={newStudy.studies}
          onChange={handleChange}
          error={errorsVal?.studies}
        />

        <MonthJJ
          label="Fecha de inicio*"
          name="start_month_year"
          value={newStudy.start_month_year}
          onChange={handleChange}
          error={errorsVal?.start_month_year}
        />

        <MonthJJ
          label="Fecha de finalización"
          name="end_month_year"
          value={newStudy.end_month_year}
          onChange={handleChange}
          error={errorsVal?.end_month_year}
        />

        <TextAreaJJ
          label="Descripción"
          name="description"
          value={newStudy?.description || ""}
          onChange={handleChange}
          rows="5"
          placeholder="Describe aquí tus estudios, proyectos, logros, etc."
          error={errorsVal?.description}
        />

        <FileInputJJ
          label="Añadir certificación"
          name="certificate"
          hint="Formatos: PDF, Word (DOC/DOCX), JPG, PNG. Máx: 10MB."
          onChange={handleChange}
          icon={<img src={uploadIcon} alt="" width="16" height="16" />}
          selectedFile={certificate}
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

export default StudyForm