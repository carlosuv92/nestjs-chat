import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { S3Service } from 'src/files/helpers/s3.helper';
import { File, FileSchema } from 'src/files/schema/file.schema';
import { FilesService } from 'src/files/files.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [UsersController],
  providers: [UsersService, FilesService, S3Service],
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: File.name,
        schema: FileSchema,
      },
    ]),
    HttpModule,
  ],
})
export class UsersModule {}
