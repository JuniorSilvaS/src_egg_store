require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class Product {
  constructor(name, price, quantity) {
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }

  // Save the product to the database
  async save() {
    try {
      const newProduct = await prisma.product.create({
        data: {
          name: this.name,
          price: this.price,
          quantity: this.quantity,
        },
      });
      return newProduct;
    } catch (error) {
      throw new Error('Error saving product: ' + error.message);
    }
  }

  // Get all products
  static async getAll() {
    try {
      const products = await prisma.product.findMany();
      return products;
    } catch (error) {
      throw new Error('Error fetching products: ' + error.message);
    }
  }

  // Find product by ID
  static async findById(productId) {
    try {
      const product = await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    } catch (error) {
      throw new Error('Error finding product: ' + error.message);
    }
  }

  // Update product details by ID
  static async update(productId, newData) {
    try {
      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: newData,
      });
      return updatedProduct;
    } catch (error) {
      throw new Error('Error updating product: ' + error.message);
    }
  }

  // Delete a product by ID
  static async delete(productId) {
    try {
      const deletedProduct = await prisma.product.delete({
        where: { id: productId },
      });
      return deletedProduct;
    } catch (error) {
      throw new Error('Error deleting product: ' + error.message);
    }
  }
}

module.exports = Product;