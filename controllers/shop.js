const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = async (req, res, next) => {
  const [rows, fieldData] = await Product.fetchAll();
  res.render('shop/product-list', {
    prods: rows,
    pageTitle: 'All Products',
    path: '/products'
  });
};

exports.getProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  const product = await Product.findById(prodId)

  res.render('shop/product-detail',
    {
      product,
      pageTitle: product.title,
      path: '/products'
    })
  // res.redirect("/")
};

exports.getIndex = async (req, res, next) => {
  const [rows, fieldData] = await Product.fetchAll();

  res.render('shop/index', {
    prods: rows,
    pageTitle: 'Shop',
    path: '/'
  });
};

exports.getCart = async (req, res, next) => {
  const products = await Product.fetchAll();
  const cart = await Cart.getProductsFormCart();
  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your Cart',
    productsDetails: await Cart.getCart(products),
    cardHasItems: cart.products.length
  });
};

exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;
  const prodPrice = req.body.productPrice;
  await Cart.addProduct(prodId, prodPrice);
  res.redirect('/cart');
};

exports.postCartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  const prodPrice = req.body.productPrice;

  await Cart.deleteProduct(prodId, prodPrice);
  res.redirect('/cart');
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
