const imageKit = require('../config/imageKitConfig');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fungsi untuk upload image ke ImageKit
const uploadImage = async (req, res) => {
  try {
    const { title, description, userId } = req.body;

    // Memastikan ada file yang diupload
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const file = req.files[0];

    // Upload ke ImageKit
    const result = await imageKit.upload({
      file: file.buffer.toString('base64'), // Menggunakan buffer file yang sudah diubah ke base64
      fileName: file.originalname
    });

    // Simpan data image ke database
    const newImage = await prisma.image.create({
      data: {
        title,
        description,
        imageUrl: result.url,
        userId: parseInt(userId) // Pastikan userId dikirimkan sebagai integer
      }
    });

    res.status(200).json({ message: "Image uploaded successfully", image: newImage });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading image to ImageKit" });
  }
};

// 2. Melihat Daftar Gambar
const getImages = async (req, res) => {
  try {
    const images = await prisma.image.findMany({
      include: {
        user: true, // Menyertakan data user yang mengupload gambar
      },
    });

    res.status(200).json({ images });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching images" });
  }
};

// 3. Melihat Detail Gambar
const getImageDetail = async (req, res) => {
  try {
    const { imageId } = req.params;

    const image = await prisma.image.findUnique({
      where: { id: parseInt(imageId) },
      include: {
        user: true, // Menyertakan data user yang mengupload gambar
      },
    });

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.status(200).json({ image });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching image details" });
  }
};

// 4. Menghapus Gambar
const deleteImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    const image = await prisma.image.findUnique({
      where: { id: parseInt(imageId) },
    });

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    await prisma.image.delete({
      where: { id: parseInt(imageId) },
    });

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting image" });
  }
};

// 5. Mengedit Judul dan Deskripsi Gambar
const updateImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const image = await prisma.image.findUnique({
      where: { id: parseInt(imageId) },
    });

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    const updatedImage = await prisma.image.update({
      where: { id: parseInt(imageId) },
      data: { title, description },
    });

    res.status(200).json({ message: "Image updated successfully", updatedImage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating image" });
  }
};

module.exports = {
  uploadImage,
  getImages,
  getImageDetail,
  deleteImage,
  updateImage,
};