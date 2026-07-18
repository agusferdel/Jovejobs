import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AuthContext } from "../../../../context/AuthContext";
import { Cardjj } from "../../../../components/Card/Card";
import { ButtonJJ } from "../../../../components/Button/Button";
import { PageSection } from "../../../../components/PageSection/PageSection";
import { PageContainer } from "../../../../components/PageContainer/PageContainer";
import { fetchAxios } from "../../../../helpers/axiosHelper";
import { getModality } from "../../../../helpers/getModality";
import userDefault from "../../../../assets/userDefault.jpg";
import "./publicCompanyProfile.css";
import { Containerjj } from "../../../../components/Container/Container";

const PublicCompanyProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  const [company, setCompany] = useState(null);
  const [active_offers, setActiveOffers] = useState(0);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otherError, setOtherError] = useState("");

  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        setLoading(true);
        setOtherError("");

        const company_res = await fetchAxios(`/company/publicCompany/${id}`, "GET");
        const company_data = company_res?.data?.result?.[0] || company_res?.data?.company || null;

        if (!company_data) {
          setOtherError("El perfil no existe o ya no está disponible.");
          setCompany(null);
          setOffers([]);
          setActiveOffers(0);
          return;
        }

        setCompany(company_data);

        const offers_res = await fetchAxios(`/offers/getOfferByUserId/${id}`, "GET");
        const all_offers = offers_res?.data || [];

        const active_offers_list = all_offers.filter((offer) => offer.is_active === 1);

        setActiveOffers(active_offers_list.length);
        setOffers(active_offers_list.slice(0, 10));
      } catch (error) {
        console.error(error);

        if (error.response?.status === 404) {
          setOtherError("El perfil no existe o ya no está disponible.");
        } else {
          setOtherError("No se ha podido cargar el perfil. Inténtalo de nuevo más tarde.");
        }

        setCompany(null);
        setOffers([]);
        setActiveOffers(0);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadCompanyData();
    }
  }, [id]);

  useEffect(() => {
    const checkApplications = async () => {
      if (!token || user?.type !== 3 || offers.length === 0) return;

      try {
        const results = await Promise.all(
          offers.map(async (offer) => {
            const res = await fetchAxios(
              `/offers/${offer.offer_id}/is-applied`,
              "GET",
              null,
              token
            );

            return {
              offer_id: offer.offer_id,
              is_applied: res?.data?.isApplied || false,
            };
          })
        );

        const next_map = {};
        results.forEach((item) => {
          next_map[item.offer_id] = item.is_applied;
        });
      } catch (error) {
        console.error(error);
      }
    };

    checkApplications();
  }, [offers, token, user]);

  if (loading) {
    return (
      <div className="candidate-layout">
        <Cardjj className="candidate-header-card">
          <h2>Cargando perfil...</h2>
          <p>Estamos recuperando la información pública de la empresa.</p>
        </Cardjj>
      </div>
    );
  }

  if (otherError) {
    return (
      <PageSection variant="company">
        <PageContainer>
          <div className="candidate-layout ">
            <Cardjj className="candidate-header-card mb-2">
              <h2>Perfil no disponible</h2>
              <p>{otherError}</p>
            </Cardjj>
            <div className="candidate-add">
              <ButtonJJ variant="content-primary" onClick={() => navigate(-1)}>
                Volver
              </ButtonJJ>
            </div>
          </div>
        </PageContainer>
      </PageSection>
    );
  }

  return (
    <PageSection variant="company">
      <PageContainer>
        <Containerjj variant="public-container">
          <div className="public-company-profile-layout">
            <Cardjj className="public-company-profile-card">
              <div className="public-company-profile-left">
                <img
                  className="public-company-logo"
                  src={
                    company?.avatar
                      ? `${import.meta.env.VITE_SERVER_IMAGES_URL}/user/${company.avatar}`
                      : userDefault
                  }
                  alt={`Logo de ${company?.company_title || "empresa"}`}
                />
                <h1>{company?.company_title || "Empresa"}</h1>
              </div>

              <div className="public-company-profile-right">
                <p className="public-company-description">
                  {company?.company_description ||
                    "Esta empresa no ha añadido descripción todavía."}
                </p>
                <p className="public-company-active-count">
                  Ofertas activas: {active_offers}
                </p>

                <div>
                  <ButtonJJ variant="content-primary" onClick={() => navigate(-1)}>
                    Volver
                  </ButtonJJ>
                </div>
              </div>
            </Cardjj>

            <div className="public-company-offers-list">
              {offers.length > 0 ? (
                offers.map((offer) => (
                  <Cardjj className="public-company-offer-item" key={offer.offer_id}>
                    <div className="public-company-offer-info">
                      <h3>{offer.title}</h3>
                      <p>
                        {offer.city_name || "Ubicación no especificada"} ·{" "}
                        {getModality(offer.modality)} ·{" "}
                        {offer.offer_type_name || "Tipo no especificado"}
                      </p>
                    </div>

                    <div className="public-company-offer-actions">
                      <ButtonJJ
                        variant="content-offer"
                        onClick={() => navigate(`/offer/${offer.offer_id}`)}
                      >
                        Ver oferta
                      </ButtonJJ>
                    </div>
                  </Cardjj>
                ))
              ) : (
                <Cardjj className="public-company-offer-empty">
                  <p>Esta empresa no tiene ofertas activas ahora mismo.</p>
                </Cardjj>
              )}
            </div>
          </div>
        </Containerjj>
      </PageContainer>
    </PageSection>
  );
};

export default PublicCompanyProfile;