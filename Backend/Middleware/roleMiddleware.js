export const allowRoles = (...allowed) => {
  return (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'No autenticado' });
    if (!allowed.includes(user.rol)) return res.status(403).json({ error: 'Permiso denegado' });
    next();
  };
};
