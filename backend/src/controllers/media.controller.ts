import { NextFunction, Request, Response } from 'express';

import logger from '../logger.util';
import { MediaService } from '../media.service';
import { UploadImageRequest, UploadImageResponse } from '../types/media.types';
import { sanitizeInput } from '../sanitizeInput.util';

export class MediaController {
  async uploadImage(
    req: Request<unknown, unknown, UploadImageRequest>,
    res: Response<UploadImageResponse>,
    next: NextFunction
  ) {
    try {
      logger.error(JSON.stringify(req.body));
      if (!req.file) {
        logger.error('No file sent');
        return res.status(400).json({
          message: 'No file uploaded',
        });
      }

      const user = req.user!;
      const sanitizedFilePath = sanitizeInput(req.file.path);
      const image = await MediaService.saveImage(
        sanitizedFilePath,
        user._id.toString()
      );

      res.status(200).json({
        message: 'Image uploaded successfully',
        data: {
          image,
        },
      });
      logger.error('File succesfully saved');
    } catch (error) {
      logger.error('Error uploading profile picture:', error);

      if (error instanceof Error) {
        return res.status(500).json({
          message: error.message || 'Failed to upload profile picture',
        });
      }

      next(error);
    }
  }
}
