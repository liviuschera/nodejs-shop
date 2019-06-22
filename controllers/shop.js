const Product = require('../models/product');

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products',
      // isAuthenticated: res.isLoggedIn
    });
  } catch (error) {
    console.error(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const prodId = req.params.productId;
    const product = await Product.findByPk(prodId);

    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products',
      // isAuthenticated: res.isLoggedIn
    });
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
      path: '/',
      // isAuthenticated: res.isLoggedIn
    });
  } catch (error) {
    console.error(error);
  }

};

exports.getCart = async (req, res, next) => {
  try {

    const cart = await req.user.getCart();
    const products = await cart.getProducts();
    // console.log(products);

    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      productsDetails: products,
      cardHasItems: products.length,
      // isAuthenticated: res.isLoggedIn
    });
  } catch (error) {
    console.error(error);
  }
};

exports.postCart = async (req, res, next) => {
  try {
    const prodId = req.body.productId;
    let product = await Product.findByPk(prodId);
    let cart = await req.user.getCart();
    const cartProducts = await cart.getProducts({
      where: {
        id: prodId
      }
    });
    let newQuantity = 1;
    if (cartProducts.length > 0) {
      product = cartProducts[0];
      const oldQuantity = product.cartItem.quantity;
      newQuantity = oldQuantity + 1;
    }
    cart.addProduct(product, {
      through: {
        quantity: newQuantity
      }
    })

    res.redirect('/cart');
  } catch (error) {
    console.error(error);
  }
};

exports.postCartDeleteProduct = async (req, res, next) => {
  try {
    const prodId = req.body.productId;
    const cart = await req.user.getCart();
    const productToDelete = await cart.getProducts({
      where: {
        id: prodId
      }
    });
    const product = productToDelete[0];
    product.cartItem.destroy();
    res.redirect('/cart');

  } catch (error) {
    console.error(error);
  }
}

exports.postOrder = async (req, res, next) => {
  try {
    const order = await req.user.createOrder();
    const cart = await req.user.getCart();
    const products = await cart.getProducts();

    order.addProducts(products.map(product => {
      product.orderItem = {
        quantity: product.cartItem.quantity
      }
      return product;
    }));
    res.redirect('/orders');
  } catch (error) {
    console.error(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await req.user.getOrders({
      include: ['products']
    });

    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders,
      // isAuthenticated: res.isLoggedIn
    });
  } catch (error) {
    console.error(error);

  }
};

// exports.getCheckout = (req, res, next) => {
//   res.render('shop/checkout', {
//     path: '/checkout',
//     pageTitle: 'Checkout'
//   });
// };
