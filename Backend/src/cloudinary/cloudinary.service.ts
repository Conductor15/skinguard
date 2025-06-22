import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
    async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {
            const upload = cloudinary.uploader.upload_stream({ folder: 'SkinGuard' }, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
            Readable.from(file.buffer).pipe(upload);
        });
    }
}