import { useContext, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import { useNavigate, useParams } from "react-router";
import { fetchAxios } from "../../../../helpers/axiosHelper";
import { validateForm } from "../../../../helpers/ValidateForms";
import { newStudySchema } from "../../../../schemas/NewStudySchema";
import { PageSection } from "../../../../components/PageSection/PageSection";
import { PageContainer } from "../../../../components/PageContainer/PageContainer";
import { FormJJ } from "../../../../components/Form/Form";
import { InputJJ } from "../../../../components/Form/Input";
import { MonthJJ } from "../../../../components/Form/Month";
import { TextAreaJJ } from "../../../../components/Form/TextArea";
import { FileInputJJ } from "../../../../components/Form/FileInput";
import uploadIcon from '../../../../assets/upload-solid-full.svg';
import { ButtonGroupJJ } from "../../../../components/Button/ButtonGroup";
import { ButtonJJ } from "../../../../components/Button/Button";


const EditStudy = () => {

  const { token, study, setStudy } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

   const currentStudy = study.find((st) => String(st.study_id) === String(id));

  
  const [editStudy, setEditStudy] = useState({
    study_id: currentStudy.study_id,
    studies: currentStudy.studies,
    studies_center: currentStudy.studies_center,
    start_month_year: currentStudy.start_month_year?.slice(0, 7) || "",
    end_month_year: currentStudy.end_month_year?.slice(0, 7) || "",
    description: currentStudy.description || "",
  });
  const [certificate, setCertificate] = useState();
  const [errorsVal, setErrorsVal] = useState();
  const [otherError, setOtherError] = useState("");

  const handleChange = (e) => {
    if (e.target.type === 'file') {
      setCertificate(e.target.files[0]);
    } else {
      const { name, value } = e.target;
      setEditStudy({ ...editStudy, [name]: value });
    }
  };

  const onSubmit = async () => {
    setErrorsVal({});
    setOtherError("");
    try {
      validateForm(newStudySchema, editStudy);

      const studyData = {
        studies: editStudy.studies,
        studies_center: editStudy.studies_center,
        start_month_year: editStudy.start_month_year
          ? `${editStudy.start_month_year}-01`
          : "",
        end_month_year: editStudy.end_month_year
          ? `${editStudy.end_month_year}-01`
          : "",
        description: editStudy.description,
      };

      console.log('studyData:', studyData);

      if (certificate) {
        const newFormData = new FormData();
        newFormData.append("data", JSON.stringify(studyData));
        newFormData.append("img", certificate);
        await fetchAxios(`/studies/editStudy/${editStudy.study_id}`, "PUT", newFormData, token);
      } else {
        await fetchAxios(`/studies/editStudy/${editStudy.study_id}`, "PUT", studyData, token);
      }
      const resList = await fetchAxios("/studies/myStudies","GET",null,token);
      const result = resList.data?.result || [];
      setStudy(result);

      navigate("/candidateProfile");
    } catch (error) {
      console.log('Error response:', error.response?.data);
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
      <FormJJ title="Editar estudio" variant='glass'>
        <InputJJ
          label="Institución educativa*"
          name="studies_center"
          type="text"
          placeholder="Ej. Universidad de Granada"
          value={editStudy.studies_center}
          onChange={handleChange}
          error={errorsVal?.studies_center}
        />

        <InputJJ
          label="Título*"
          name="studies"
          type="text"
          placeholder="Grado/licenciatura en Ingeniería Informática"
          value={editStudy.studies}
          onChange={handleChange}
          error={errorsVal?.studies}
        />

        <MonthJJ
          label="Fecha de inicio*"
          name="start_month_year"
          value={editStudy.start_month_year}
          onChange={handleChange}
          error={errorsVal?.start_month_year}
        />

        <MonthJJ
          label="Fecha de finalización"
          name="end_month_year"
          value={editStudy.end_month_year}
          onChange={handleChange}
          error={errorsVal?.end_month_year}
        />

        <TextAreaJJ
          label="Descripción"
          name="description"
          value={editStudy?.description || ""}
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

export default EditStudy