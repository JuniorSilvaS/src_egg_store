require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class Address {
    constructor(addressLine, city, state, postalCode, country, userId) {
        this.addressLine = addressLine;
        this.city = city;
        this.state = state;
        this.postalCode = postalCode;
        this.country = country;
        this.userId = userId;
      };
    
      // Save address to the database
      async save() {
        if (!this.addressLine || !this.city || !this.state || !this.postalCode || !this.country || !this.userId) {
          throw new Error('All address fields are required');
        }
    
        const newAddress = await prisma.address.create({
          data: {
            addressLine: this.addressLine,
            city: this.city,
            state: this.state,
            postalCode: this.postalCode,
            country: this.country,
            userId: this.userId,
          },
        });
    
        return newAddress;
      };

    // Get all addresses for a user
    static async getUserAddresses(userId) {
        const addresses = await prisma.address.findMany({
            where: { userId },
        });

        return addresses;
    }

    // Get a single address by ID
    static async getAddressById(addressId) {
        const address = await prisma.address.findUnique({
            where: { id: addressId },
        });

        if (!address) throw new Error('Address not found');

        return address;
    }

    // Edit an address for a user
    static async editAddress(addressId, street, city, state, zipCode) {
        const updatedAddress = await prisma.address.update({
            where: { id: addressId },
            data: { street, city, state, zipCode }
        });

        return updatedAddress;
    }

    // Delete an address by ID
    static async deleteAddress(addressId) {
        const deletedAddress = await prisma.address.delete({
            where: { id: addressId },
        });

        return deletedAddress;
    }
}

module.exports = Address;
