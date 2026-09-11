const productServices = require('../services/productServices');
const cartServices = require('../services/cartServices');

const productsController = {
  index: (req, res) => {
    productServices.getAllProducts().then((products) => {
      res.render('products-list', { products });
    });
  },
  detail: async (req, res) => {
    const id = req.params.id;
    await productServices
      .getProductDetail(id)
      .then((product) => {
        res.render('product-detail', { product });
      })
      .catch(function (e) {
        res.status(404).redirect('/products');
      });
  },
  createForm: (req, res) => {
    const errors = req.session.errors;
    const oldData = req.session.oldData;

    req.session.oldData = null;
    req.session.oldData = null;

    res.render('product-create-form', {
      errors: errors ? errors : null,
      oldData: oldData ? oldData : null,
    });
  },
  store: async (req, res) => {
    await productServices.createProduct(req.body, req.file).then(() => {
      res.redirect('/products/dashboard');
    });
  },
  updateForm: async (req, res) => {
    const id = req.params.id;
    const product = await productServices.getProduct(id);
    res.render('product-update-form', { product });
  },
  update: async (req, res) => {
    const id = req.params.id;
    await productServices.updateProduct(id, req.body, req.file);
    res.redirect('/products/dashboard');
  },
  deleteForm: (req, res) => {
    const id = req.params.id;
    productServices.getProduct(id).then((product) => {
      res.render('product-delete-form', { product });
    });
  },
  destroy: (req, res) => {
    const id = req.params.id;
    productServices.deleteProduct(id).then(() => {
      res.redirect('/products/dashboard');
    });
  },
  dashboard: async (req, res) => {
    const allowedLimits = [5, 10, 15];
    const limit = allowedLimits.includes(Number(req.query.limit))
      ? Number(req.query.limit)
      : 5;
    const requestedPage = Math.max(1, Number(req.query.page) || 1);
    const offset = (requestedPage - 1) * limit;
    const { count, rows: products } =
      await productServices.getAllProductsAndCount({
        pageSize: limit,
        offset,
      });
    const totalPages = Math.max(1, Math.ceil(count / limit));

    if (count > 0 && requestedPage > totalPages) {
      return res.redirect(
        `/products/dashboard?page=${totalPages}&limit=${limit}`
      );
    }

    const from = count === 0 ? 0 : offset + 1;
    const to = Math.min(offset + products.length, count);

    res.render('product-dashboard', {
      products,
      pagination: {
        page: requestedPage,
        limit,
        count,
        totalPages,
        from,
        to,
        hasPrev: requestedPage > 1,
        hasNext: requestedPage < totalPages,
      },
    });
  },
  productCart: async (req, res) => {
    const cart = await cartServices.getCartView(req);
    const orderPlaced = Boolean(req.session.orderPlaced);
    req.session.orderPlaced = null;

    res.render('product-cart', {
      cart,
      orderPlaced,
    });
  },
  addToCart: (req, res) => {
    cartServices.addItem(req, req.body.id, req.body.quantity);
    res.redirect(req.get('Referer') || '/products');
  },
  updateCartItem: (req, res) => {
    cartServices.setQuantity(req, req.body.id, req.body.quantity);
    res.redirect('/products/cart');
  },
  removeCartItem: (req, res) => {
    cartServices.removeItem(req, req.body.id);
    res.redirect('/products/cart');
  },
  checkoutCart: (req, res) => {
    cartServices.clearCart(req);
    req.session.orderPlaced = true;
    res.redirect('/products/cart');
  },
  search: async (req, res) => {
    const query = req.query.search;
    const foundProducts = await productServices.searchProducts(query);
    if (foundProducts) {
      res.render('products-list', { products: foundProducts });
    }
  },
};

module.exports = productsController;
