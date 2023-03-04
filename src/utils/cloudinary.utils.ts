import { v2 as cloudinary } from 'cloudinary';
import { Express } from 'express';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (file: Express.Multer.File) => {
  try {
    const { path } = file;
    const { secure_url } = await cloudinary.uploader.upload(path, {
      folder: 'shopit',
    });
    return secure_url;
  } catch (error) {
    throw new Error(error?.message);
  }
};
