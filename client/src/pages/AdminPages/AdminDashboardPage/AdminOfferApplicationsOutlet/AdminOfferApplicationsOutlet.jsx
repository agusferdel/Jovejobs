import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { fetchAxios } from '../../../../helpers/axiosHelper.js';
import { Cardjj } from '../../../../components/Card/Card.jsx';
import { ButtonJJ } from '../../../../components/Button/Button.jsx';
import './adminOfferApplications.css';
import { useContext } from 'react';
import { AuthContext } from '../../../../context/AuthContext.js';

const STATUS_LABEL = {
  1: 'Inscrito',
  2: 'Preseleccionado',
  3: 'Descartado',
};

const STATUS_CLASS = {
  1: 'application-status status-inscrito',
  2: 'application-status status-preseleccionado',
  3: 'application-status status-descartado',
};

const AdminOfferApplicationsOutlet = () => {
  const {token} = useContext(AuthContext);
  const { companyId, offerId } = useParams();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [offerTitle, setOfferTitle] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const res = await fetchAxios(`/offers/offerApplications/${companyId}/${offerId}`,'GET',null,token);

        const data = res?.data || [];

        const normalizedData = data.map((item) => ({
          ...item,
          contacted: item.is_contacted === 1,
        }));

        setApplications(normalizedData);
        setOfferTitle(data[0]?.title || 'Oferta');
      } catch (error) {
        console.error(error);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    if (token && companyId && offerId) {
      loadApplications();
    }
  }, [token, companyId, offerId]);

  const handleToggleContact = async (user_id, currentContacted) => {
    const newValue = currentContacted ? 0 : 1;

    setApplications((prev) =>
      prev.map((item) =>
        item.user_id === user_id
          ? { ...item, contacted: !currentContacted }
          : item
      )
    );

    try {
      await fetchAxios(
        `/offers/offerApplications/contact/${offerId}/${user_id}`,
        'PUT',
        { is_contacted: newValue },
        token
      );
    } catch (error) {
      console.error(error);

      setApplications((prev) =>
        prev.map((item) =>
          item.user_id === user_id
            ? { ...item, contacted: currentContacted }
            : item
        )
      );
    }
  };

  const handleUpdateStatus = async (candidateId, newStatus) => {
    setApplications((prev) =>
      prev.map((item) =>
        item.user_id === candidateId ? { ...item, status: newStatus } : item
      )
    )

    try {
      await fetchAxios(`/offers/offerApplications/status/${offerId}/${candidateId}`,"PUT",{ status: newStatus },token)
    } catch (error) {
      console.error(error)
    }
  }

  const filteredApplications = applications.filter((item) => {
    const fullName = `${item.name || ''} ${item.lastname || ''}`
      .toLowerCase()
      .trim();

    return fullName.includes(search.toLowerCase().trim());
  });

  return (
    <div className="admin-offer-applications-layout">
      <Cardjj className="admin-offer-applications-header-card">
        <div className="admin-offer-applications-header">
          <div className="admin-offer-applications-header-text">
            <h2>Candidaturas de {offerTitle}</h2>
            <p>Consulta y revisa los candidatos inscritos en esta oferta.</p>
          </div>

          <div className="admin-offer-applications-header-actions">
            <input
              type="text"
              placeholder="Buscar candidato..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-offer-applications-search"
            />

            <ButtonJJ variant="white" onClick={() => navigate(-1)}>
              Volver
            </ButtonJJ>
          </div>
        </div>
      </Cardjj>

      <div className="admin-offer-applications-list">
        {loading ? (
          <Cardjj>
            <p>Cargando candidaturas...</p>
          </Cardjj>
        ) : filteredApplications.length > 0 ? (
          filteredApplications.map((item) => (
            <Cardjj
              key={`${item.offer_id}-${item.user_id}`}
              className="admin-offer-application-item"
            >
              <div className="admin-offer-application-main">
                <div className="admin-offer-application-info">
                  <h3>
                    {item.name} {item.lastname}
                  </h3>

                  <p>
                    Inscrito el{' '}
                    {item.date
                      ? new Date(item.date).toLocaleDateString()
                      : 'sin fecha'}
                  </p>

                  <div className="admin-offer-application-actions">
                    <ButtonJJ
                      variant="content-primary"
                      onClick={() =>
                        navigate(`/adminDashboard/candidateProfile/${item.user_id}`)
                      }
                    >
                      Ver perfil
                    </ButtonJJ>

                    <ButtonJJ 
                      variant="content-quaternary"
                      onClick={() => handleUpdateStatus(item.user_id, 2)}>
                      Preseleccionar
                    </ButtonJJ>

                    <ButtonJJ 
                      variant="content-delete"
                      onClick={() => handleUpdateStatus(item.user_id, 3)}>
                      Rechazar
                    </ButtonJJ>
                  </div>
                </div>

                <div className="admin-offer-application-side">
                  <button
                    type="button"
                    className={
                      item.contacted
                        ? 'contact-toggle-btn contacted'
                        : 'contact-toggle-btn not-contacted'
                    }
                    onClick={() =>
                      handleToggleContact(item.user_id, item.contacted)
                    }
                  >
                    {item.contacted ? 'Contactado' : 'No contactado'}
                  </button>

                  <span
                    className={
                      STATUS_CLASS[item.status] || 'application-status'
                    }
                  >
                    {STATUS_LABEL[item.status]}
                  </span>
                </div>
              </div>
            </Cardjj>
          ))
        ) : (
          <Cardjj>
            <p>No hay candidaturas para esta oferta.</p>
          </Cardjj>
        )}
      </div>
    </div>
  );
};

export default AdminOfferApplicationsOutlet;