import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FileSchema, File } from './schema/files.schema';
import { S3Service } from './helpers/s3.helper';

@Module({
  controllers: [FilesController],
  providers: [FilesService, S3Service],
  exports: [FilesService],
  imports: [
    MongooseModule.forFeature([
      {
        name: File.name,
        schema: FileSchema,
      },
    ]),
  ],
})
export class FilesModule {}
