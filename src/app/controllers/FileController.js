import File from '../models/File';
import AuthorizationService from '../services/AuthorizationService';

class FileController {
  async store(req, res) {
    if (!AuthorizationService.authorize(req, ['admin'])) {
      return res
        .status(401)
        .json("You don't have permitions to use this service");
    }
    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path
    });

    return res.json(file);
  }
}

export default new FileController();
