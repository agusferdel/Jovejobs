export const updateCompanyOffers = async (pack, token) => {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/pack/purchase`, { 
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    // Enviamos el objeto pack completo al backend (req.body.pack)
    body: JSON.stringify({ pack }) 
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error al actualizar las ofertas');
  }

  return data;
};