import { Module } from '@nestjs/common';
import { RoomService } from './rooms.service';
import { RoomController } from './rooms.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schema/user.schema';
import { Room, RoomSchema } from './schema/room.schema';
import { Message, MessageSchema } from 'src/messages/schema/message.schema';

@Module({
  controllers: [RoomController],
  providers: [RoomService],
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Room.name,
        schema: RoomSchema,
      },
      {
        name: Message.name,
        schema: MessageSchema,
      },
    ]),
  ],
})
export class RoomModule {}
