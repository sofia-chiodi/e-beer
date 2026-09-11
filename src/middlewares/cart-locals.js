const cartServices = require('../services/cartServices');

module.exports = (req, res, next) => {
  res.locals.cartCount = cartServices.cartCount(req);
  next();
};
