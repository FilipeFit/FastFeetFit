class AuthorizationService {
  authorize(req, authorizedServiceRolesList) {
    const userRoles = req.roles;
    let isAuthorized = false;
    authorizedServiceRolesList.forEach(serviceRole => {
      if (userRoles.includes(serviceRole)) {
        isAuthorized = true;
      }
    });
    return isAuthorized;
  }
}

export default new AuthorizationService();
