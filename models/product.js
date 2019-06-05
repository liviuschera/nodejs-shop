const db = require('../util/database');
// const fs = require('fs');
// const path = require('path');
// const { promisify } = require('util');
const Cart = require('./cart');
// const readFileAsync = promisify(fs.readFile);
// const writeFileAsync = promisify(fs.writeFile);

// const p = path.resolve('data/products.json');

// async function getProductsFromFile(id = null) {
//   try {
//     const products = JSON.parse(await readFileAsync(p));
//     if (id) {
//       return products.find(product => product.id === id);
//     }
//     return products;
//   } catch (err) {
//     return [];
//   }
// }

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  static async fetchAll() {
    return db.execute('SELECT * FROM products');
  }

  static async findById(id) {
    return db.execute('SELECT * FROM products WHERE id = ?', [id])
  }

  static async deleteById(id) {
    try {
      const products = await Product.fetchAll();
      const updatedProducts = products.filter(prod => prod.id !== id);
      const productPrice = products.find(prod => prod.id === id).price;

      Cart.deleteProduct(id, productPrice);

      writeFileAsync(p, JSON.stringify(updatedProducts));
    } catch (err) {
      console.log("Delete file error: ", err);

    }
  }

  async save() {
    db.execute('INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?);', [this.title, this.price, this.description, this.imageUrl]);
  }


};
