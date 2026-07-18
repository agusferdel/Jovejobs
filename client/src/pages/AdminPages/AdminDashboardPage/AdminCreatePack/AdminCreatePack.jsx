import { useContext, useState } from 'react';
import { validateForm } from '../../../../helpers/ValidateForms';
import { CreatePackSchema } from '../../../../schemas/CreatePackSchema';
import { fetchAxios } from '../../../../helpers/axiosHelper.js';
import { useNavigate } from 'react-router';
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

const AdminCreatePack = () => {
  // Recuperamos el token para poder enviarlo en la ruta protegida POST
  const { token } = useContext(AuthContext);

  const [adminCreatePack, setAdminCreatePack] = useState(initialValue);
  const [errorsVal, setErrorsVal] = useState({});
  const [otherError, setOtherError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminCreatePack({ ...adminCreatePack, [name]: value });
  };

  const onSubmit = async () => {
    setErrorsVal({});
    setOtherError('');

    try {
      validateForm(CreatePackSchema, adminCreatePack);

      // 2. Transformamos datos numéricos para la base de datos tras superar la validación
      const payload = {
        ...adminCreatePack,
        price: parseFloat(adminCreatePack.price),
        included_offers: parseInt(adminCreatePack.included_offers, 10),
      };

      let url = '/pack/createPack';
      await fetchAxios(url, 'POST', payload, token);

      navigate('/adminDashboard/packs');
    } catch (error) {
      if (error.errType === 'validator') {
        console.log('Errores de validación en el formulario de packs');
        setErrorsVal(error);
      } else if (error?.response?.data?.errno === 1062) {
        setOtherError(
          'Ya existe un paquete registrado con ese nombre comercial'
        );
      } else {
        setOtherError('Ha ocurrido un problema interno al guardar el paquete');
      }
    }
  };

  return (
    <PageSection variant="regpack">
      <PageContainer>
        <FormJJ title="Registro de nuevo pack" variant="glass">
          <InputJJ
            label="Nombre del Paquete*"
            name="name"
            type="text"
            placeholder="Ej. Pack Oro, Mensual, Premium..."
            value={adminCreatePack.name}
            onChange={handleChange}
            error={errorsVal?.name}
          />

          <InputJJ
            label="Precio (€)*"
            name="price"
            type="number"
            placeholder="Introduce el precio (ej. 299.99)"
            value={adminCreatePack.price}
            onChange={handleChange}
            error={errorsVal?.price}
          />

          <InputJJ
            label="Número de Ofertas Incluidas*"
            name="included_offers"
            type="number"
            placeholder="Cantidad de ofertas asignadas"
            value={adminCreatePack.included_offers}
            onChange={handleChange}
            error={errorsVal?.included_offers}
          />

          <InputJJ
            label="Descripción o Ventajas Comerciales"
            name="description"
            type="text"
            placeholder="Detalla qué incluye el paquete..."
            value={adminCreatePack.description}
            onChange={handleChange}
            error={errorsVal?.description}
          />

          {otherError && <p className="errMsg">{otherError}</p>}

          <ButtonGroupJJ>
            <ButtonJJ variant="active" onClick={onSubmit}>
              Crear pack
            </ButtonJJ>
            <ButtonJJ
              variant="black"
              onClick={() => navigate('/adminDashboard/packs')}
            >
              Cancelar
            </ButtonJJ>
          </ButtonGroupJJ>
        </FormJJ>
      </PageContainer>
    </PageSection>
  );
};

export default AdminCreatePack;
