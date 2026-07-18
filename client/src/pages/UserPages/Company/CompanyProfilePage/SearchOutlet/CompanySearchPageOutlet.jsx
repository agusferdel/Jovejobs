import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { fetchAxios } from '../../../../../helpers/axiosHelper.js';
import { AuthContext } from '../../../../../context/AuthContext.js';
import { ButtonJJ } from '../../../../../components/Button/Button.jsx';
import { Cardjj } from '../../../../../components/Card/Card.jsx';
import './companySearchPage.css';
import { getModality } from '../../../../../helpers/getModality.js';
import { InputJJ } from '../../../../../components/Form/Input.jsx';
import { FormJJ } from '../../../../../components/Form/Form.jsx';

const CompanySearchPage = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [formSearch, setFormSearch] = useState({
    palabraClave: ''
  });

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormSearch((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setErrorMsg('');

      const res = await fetchAxios('/company/searchCandidates','POST',formSearch,token);

      const data = res.data?.result || res.data || [];
      setCandidates(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al buscar candidatos', error);
      setErrorMsg('No se pudieron cargar los candidatos');
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  const getSearchingLabel = (isSearching) => {
    return Number(isSearching) === 1 ? 'En busca de empleo' : 'No disponible';
  };

  return (
    
      
        <div className="company-search-page ">
          <Cardjj className="company-search-box">
            <div className="company-search-head">
              <div className="company-search-title">
                <h1>Búsqueda de candidatos</h1>
                <p>Encuentre posibles empleados</p>
              </div>

              <FormJJ variant='clean' className="company-search-form">
               
                <div>
                  <InputJJ
                    type="text"
                    name="palabraClave"
                    placeholder="Introduzca palabras clave"
                    value={formSearch.palabraClave}
                    onChange={handleChange}
                  />
                </div>

                <ButtonJJ type='submit' onClick={handleSearch} variant="content-tertiary" disabled={loading}>
                  {loading ? 'Buscando...' : 'Buscar'}
                </ButtonJJ>
              </FormJJ>
            </div>
          </Cardjj>

          <Cardjj className="company-results-box">
            {errorMsg && <p className="company-search-message error">{errorMsg}</p>}

            {!loading && !errorMsg && candidates.length === 0 && (
              <p className="company-search-message">
                No se han encontrado candidatos con esos filtros.
              </p>
            )}

            <div className="company-results-list">
              {candidates.map((candidate) => (
                <article className="company-result-item" key={candidate.user_id}>
                  <div className="company-result-info">
                    <h3>
                      {candidate.name} {candidate.lastname}
                    </h3>

                    <p>
                      {getModality(candidate.modality)} ·{' '}
                      {candidate.city_name || 'Ciudad no indicada'}
                      {candidate.province_name ? `, ${candidate.province_name}` : ''}
                    </p>

                    <span
                      className={`company-result-status ${
                        Number(candidate.is_searching) === 1 ? 'active' : 'inactive'
                      }`}
                    >
                      {getSearchingLabel(candidate.is_searching)}
                    </span>
                  </div>

                  <div className="company-result-actions">
                    <ButtonJJ
                      type="button"
                      variant="black"
                      onClick={() => navigate(`/candidate/public/${candidate.user_id}`)}
                    >
                      Ver perfil
                    </ButtonJJ>
                  </div>
                </article>
              ))}
            </div>
          </Cardjj>
        </div>
  );
};

export default CompanySearchPage;