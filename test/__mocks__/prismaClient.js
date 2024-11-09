const { uploadImage } = require("../../src/controllers/imageController");

// test/__mocks__/prismaClient.js
const mockUser = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashedpassword',
    profile: {
        identityType: 'ID Card',
        identityNumber: '123456789',
        address: '123 Main St',
    },
};

const prisma = {
    user: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        upload: jest.fn(),
    },
};

module.exports = { PrismaClient: jest.fn(() => prisma), mockUser };