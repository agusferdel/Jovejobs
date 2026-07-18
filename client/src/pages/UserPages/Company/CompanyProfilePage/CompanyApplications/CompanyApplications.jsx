import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import {fetchAxios} from "../../../../../helpers/axiosHelper.js"
import {AuthContext} from "../../../../../context/AuthContext.js"
import {Cardjj} from "../../../../../components/Card/Card.jsx"
import {ButtonJJ} from "../../../../../components/Button/Button.jsx"
import "./companyApplications.css"
import { getModality } from "../../../../../helpers/getModality.js"
import { PageSection } from "../../../../../components/PageSection/PageSection.jsx"
import { PageContainer } from "../../../../../components/PageContainer/PageContainer.jsx"

const STATUS_LABEL = {
  1: "Inscrito",
  2: "Preseleccionado",
  3: "Descartado",
}

const CompanyApplications = () => {
  const { offer_id } = useParams()
  const navigate = useNavigate()
  const { token, user } = useContext(AuthContext)

  const [offerInfo, setOfferInfo] = useState(null)
  const [applications, setApplications] = useState([])
  const [filters, setFilters] = useState({
    name: "",
    city: "",
    area: "",
  })
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const offerRes = await fetchAxios(`/offers/${offer_id}`, "GET", null, null)
        setOfferInfo(offerRes?.data)

        const applicationsRes = await fetchAxios( `/offers/offerApplications/${offer_id}`, "GET", null, token);

        setApplications(applicationsRes?.data || [])
      } catch (error) {
        console.error(error)
        setApplications([])
      }
    }

    if (offer_id && token && user?.user_id) {
      loadData()
    }
  }, [offer_id, token, user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFilters({ ...filters, [name]: value })
  }

  const handleUpdateStatus = async (candidateId, newStatus) => {
    setApplications((prev) =>
      prev.map((item) =>
        item.user_id === candidateId ? { ...item, status: newStatus } : item
      )
    )

    try {
      await fetchAxios(`/offers/offerApplications/status/${offer_id}/${candidateId}`,"PUT",{ status: newStatus },token)
    } catch (error) {
      console.error(error)
    }
  }

  const filteredApplications = applications.filter((item) => {
    const fullName = `${item.name || ""} ${item.lastname || ""}`.toLowerCase()
    const city = `${offerInfo?.city_name || ""}`.toLowerCase()
    const area = `${offerInfo?.job_name || offerInfo?.title || ""}`.toLowerCase()

    return (
      fullName.includes(filters.name.toLowerCase().trim()) &&
      city.includes(filters.city.toLowerCase().trim()) &&
      area.includes(filters.area.toLowerCase().trim())
    )
  })

  return (
    <PageSection variant="offers">
      <PageContainer>

    <div className="company-applications-page">
      <Cardjj className="company-applications-shell">
        <div className="company-applications">
          <h1>{offerInfo?.title}</h1>
          <p>
            {offerInfo?.is_active === 1? 'Oferta laboral activa':'Oferta inactiva'} ·{" "}
            {offerInfo?.workday_type_name} ·{" "}
            Modalidad {getModality(offerInfo?.modality)}
          </p>
        </div>

        <div className="company-applications-body">
          <div className="company-applications-header">
            <h2>Candidatos</h2>
          </div>

          <div className="company-applications-filters">
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              value={filters.name}
              onChange={handleChange}
              />
            <input
              type="text"
              name="city"
              placeholder="Ciudad"
              value={filters.city}
              onChange={handleChange}
              />
            <input
              type="text"
              name="area"
              placeholder="Área"
              value={filters.area}
              onChange={handleChange}
              />
          </div>

          <div className="company-applications-list">
            {filteredApplications.length > 0 ? (
              filteredApplications.map((item) => (
                <Cardjj className="company-application-row" key={`${item.user_id}-${item.offer_id}`}>
                  <div className="company-application-info">
                    <div className="company-application-name-line">
                      <h3>{item.name} {item.lastname}</h3>

                      <button
                        className="mini-profile-btn"
                        onClick={() => navigate(`/candidate/public/${item.user_id}`)}
                        >
                        Ver Perfil
                      </button>
                    </div>

                    <p>
                      {offerInfo?.job_name || offerInfo?.title} ·{" "}
                      {new Date(item.date).toLocaleDateString()}
                    </p>

                    <span>{offerInfo?.city_name}</span>
                  </div>

                  <div className="company-application-side">
                    <span className={`company-status-badge status-${item.status}`}>
                      {STATUS_LABEL[item.status]}
                    </span>

                    <div className="company-application-actions">
                      <ButtonJJ
                        variant="content-quaternary"
                        onClick={() => handleUpdateStatus(item.user_id, 2)}
                        >
                        Preseleccionar
                      </ButtonJJ>

                      <ButtonJJ
                        variant="content-delete"
                        onClick={() => handleUpdateStatus(item.user_id, 3)}
                        >
                        Rechazar
                      </ButtonJJ>
                    </div>
                  </div>
                </Cardjj>
              ))
            ) : (
              <div className="company-applications-empty">
                <p>No hay candidatos para esta oferta.</p>
              </div>
            )}
          </div>

          <div className="company-applications-footer">
            <ButtonJJ variant="content-offer" onClick={() => navigate(-1)}>
              Volver
            </ButtonJJ>
          </div>
        </div>
      </Cardjj>
    </div>
            </PageContainer>
            </PageSection>
  )
}

export default CompanyApplications