import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoomDto } from './dto/room.dto';
import { Room } from './schema/room.schema';

@Injectable()
export class RoomService {
  constructor(@InjectModel('Room') private readonly roomModel: Model<Room>) {}
  async create(roomDto: RoomDto) {
    const room = new this.roomModel(roomDto);
    return room.save();
  }
}
