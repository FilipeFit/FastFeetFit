import Role from '../models/Role';
import AuthorizationService from '../services/AuthorizationService';

class RoleController {
  async store(req, res) {
    if (!AuthorizationService.authorize(req, ['admin'])) {
      return res
        .status(401)
        .json("You don't have permitions to use this service");
    }
    const isRoleAlreadyExists = await Role.findOne({
      where: { role: req.body.role }
    });
    if (isRoleAlreadyExists) {
      return res.status(401).json('Role Already exists');
    }
    const { description, role } = await Role.create(req.body);
    return res.json({ description, role });
  }
}

export default new RoleController();
