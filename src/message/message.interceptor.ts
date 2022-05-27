import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Observable, of } from 'rxjs';
import { Room, RoomDocument } from 'src/room/schema/room.schema';
import { User, UserDocument } from 'src/users/schema/user.schema';

@Injectable()
export class SendMessageInterceptor implements NestInterceptor {
  constructor(@InjectModel(Room.name) private roomModel: Model<RoomDocument>, @InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    let message = req.body;

    let { room_id, receiver_id } = message;

    if (!(await this.isUserExists(receiver_id))) throw new BadRequestException('User not found');
    if (room_id) {
      const validObjectId = Types.ObjectId.isValid(room_id);
      if (!validObjectId) throw new BadRequestException('Invalid room id');
      if (!(await this.isRoomExists(room_id))) throw new BadRequestException('Room not found');
    } else {
      let newRoom = await this.roomModel.create({ participants: [message.sender_id, message.receiver_id] });
      message.room_id = newRoom.id;
    }
    req.body = message;

    return next.handle();
  }

  private isUserExists(id: Types.ObjectId) {
    return this.userModel.findOne({ _id: id }).exec();
  }

  private isRoomExists(id: Types.ObjectId) {
    return this.roomModel.findOne({ _id: id }).exec();
  }
}
