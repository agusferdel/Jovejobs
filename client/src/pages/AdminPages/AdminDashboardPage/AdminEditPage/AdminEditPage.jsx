import { useContext, useEffect, useState } from 'react';
import { validateForm } from '../../../../helpers/ValidateForms';
import { CreatePackSchema } from '../../../../schemas/CreatePackSchema.js';
import { fetchAxios } from '../../../../helpers/axiosHelper';
import { useNavigate, useParams } from 'react-router';
import { FormJJ } from '../../../../components/Form/Form';
import { InputJJ } from '../../../../components/Form/Input';
import { ButtonGroupJJ } from '../../../../components/Button/ButtonGroup';
import { ButtonJJ } from '../../../../components/Button/Button';
import { PageSection } from '../../../../components/PageSection/PageSection';
import { PageContainer } from '../../../../components/PageContainer/PageContainer';
import { AuthContext } from '../../../../context/AuthContext';

const initialValue = {
  name: '',
  price: '',
  description: '',
  included_offers: '',
};

const AdminEditPack = () => {
  const { token } = useContext(AuthContext);
  const { pack_id } = useParams();
  const navigate = useNavigate();

  const [adminEditPack, setAdminEditPack] = useState(initialValue);
  const [errorsVal, setErrorsVal] = useState({});
  const [otherError, setOtherError] = useState('');

  // Carga los datos actuales del pack al abrir la pantalla
  // Carga los datos actuales del pack al abrir la pantalla de forma correcta
  useEffect(() => {
    const loadPackData = async () => {
      try {
        const response = await fetchAxios(`/pack/${pack_id}`, 'GET', null);

        // 1. Extraemos el resultado respetando la estructura Axios
        let currentPack = response?.data?.result ?? response?.result;

        // 2. CORRECCIÓN: Si viene dentro de un array [ { ... } ], tomamos el primer elemento
        if (Array.isArray(currentPack) && currentPack.length > 0) {
          currentPack = currentPack[0];
        }

        // 3. Rellenamos los inputs asegurando que siempre sean strings para Zod
        if (currentPack) {
          setAdminEditPack({
            name: currentPack.name || '',
            price:
              currentPack.price !== undefined ? String(currentPack.price) : '',
            description: currentPack.description || '',
            included_offers:
              currentPack.included_offers !== undefined
                ? String(currentPack.included_offers)
                : '',
          });
        }
      } catch (error) {
        console.error('Error al cargar el paquete:', error);
        setOtherError('No se pudieron recuperar los datos del paquete');
      }
    };

    if (pack_id) loadPackData();
  }, [pack_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminEditPack({ ...adminEditPack, [name]: value });
  };

  const onSubmit = async () => {
    setErrorsVal({});
    setOtherError('');

    try {
      validateForm(CreatePackSchema, adminEditPack);
      const payload = {
        ...adminEditPack,
        price: parseFloat(adminEditPack.price),
        included_offers: parseInt(adminEditPack.included_offers, 10),
      };

      let url = `/pack/editPack/${pack_id}`;
      await fetchAxios(url, 'PUT', payload, token);
      navigate('/adminDashboard/packs');
    } catch (error) {
      if (error.errType === 'validator') {
        console.log('Errores de validación en el formulario de edición');
        setErrorsVal(error);
      } else if (error?.response?.data?.errno === 1062) {
        setOtherError(
          'Ya existe un paquete registrado con ese nombre comercial'
        );
      } else {
        setOtherError(
          'Ha ocurrido un problema interno al modificar el paquete'
        );
      }
    }
  };

  return (
    <PageSection variant="regpack">
      <PageContainer>
        <FormJJ title="Modificar paquete" variant="glass">
          <InputJJ
            label="Nombre del Paquete*"
            name="name"
            type="text"
            value={adminEditPack.name}
            onChange={handleChange}
            error={errorsVal?.name}
          />

          <InputJJ
            label="Precio (€)*"
            name="price"
            type="number"
            value={adminEditPack.price}
            onChange={handleChange}
            error={errorsVal?.price}
          />

          <InputJJ
            label="Número de Ofertas Incluidas*"
            name="included_offers"
            type="number"
            value={adminEditPack.included_offers}
            onChange={handleChange}
            error={errorsVal?.included_offers}
          />

          <InputJJ
            label="Descripción o Ventajas Comerciales"
            name="description"
            type="text"
            value={adminEditPack.description}
            onChange={handleChange}
            error={errorsVal?.description}
          />

          {otherError && <p className="errMsg">{otherError}</p>}

          <ButtonGroupJJ>
            <ButtonJJ variant="active" onClick={onSubmit}>
              Guardar cambios
            </ButtonJJ>
            <ButtonJJ variant="black" onClick={() => navigate(-1)}>
              Cancelar
            </ButtonJJ>
          </ButtonGroupJJ>
        </FormJJ>
      </PageContainer>
    </PageSection>
  );
};

export default AdminEditPack;
