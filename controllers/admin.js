const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editMode: false,
    // isAuthenticated: res.isLoggedIn
  });
};


exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  // Because product belongs to user Sequelize will automatically create a
  // create a 'magic' method by prefixing the Product with create =>
  // createProduct()
  req.user.createProduct({
    title, imageUrl, price, description
  }).then(result => {
    res.redirect('/');
    // console.log(result);
  }).catch(error => console.error(error));
};

exports.getEditProduct = async (req, res, next) => {
  // Optional query params
  const editMode = req.query.edit;
  const prodId = req.params.productId;
  // const product = await Product.findByPk(prodId);
  const products = await req.user.getProducts({ where: { id: prodId } });
  const product = products[0];

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
exports.postEditProduct = async (req, res, next) => {
  try {
    const {
      productId,
      title,
      imageUrl,
      price,
      description
    } = req.body;

    const product = await Product.findByPk(productId);
    console.log("title", product.title);


    product.title = title;
    product.imageUrl = imageUrl;
    product.price = price;
    product.description = description;
    try {
      console.log("Product saved!");
      product.save();
    } catch (error) {
      console.error("Couldn't update the product", error);
    }
    // await Product.update(product, { where: { id: productId } });
    res.redirect('/admin/products');
  } catch (error) {
    console.error(error);
  }

};

exports.getProducts = async (req, res, next) => {
  try {

    res.render('admin/products', {
      prods: await req.user.getProducts(),
      pageTitle: 'Admin Products',
      path: '/admin/products',
      // isAuthenticated: res.isLoggedIn
    });
  } catch (error) {
    console.error(error);
  }
};

exports.postDeleteProduct = async (req, res, next) => {
  try {
    const prodId = req.body.productId;
    await Product.destroy({ where: { id: prodId } });
    res.redirect('/admin/products');

  } catch (error) {
    console.error(error);
  }
};
