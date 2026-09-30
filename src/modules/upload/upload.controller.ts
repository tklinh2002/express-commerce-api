import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../core/exceptions/AppError';

export class UploadController {
  public uploadImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // req.file is populated by the multer middleware
      if (!req.file) {
        throw new AppError('No file uploaded', 400);
      }

      // Generate the public URL for the uploaded image
      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

      res.status(200).json({
        status: 'success',
        message: 'File uploaded successfully',
        data: {
          url: fileUrl,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
