export const getModality = (modality) => {
  const modalities = {
    1: 'Remoto',
    2: 'Presencial',
    3: 'Híbrido'
  };

  if (!modality) return 'No especificado';

  const values = String(modality)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  const labels = [...new Set(values)]
    .map((item) => modalities[Number(item)])
    .filter(Boolean);

  return labels.length ? labels.join(', ') : 'No especificado';
};