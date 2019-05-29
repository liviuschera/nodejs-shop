const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editMode: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null, title, imageUrl, description, price);
  product.save();
  res.redirect('/');
};

exports.getEditProduct = async (req, res, next) => {
  // Optional query params
  const editMode = req.query.edit;
  const prodId = req.params.productId;
  const product = await Product.findById(prodId);
  if (!editMode || !product) {
    return res.redirect('/');
  }

  res.render('admin/edit-product', {
    pageTitle: 'Edit Product',
    path: '/admin/edit-product',
    editMode: editMode,
    product
  });
};
exports.postEditProduct = (req, res, next) => {
  const {
    productId,
    title,
    imageUrl,
    price,
    description
  } = req.body;

  const PRODUCT = new Product(productId, title, imageUrl, description, price);

  PRODUCT.save();
  res.redirect('/admin/products');


};

exports.getProducts = async (req, res, next) => {
  res.render('admin/products', {
    prods: await Product.fetchAll(),
    pageTitle: 'Admin Products',
    path: '/admin/products'
  });
};

exports.postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  await Product.deleteById(prodId);
  res.redirect('/admin/products');
};
