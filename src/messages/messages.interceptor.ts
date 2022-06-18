import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Observable, of } from 'rxjs';
import { Room, RoomDocument } from 'src/rooms/schema/room.schema';
import { User, UserDocument } from 'src/users/schema/user.schema';

@Injectable()
export class SendMessageInterceptor implements NestInterceptor {
  constructor(@InjectModel(Room.name) private roomModel: Model<RoomDocument>, @InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const files = req.files;

    let message_data = req.body;

    let { room_id, receiver_id, type, message } = message_data;

    if (type === 'text' && !message && files.length === 0) throw new BadRequestException('Message is required');
    if (!(await this.isUserExists(receiver_id))) throw new BadRequestException('User not found');
    if (room_id) {
      const validObjectId = Types.ObjectId.isValid(room_id);
      if (!validObjectId) throw new BadRequestException('Invalid room id');
      if (!(await this.isRoomExists(room_id))) throw new BadRequestException('Room not found');
    } else {
      let newRoom = await this.roomModel.create({ participants: [message_data.sender_id, message_data.receiver_id] });
      message_data.room_id = newRoom.id;
    }
    req.body = message_data;

    return next.handle();
  }

  private isUserExists(id: Types.ObjectId) {
    return this.userModel.findOne({ _id: id }).exec();
  }

  private isRoomExists(id: Types.ObjectId) {
    return this.roomModel.findOne({ _id: id }).exec();
  }
}
