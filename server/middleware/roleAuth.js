module.exports = function(role) {
  return function(req, res, next) {
    if (req.user.role !== role) {
      return res.status(403).json({ msg: '权限不足，拒绝访问' });
    }
    next();
  };
};