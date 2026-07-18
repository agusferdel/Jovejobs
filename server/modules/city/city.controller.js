import cityDal from "./city.dal.js";

class CityController {
    citySearch = async (req, res) => {
    try {
      const { province_id } = req.params;

      if (!province_id) {
        return res.status(200).json({ result: [] });
      }

      const result = await cityDal.citySearch(province_id);
      return res.status(200).json({ result });
    } catch (error) {
      console.log('Error en la búsqueda de ciudades:', error);
      return res.status(500).json(error);
    }
  };

  getCityById = async (req, res) => {
    try {
      const { city_id } = req.params;
      const result = await cityDal.cityById(city_id);

      if (!result.length) {
        return res.status(404).json({ message: 'Ciudad no encontrada' });
      }

      res.status(200).json(result[0]);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

export default new CityController();