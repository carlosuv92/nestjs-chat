import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { User, UserDocument } from 'src/users/schema/user.schema';
import { MessageDto } from './dto/new-message.dto';
import { Message, MessageDocument } from './schema/message.schema';

@Injectable()
export class MessageService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, @InjectModel(Message.name) private messageModel: Model<MessageDocument>) {}
  async newMessage(messageDto: MessageDto) {
    const message = this.messageModel.create(messageDto);
    return message;
  }

  async getAllMessages(id: Number) {
    //get messages from room with user populate with sender_id
    const messages = await this.messageModel.find({ room_id: id }).populate('sender_id', '_id name').exec();
    return messages;
  }
}
