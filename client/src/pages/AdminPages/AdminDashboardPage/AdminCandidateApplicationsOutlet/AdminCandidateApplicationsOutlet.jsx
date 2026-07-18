import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {fetchAxios} from "../../../../helpers/axiosHelper";
import {Cardjj} from "../../../../components/Card/Card";
import {ButtonJJ} from "../../../../components/Button/Button";
import {InputJJ} from "../../../../components/Form/Input";
import "./adminCandidateApplications.css";
import { AuthContext } from "../../../../context/AuthContext";

const STATUS_LABEL = {
  1: "Inscrito",
  2: "Preseleccionado",
  3: "Descartado",
};

const MODALITY_LABEL = {
  1: "Modalidad remota",
  2: "Modalidad presencial",
  3: "Modalidad híbrida",
};

const STATUS_CLASS = {
  1: "application-admin-badge status-1",
  2: "application-admin-badge status-2",
  3: "application-admin-badge status-3",
};

const AdminCandidateApplicationsOutlet = () => {
  const {token} = useContext(AuthContext);
  const { candidateId } = useParams();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState(null);
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCandidateInfo = async () => {
      try {
        const res = await fetchAxios(`/candidate/adminGetCandidate/${candidateId}`,"GET",null,token);
        
        setCandidate(res.data?.user || null);
      } catch (error) {
        console.error(error);
      }
    };
    
    const getApplications = async () => {
      try {
       const res = await fetchAxios(`/offers/adminCandidateApplications/${candidateId}`,"GET",null,token);
        const data = res?.data || [];
        
        setApplications(data);
      } catch (error) {
        console.error(error);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    if (candidateId && token) {
      getCandidateInfo();
      getApplications();
    }
  }, [candidateId, token]);

  const handleClearFilters = () => {
    setSearch("");
  };

  const term = search.toLowerCase().trim();

  const filteredApplications = !term
    ? applications
    : applications.filter((item) => {
        const company = item.company_title?.toLowerCase() || "";
        const title = item.title?.toLowerCase() || item.job_name?.toLowerCase() || "";

        return company.includes(term) || title.includes(term);
      });

  const candidateFullName = candidate
    ? `${candidate.name || ""} ${candidate.lastname || ""}`.trim()
    : "Candidato";

  return (
    <div className="admin-candidate-applications-layout">
      <Cardjj className="admin-candidate-applications-header-card">
        <div className="admin-candidate-applications-header">
          <div>
            <h2>Candidaturas de {candidateFullName}</h2>
            <p>
              Consulta las ofertas a las que se ha inscrito este candidato y haz
              un seguimiento visual del proceso.
            </p>
          </div>

          <div className="admin-candidate-applications-header-actions">
            <ButtonJJ variant="white" onClick={() => navigate(-1)}>
              Volver
            </ButtonJJ>
          </div>
        </div>
      </Cardjj>

      <Cardjj className="admin-candidate-applications-filters-card">
        <div className="admin-candidate-applications-filters">
          <div className="admin-candidate-applications-search">
            <InputJJ
              label="Buscar por empresa o puesto"
              name="searchApplications"
              placeholder="Buscar empresa o puesto"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="admin-candidate-applications-clear">
            <ButtonJJ variant="white" onClick={handleClearFilters}>
              Limpiar filtros
            </ButtonJJ>
          </div>
        </div>
      </Cardjj>

      <div className="admin-candidate-applications-list">
        {loading ? (
          <Cardjj>
            <p>Cargando candidaturas...</p>
          </Cardjj>
        ) : filteredApplications.length > 0 ? (
          filteredApplications.map((item) => (
            <Cardjj
              key={item.offer_id}
              className={`admin-candidate-application-item ${
                item.is_active === 0 ? "offer-inactive" : ""
              }`}
            >
              <div className="admin-candidate-application-top">
                <div className="admin-candidate-application-main">
                  <h3>{item.title || item.job_name}</h3>

                  <p className="application-admin-company">
                    {item.company_title}
                    { ` · ${item.city_name}`}
                    { `, ${item.province_name}` }
                  </p>

                  <p className="application-admin-date">
                    Aplicada el{" "}
                    { item.application_date.slice(0, 10).split("-").reverse().join("/")}
                  </p>

                  <div className="admin-candidate-application-actions">
                    <ButtonJJ
                      variant="content-primary"
                      onClick={() => navigate(`/offer/${item.offer_id}`)}
                    >
                      Ver oferta
                    </ButtonJJ>
                  </div>
                </div>

                <div className="admin-candidate-application-side">
                  <p className="application-admin-modality">
                    {MODALITY_LABEL[item.modality]}
                  </p>

                  <span
                    className={
                      STATUS_CLASS[item.application_status]}
                  >
                    {STATUS_LABEL[item.application_status]}
                  </span>
                </div>
              </div>
            </Cardjj>
          ))
        ) : (
          <Cardjj>
            <p>
              {applications.length === 0
                ? "Este candidato no tiene candidaturas registradas."
                : "No hay resultados para esa búsqueda."}
            </p>
          </Cardjj>
        )}
      </div>
    </div>
  );
};

export default AdminCandidateApplicationsOutlet;