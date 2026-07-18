import jobDal from './job.dal.js';

class JobController {
  createJob = async (req, res) => {
    try {
      const { name } = req.body;
      await jobDal.createJob({ name });

      res.status(200).json({ message: 'area añadida' });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };

  getAllJobs = async (req, res) => {
    try {
      const result = await jobDal.getAllJobs();
      res.status(200).json({ result });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };

  updateJob = async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      await jobDal.updateJob(id, name.trim());
      res.status(200).json({ message: 'Area actualizada' });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };

  deleteJob = async (req, res) => {
    try {
      const { id } = req.params;
      await jobDal.deleteJob(id);
      res.status(200).json({ message: 'Area borrada' });
    } catch (error) {
      res.status(500).json(error);
    }
  };
}

export default new JobController();
