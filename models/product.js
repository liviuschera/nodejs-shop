const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const p = path.resolve('data/products.json');

async function getProductsFromFile(id = null) {
  try {
    const products = JSON.parse(await readFileAsync(p));
    if (id) {
      return products.find(product => product.id === id);
    }
    return products;
  } catch (err) {
    return [];
  }
}

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  static async fetchAll() {
    return getProductsFromFile();
  }

  static async findById(id) {
    return getProductsFromFile(id);
  }

  async save() {
    try {
      let products;
      if (this.id) {
        const prods = await Product.fetchAll();
        const productIndex = prods.findIndex(prod => prod.id === this.id);

        products = [...prods];
        products[productIndex] = this;

      } else {

        this.id = Math.random().toString();
        products = await getProductsFromFile();
        products.push(this);
      }

      writeFileAsync(p, JSON.stringify(products))
    } catch (err) {
      console.error("Save file error: ", err);

    }
  }


};
