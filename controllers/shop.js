const Product = require('../models/product');

exports.getProducts = async (req, res, next) => {
  res.render('shop/product-list', {
    prods: await Product.fetchAll(),
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
  res.render('shop/index', {
    prods: await Product.fetchAll(),
    pageTitle: 'Shop',
    path: '/'
  });
};

exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your Cart'
  });
};

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
