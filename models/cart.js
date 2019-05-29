const fs = require('fs');
const path = require('path');
const util = require('util');
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
const cartPath = path.join(path.resolve('data/cart.json'));

async function getProductsFormCart() {
   let cart;
   try {
      // Fetch the previous cart
      cart = JSON.parse(await readFileAsync(cartPath));
      return cart;
   } catch (err) {
      cart = { products: [], totalPrice: 0 };
      return cart;
   }
}

function writeCartToFile(cart) {
   try {
      // Write cart to the file
      writeFileAsync(cartPath, JSON.stringify(cart))
   } catch (err) {
      console.log(err);

   }
}

module.exports = class Cart {

   static async addProduct(id, productPrice) {
      // let cart;
      // try {
      //    // Fetch the previous cart
      //    cart = JSON.parse(await readFileAsync(cartPath));
      // } catch (err) {
      //    cart = { products: [], totalPrice: 0 };
      // }

      let cart = await getProductsFormCart();

      const FIND_PRODUCT_INDEX = cart.products.findIndex(prod => prod.id === id);

      if (FIND_PRODUCT_INDEX === -1) {
         // Add product to the cart if it doesn't contain it
         cart.products.push({ "id": id, "qty": 1 });
         // Add product's price to cart's total

         cart.totalPrice = cart.totalPrice + +productPrice
      } else {
         // The product Id was found in 'products' -> increase 'qty'
         cart.products[FIND_PRODUCT_INDEX].qty++;
         // And add the price to cart's total
         cart.totalPrice = cart.totalPrice + +productPrice
      }

      // try {
      //    // Write cart to the file
      //    writeFileAsync(cartPath, JSON.stringify(cart))
      // } catch (err) {
      //    console.log(err);
      // }
   }

   static async deleteProduct(id, productPrice) {
      try {

         const cart = await getProductsFormCart();
         const clonedCart = { ...cart };

         const productToDelete = clonedCart.products.find(prod => prod.id === id);
         if (!productToDelete) return;
         const productQty = productToDelete.qty;
         const totalPrice = clonedCart.totalPrice = clonedCart.totalPrice - +(productPrice * productQty);
         const products = clonedCart.products.filter(prod => prod.id !== id);

         writeCartToFile({ products, totalPrice });
      } catch (err) {
         console.error("Failed to delete: ", err);

      }
   }
}
