import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from 'src/messages/schema/message.schema';
import { User, UserDocument } from 'src/users/schema/user.schema';
import { RoomDto } from './dto/room.dto';
import { Room } from './schema/room.schema';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel('Room') private readonly roomModel: Model<Room>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}
  async create(roomDto: RoomDto) {
    const room = new this.roomModel(roomDto);
    return room.save();
  }

  async findAll() {
    return this.roomModel.find().populate('participants', '_id name');
  }

  async findContacts(userId: string) {
    const contactsRoom = await this.roomModel.find({ participants: { $in: [userId] } });
    //users in the same room
    const userRooms = await this.roomModel.find({ participants: { $in: [userId] }, type: 'user' });
    const userRoomsIds = userRooms.map(room => room.participants.filter(participant => participant.toString() !== userId));
    //get last message in each room
    const lastMessages = await this.messageModel
      .find({ room: { $in: userRoomsIds } })
      .sort({ createdAt: -1 })
      .limit(1);

    const users = await this.userModel.find({ _id: { $nin: userRoomsIds, $ne: userId } });

    return { lastMessages, users };
    //merge contactsRoom and users
  }
}
