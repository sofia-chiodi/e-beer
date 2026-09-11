const productServices = require('./productServices');

function formatPrice(value) {
  return `$${Number(value).toLocaleString('es-AR')}`;
}

function getCart(req) {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  return req.session.cart;
}

function cartCount(req) {
  return getCart(req).reduce((sum, item) => sum + Number(item.quantity || 0), 0);
}

function addItem(req, productId, quantity = 1) {
  const cart = getCart(req);
  const qty = Math.max(1, parseInt(quantity, 10) || 1);
  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({ id: productId, quantity: qty });
  }

  req.session.cart = cart;
}

function setQuantity(req, productId, quantity) {
  const qty = parseInt(quantity, 10) || 0;

  if (qty <= 0) {
    removeItem(req, productId);
    return;
  }

  const cart = getCart(req);
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity = qty;
  }
}

function removeItem(req, productId) {
  req.session.cart = getCart(req).filter((item) => item.id !== productId);
}

function clearCart(req) {
  req.session.cart = [];
}

async function getCartView(req) {
  const cart = getCart(req);
  const items = [];

  for (const line of cart) {
    const product = await productServices.getProduct(line.id);
    if (!product) {
      continue;
    }

    const price = Number(product.price);
    const quantity = Number(line.quantity);
    const lineTotal = price * quantity;

    items.push({
      id: product.id,
      name: product.name,
      image: product.image || 'default-image.png',
      quantity,
      price,
      lineTotal,
      priceLabel: formatPrice(price),
      lineTotalLabel: formatPrice(lineTotal),
    });
  }

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const shipping = items.length ? 1500 : 0;

  return {
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal,
    shipping,
    total: subtotal + shipping,
    subtotalLabel: formatPrice(subtotal),
    shippingLabel: formatPrice(shipping),
    totalLabel: formatPrice(subtotal + shipping),
  };
}

module.exports = {
  getCart,
  cartCount,
  addItem,
  setQuantity,
  removeItem,
  clearCart,
  getCartView,
};
