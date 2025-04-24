const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class Purchase {
  constructor({ userId, productId, quantity, addressId }) {
    this.userId = userId;
    this.productId = productId;
    this.quantity = quantity;
    this.addressId = addressId;
  }

  // Create a new purchase
  async save() {
    if (!this.userId || !this.productId || !this.quantity || !this.addressId) {
      throw new Error('Missing required fields for purchase');
    }

    try {
      const purchase = await prisma.purchase.create({
        data: {
          userId: this.userId,
          productId: this.productId,
          quantity: this.quantity,
          addressId: this.addressId,
        },
      });
      return purchase;
    } catch (error) {
      throw new Error('Failed to create purchase: ' + error.message);
    }
  }

  // Fetch a single purchase with all related data
  static async getById(purchaseId) {
    try {
      const purchase = await prisma.purchase.findUnique({
        where: { id: purchaseId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          product: true,
          address: true
        }
      });

      if (!purchase) {
        throw new Error('Purchase not found');
      }

      return purchase;
    } catch (error) {
      throw new Error('Failed to fetch purchase: ' + error.message);
    }
  }

  // Get all purchases by a user
  static async getByUserId(userId) {
    try {
      const purchases = await prisma.purchase.findMany({
        where: { userId },
        include: {
          product: true,
          address: true,
          user: {
            select: { id: true, name: true, email: true }
          }
        }
      });

      return purchases;
    } catch (error) {
      throw new Error('Failed to fetch user purchases: ' + error.message);
    }
  }

  // Get all purchases
  static async getAll() {
    try {
      const purchases = await prisma.purchase.findMany({
        include: {
          user: true,
          product: true,
          address: true
        }
      });

      return purchases;
    } catch (error) {
      throw new Error('Failed to fetch all purchases: ' + error.message);
    }
  }

  // Delete a purchase by ID
  static async delete(purchaseId) {
    try {
      const deleted = await prisma.purchase.delete({
        where: { id: purchaseId },
      });

      return deleted;
    } catch (error) {
      throw new Error('Failed to delete purchase: ' + error.message);
    }
  }
}

module.exports = Purchase;
