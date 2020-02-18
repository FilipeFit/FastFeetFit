import User from '../models/User';

class UserService {
  async save(req, res) {
    const userAlreadyExists = await User.findOne({
      where: { email: req.body.email }
    });

    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ error: 'A User with this email already exists' });
    }
    const savedUser = await User.create(req.body);
    const { roles } = req.body;
    if (roles && roles.length > 0) {
      savedUser.setRoles(roles);
    }
    return savedUser;
  }
}

export default new UserService();
