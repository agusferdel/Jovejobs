import provinceDal from "./province.dal.js";

class ProvinceController {
    provinceSearch = async (req, res) => {
    try {
      const citySearchData = req.query.q || '';
      const result = await provinceDal.provinceSearch(citySearchData);
      res.status(200).json({ result });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };
}

export default new ProvinceController();
