const db = require('../util/database');

module.exports = class Product {
   constructor(title, imageUrl, description, price) {
      this.title = title;
      this.imageUrl = imageUrl;
      this.description = description;
      this.price = price;
   }

   static async findAll() {
      try {
         const [result, _] = await db.query('SELECT * FROM products');
         return result;
      } catch (error) {
         console.error('Product findAll: ', error);
      }
   }

   static async findById(id) {
      try {
         const [result, _] = await db.query('SELECT * FROM products WHERE id = ?;', [id]);
         return result[0];
      } catch (error) {
         console.error('Product findProductById: ', error);
      }
   }

   async create() {
      try {
         const createProduct = await db.query("INSERT INTO products (title, imageUrl, description, price) VALUES (?, ?, ?, ?);", [this.title, this.imageUrl, this.description, this.price]);
         return createProduct;
      } catch (error) {
         console.error('Product createProduct error: ', error);

      }
   }
}
