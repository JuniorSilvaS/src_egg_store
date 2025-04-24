require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

class User {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    // Method to get user data from token in cookies
    static async getUserData(req) {
        const token = req.cookies.token;
        
        if (!token) throw new Error('No token found in cookies');

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, name: true, email: true }
        });

        if (!user) throw new Error('User not found');

        return user;
    }

    // Login a user and return a token
    static async login(email, password) {
        if (!email || !password) throw new Error('Email and password are required');

        const foundUser = await prisma.user.findUnique({
            where: { email }
        });

        if (!foundUser) throw new Error('User not found');

        const isMatch = await bcrypt.compare(password, foundUser.password);
        if (!isMatch) throw new Error('Invalid credentials');

        const token = jwt.sign(
            { id: foundUser.id },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' }
        );

        return {
            token,
            message: 'Login successful',
        };
    }

    // Edit user data (name, email, and password)
    async editUser(id, name = null, email = null, password = null) {
        this.name = name || this.name;
        this.email = email || this.email;
        this.password = password || this.password;

        const updatedData = {
            name: this.name,
            email: this.email
        };

        if (password) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            updatedData.password = hashedPassword;
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updatedData
        });

        return updatedUser;
    }

    // Delete a user and clear their token
    static async deleteUser(req, res) {
        const token = req.cookies.token;
        if (!token) throw new Error('No token found in cookies');

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

        const user = await prisma.user.findUnique({
            where: { id: decoded.id }
        });

        if (!user) throw new Error('User not found');

        await prisma.user.delete({
            where: { id: decoded.id }
        });

        res.clearCookie('token');

        return { message: 'User deleted successfully' };
    }

    // Create and save a new user to the database
    async save() {
        if (!this.name) throw new Error('The name is required');
        if (!this.email) throw new Error('The email is required');
        if (!this.password) throw new Error('The password is required');

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(this.password, saltRounds);
        try {
            await prisma.user.create({
                data: {
                    name: this.name,
                    email: this.email,
                    password: hashedPassword
                }
            });

            return { message: "User created successfully" }
        } catch (err) {
            if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
                throw new Error('Email already in use');
            };
        };
    }

    // Change the user's password
    static async changePassword(userId, oldPassword, newPassword) {
        if (!oldPassword || !newPassword) throw new Error('Both old and new passwords are required');

        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) throw new Error('User not found');

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) throw new Error('Old password is incorrect');

        const saltRounds = 10;
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword }
        });

        return { message: 'Password changed successfully' };
    }

    // Get user by email (could be useful for admins or forgotten password)
    static async getUserByEmail(email) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new Error('User not found');
        return user;
    }

    // Get all users (Admin functionality)
    static async getAllUsers() {
        const users = await prisma.user.findMany();
        return users;
    }

    // Log out the user by clearing the token
    static logout(res) {
        res.clearCookie('token');
        return { message: 'Logged out successfully' };
    }
}

module.exports = User;
