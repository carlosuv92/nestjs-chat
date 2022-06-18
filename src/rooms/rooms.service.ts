import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/schema/user.schema';
import { RoomDto } from './dto/room.dto';
import { Room } from './schema/room.schema';

@Injectable()
export class RoomService {
  constructor(@InjectModel('Room') private readonly roomModel: Model<Room>, @InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async create(roomDto: RoomDto) {
    const room = new this.roomModel(roomDto);
    return room.save();
  }

  async findAll() {
    return this.roomModel.find().populate('participants', '_id name');
  }

  async findContacts(userId: string) {
    const contacsRoom = await this.roomModel.find({ participants: { $in: [userId] } });
    const users = await this.userModel.find().exec();
    // const;
  }
}
