const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  } catch (error) {
    console.error(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const prodId = req.params.productId;
    const product = await Product.findByPk(prodId);

    res.render('shop/product-detail',
      {
        product: product,
        pageTitle: product.title,
        path: '/products'
      })
  } catch (error) {
    console.error("Can't find the product! ", error);
  }
};

exports.getIndex = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  } catch (error) {
    console.error(error);
  }

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
