import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { String } from 'aws-sdk/clients/apigateway';
import { Model, Types } from 'mongoose';
import { isImage } from './helpers/files.helper';
import { S3Service } from './helpers/s3.helper';
import { File, FileDocument } from './schema/files.schema';

@Injectable()
export class FilesService {
  constructor(@InjectModel(File.name) private fileModel: Model<FileDocument>, private readonly s3Service: S3Service) {}
  saveMessageFiles(files: Array<Express.Multer.File>, message_id: Types.ObjectId) {
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

  saveAvatar(file: Express.Multer.File, user_id: String) {
    console.log(file);

    const path = `avatars/${user_id}/${file.filename}`;

    this.s3Service.uploadFile(file, path);

    const avatar = {
      user_id,
      name: file.originalname,
      type: isImage(file) ? 'image' : 'file',
      extension: file.originalname.split('.')[1] || '',
      size: file.size,
      path: path,
    };

    return path;
  }
}
