import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { isImage } from './helpers/files.helper';
import { S3Service } from './helpers/s3.helper';
import { File, FileDocument } from './schema/files.schema';

@Injectable()
export class FilesService {
  constructor(@InjectModel(File.name) private fileModel: Model<FileDocument>, private readonly s3Service: S3Service) {}
  saveFiles(files: Array<Express.Multer.File>, message_id: Types.ObjectId) {
    const objFile = files.map(file => {
      //   Insert files into S3
      const path = `messenger/${message_id}/${file.filename}`;
      this.s3Service.uploadFile(file, path);

      return {
        message_id,
        name: file.originalname,
        type: isImage(file) ? 'image' : 'file',
        extension: file.originalname.split('.')[1] || '',
        size: file.size,
        path: path,
      };
    });
    this.fileModel.insertMany(objFile);
  }
}
