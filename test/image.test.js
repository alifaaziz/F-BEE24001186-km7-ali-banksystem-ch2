// imageController.test.js
const { uploadImage, getImages, getImageDetail, deleteImage, updateImage } = require('../src/controllers/imageController');
const imageKit = require('../src/config/imageKitConfig');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const httpMocks = require('node-mocks-http');


// Mock ImageKit and Prisma functions
jest.mock('../src/config/imageKitConfig', () => ({
  upload: jest.fn(),
}));

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    image: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});

describe('uploadImage', () => {
    it('should upload an image and save it in the database', async () => {
      const req = {
        body: { title: 'Test Title', description: 'Test Description', userId: '1' },
        files: [{ buffer: Buffer.from('test'), originalname: 'test.jpg' }]
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      imageKit.upload.mockResolvedValue({ url: 'https://imagekit.io/test.jpg' });
      prisma.image.create.mockResolvedValue({
        id: 1,
        title: 'Test Title',
        description: 'Test Description',
        imageUrl: 'https://imagekit.io/test.jpg',
        userId: 1,
      });
  
      await uploadImage(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Image uploaded successfully',
        image: expect.objectContaining({
          title: 'Test Title',
          description: 'Test Description',
          imageUrl: 'https://imagekit.io/test.jpg',
        }),
      });
    });
  
    it('should return 400 if no image is uploaded', async () => {
      const req = { body: { title: 'Test Title', description: 'Test Description', userId: '1' }, files: [] };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      await uploadImage(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'No image uploaded' });
    });

    it('should return 500 if an unexpected error occurs', async () => {
      const req = {
        body: { title: 'Test Title', description: 'Test Description', userId: '1' },
        files: [{ buffer: Buffer.from('test'), originalname: 'test.jpg' }]
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      // Simulate an error in the imageKit upload
      imageKit.upload.mockRejectedValue(new Error('Image upload failed'));
  
      await uploadImage(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error uploading image to ImageKit' });
    });
  });
describe('getImages', () => {
    it('should return a list of images', async () => {
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      prisma.image.findMany.mockResolvedValue([
        { id: 1, title: 'Test Title', description: 'Test Description', imageUrl: 'https://imagekit.io/test.jpg', userId: 1 },
      ]);
  
      await getImages(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        images: expect.arrayContaining([
          expect.objectContaining({
            title: 'Test Title',
            description: 'Test Description',
            imageUrl: 'https://imagekit.io/test.jpg',
          }),
        ]),
      });
    });

    it('should return 500 if an unexpected error occurs', async () => {
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      // Simulate an error in Prisma findMany
      prisma.image.findMany.mockRejectedValue(new Error('Database error'));
  
      await getImages(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching images' });
    });   
  });

  describe('getImageDetail', () => {
    it('should return image details for a valid imageId', async () => {
      const req = { params: { imageId: '1' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      prisma.image.findUnique.mockResolvedValue({
        id: 1,
        title: 'Test Title',
        description: 'Test Description',
        imageUrl: 'https://imagekit.io/test.jpg',
        userId: 1,
      });
  
      await getImageDetail(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        image: expect.objectContaining({
          title: 'Test Title',
          description: 'Test Description',
          imageUrl: 'https://imagekit.io/test.jpg',
        }),
      });
    });
  
    it('should return 404 if image is not found', async () => {
      const req = { params: { imageId: '99' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      prisma.image.findUnique.mockResolvedValue(null);
  
      await getImageDetail(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Image not found' });
    });
    it('should return 500 if an unexpected error occurs', async () => {
      const req = { params: { imageId: '1' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      // Simulate an error in Prisma findUnique
      prisma.image.findUnique.mockRejectedValue(new Error('Database error'));
  
      await getImageDetail(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching image details' });
    });   
  });
  describe('deleteImage', () => {
    it('should delete an image if found', async () => {
      const req = { params: { imageId: '1' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      prisma.image.findUnique.mockResolvedValue({ id: 1 });
      prisma.image.delete.mockResolvedValue();
  
      await deleteImage(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Image deleted successfully' });
    });
  
    it('should return 404 if image is not found', async () => {
      const req = { params: { imageId: '99' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      prisma.image.findUnique.mockResolvedValue(null);
  
      await deleteImage(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Image not found' });
    });
    it('should return 500 if an unexpected error occurs', async () => {
      const req = { params: { imageId: '1' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      // Simulate an error in Prisma findUnique or delete
      prisma.image.findUnique.mockResolvedValue({ id: 1 });
      prisma.image.delete.mockRejectedValue(new Error('Database error'));
  
      await deleteImage(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error deleting image' });
    });   
  });
  describe('updateImage', () => {

    it('should return 400 if title or description is missing', async () => {
      const req = httpMocks.createRequest({
        method: 'PUT',
        url: '/api/v1/image/:imageId',
        params: { imageId: '1' },
        body: { description: 'Updated description without title' }, // Tanpa title
      });

      const res = httpMocks.createResponse();

      await updateImage(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ message: "Title and description are required" });
    });


    it('should update image title and description if valid data is provided', async () => {
      const req = { params: { imageId: '1' }, body: { title: 'Updated Title', description: 'Updated Description' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      prisma.image.findUnique.mockResolvedValue({ id: 1 });
      prisma.image.update.mockResolvedValue({
        id: 1,
        title: 'Updated Title',
        description: 'Updated Description',
        imageUrl: 'https://imagekit.io/test.jpg',
        userId: 1,
      });
  
      await updateImage(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Image updated successfully',
        updatedImage: expect.objectContaining({
          title: 'Updated Title',
          description: 'Updated Description',
        }),
      });
    });
  
    it('should return 404 if image is not found', async () => {
      const req = { params: { imageId: '99' }, body: { title: 'Updated Title', description: 'Updated Description' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      prisma.image.findUnique.mockResolvedValue(null);
  
      await updateImage(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Image not found' });
    });
    it('should return 500 if an unexpected error occurs', async () => {
      const req = { params: { imageId: '1' }, body: { title: 'Updated Title', description: 'Updated Description' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      // Simulate an error in Prisma findUnique or update
      prisma.image.findUnique.mockResolvedValue({ id: 1 });
      prisma.image.update.mockRejectedValue(new Error('Database error'));
  
      await updateImage(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error updating image' });
    });   
  });      