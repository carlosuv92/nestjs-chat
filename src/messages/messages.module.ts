import { Module } from '@nestjs/common';
import { MessageService } from './messages.service';
import { MessageController } from './messages.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { Message, MessageSchema } from './schema/message.schema';
import { User, UserSchema } from 'src/users/schema/user.schema';
import { Room, RoomSchema } from 'src/rooms/schema/room.schema';
import { File, FileSchema } from 'src/files/schema/file.schema';
import { FilesService } from 'src/files/files.service';
import { S3Service } from 'src/files/helpers/s3.helper';

@Module({
  controllers: [MessageController],
  providers: [MessageService, JwtStrategy, FilesService, S3Service],
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Message.name,
        schema: MessageSchema,
      },
      {
        name: Room.name,
        schema: RoomSchema,
      },
      {
        name: File.name,
        schema: FileSchema,
      },
    ]),
  ],
})
export class MessageModule {}
