const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const multer = require('multer');

// Konfigurasi multer untuk menangani file upload
const upload = multer();

/**
 * @swagger
 * tags:
 *   name: Images
 *   description: Operations about image upload and management
 */

/**
 * @route POST /api/v1/image/upload
 * @group Images - Operations about image upload
 * @param {file} image.formData.required - Image file to be uploaded
 * @param {string} image.body.title.required - Title of the image
 * @param {string} image.body.description.required - Description of the image
 * @param {integer} image.body.userId.required - User ID associated with the image
 * @returns {object} 201 - Image uploaded successfully with image details
 * @returns {Error} 400 - Invalid file or missing parameters
 * @returns {Error} 500 - Unexpected error
 * @example { 
 *   "title": "My Profile Picture", 
 *   "description": "A profile picture uploaded to the system",
 *   "userId": 1,
 *   "image": "file data"
 * }
 */
router.post('/upload', upload.single('image'), imageController.uploadImage);

/**
 * @route GET /api/v1/image
 * @group Images - Operations about image management
 * @returns {object} 200 - List of all uploaded images
 * @returns {Error} 500 - Unexpected error
 * @example { 
 *   "images": [
 *     {
 *       "id": 1,
 *       "title": "My Profile Picture",
 *       "description": "A profile picture uploaded to the system",
 *       "imageUrl": "https://ik.imagekit.io/abc123/myprofile.png",
 *       "userId": 1
 *     }
 *   ]
 * }
 */
router.get('/', imageController.getImages);

/**
 * @route GET /api/v1/image/{imageId}
 * @group Images - Operations about image management
 * @param {integer} imageId.path.required - ID of the image to fetch details for
 * @returns {object} 200 - Image details
 * @returns {Error} 404 - Image not found
 * @returns {Error} 500 - Unexpected error
 * @example { 
 *   "id": 1,
 *   "title": "My Profile Picture",
 *   "description": "A profile picture uploaded to the system",
 *   "imageUrl": "https://ik.imagekit.io/abc123/myprofile.png",
 *   "userId": 1
 * }
 */
router.get('/:imageId', imageController.getImageDetail);

/**
 * @route DELETE /api/v1/image/{imageId}
 * @group Images - Operations about image management
 * @param {integer} imageId.path.required - ID of the image to delete
 * @returns {object} 200 - Image deleted successfully
 * @returns {Error} 404 - Image not found
 * @returns {Error} 500 - Unexpected error
 * @example { 
 *   "message": "Image deleted successfully" 
 * }
 */
router.delete('/:imageId', imageController.deleteImage);

/**
 * @route PUT /api/v1/image/{imageId}
 * @group Images - Operations about image management
 * @param {integer} imageId.path.required - ID of the image to update
 * @param {string} image.body.title.required - New title of the image
 * @param {string} image.body.description.required - New description of the image
 * @returns {object} 200 - Image updated successfully with new data
 * @returns {Error} 400 - Missing parameters or invalid data
 * @returns {Error} 404 - Image not found
 * @returns {Error} 500 - Unexpected error
 * @example { 
 *   "title": "Updated Profile Picture",
 *   "description": "An updated profile picture description"
 * }
 */
router.put('/:imageId', imageController.updateImage);

module.exports = router;