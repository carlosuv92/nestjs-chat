import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IdMessageDto, MessageDto, ReactionMessageDto, SeenDto, UpdateMessageDto } from './dto/message.dto';
import { Message, MessageDocument } from './schema/message.schema';
import { File, FileDocument } from 'src/files/schema/files.schema';
import { formatMessage } from './helpers/message.helper';

@Injectable()
export class MessageService {
  constructor(@InjectModel(Message.name) private messageModel: Model<MessageDocument>, @InjectModel(File.name) private filesModel: Model<FileDocument>) {}

  /**
   * Method to create a new message
   * @param messageDto
   * @returns
   */
  async newMessage(messageDto: MessageDto) {
    const message = (await this.messageModel.create(messageDto)).populate('room_id');
    return message;
  }

  /**
   * Method to get all messages of a room
   * @param roomId
   * @returns
   */
  async getAllMessages(roomId: Types.ObjectId) {
    const objMessage = await this.messageModel
      .find({ room_id: roomId })
      .limit(100)
      .select('-deleted_at')
      .populate('sender_id', '_id name')
      .populate('quote', '_id message sender_id')
      .populate('forward', '_id message sender_id')
      .populate([
        {
          path: 'reactions',
          populate: {
            path: 'reaction_id',
            select: '_id name',
          },
        },
        {
          path: 'reactions',
          populate: {
            path: 'users',
            select: '_id name',
          },
        },
      ]);
    const messages = formatMessage(objMessage);

    return messages;
  }

  /**
   * Method to set message as seen
   * @param seenDto
   * @returns
   */
  async seenMessage(seenDto: SeenDto) {
    const { room_id, user_id } = seenDto;
    await this.messageModel.updateMany({ room_id, sender_id: { $ne: user_id } }, { read: true }, { limit: 1000 });
    return { room_id };
  }

  /**
   * Method to update message
   * @param updateMessageDto
   * @returns
   */
  async updateMessage(updateMessageDto: UpdateMessageDto) {
    const { message_id, message } = updateMessageDto;
    const messageEdited = await this.messageModel.findByIdAndUpdate(message_id, { edited: true, message }, { new: true });
    return messageEdited;
  }

  /**
   * Method to delete message
   * @param idMessageDto
   * @returns
   */
  async deleteMessage(idMessageDto: IdMessageDto) {
    const { message_id } = idMessageDto;
    const messageDeleted = await this.messageModel.findByIdAndUpdate(message_id, { deleted_at: new Date() }, { new: true });
    return messageDeleted;
  }

  /**
   * Method to add or remove a reaction
   * @param reactionMessageDto
   * @returns
   */
  async reactionMessage(reactionMessageDto: ReactionMessageDto) {
    const { message_id, reaction_id, user_id } = reactionMessageDto;
    const reactionsMessage = await this.messageModel.findById(message_id).select('reactions');
    const existReaction = reactionsMessage.reactions.find(reaction => reaction.reaction_id.toString() === reaction_id.toString());
    const existUsers = reactionsMessage.reactions[0]?.users.find(user => user.toString() === user_id.toString());

    if (existReaction && existUsers) {
      this.addReaction(reactionMessageDto, reactionsMessage);
    } else {
      this.removeReaction(reactionMessageDto, reactionsMessage, existReaction);
    }

    const message = await this.messageModel.findById(message_id).populate('reactions');
    return message;
  }

  /**
   * Method to add a reaction
   * @param reactionMessageDto
   * @param reactionsMessage
   */
  async addReaction(reactionMessageDto, reactionsMessage) {
    const { message_id, reaction_id, user_id } = reactionMessageDto;
    const countUsers = reactionsMessage.reactions[0]?.users.length;
    if (countUsers > 1) {
      const index = reactionsMessage.reactions[0].users.findIndex(user => user.toString() === user_id.toString());
      reactionsMessage.reactions[0].users.splice(index, 1);
      await this.messageModel.findByIdAndUpdate(message_id, { reactions: reactionsMessage.reactions }, { new: true });
    } else {
      await this.messageModel.findByIdAndUpdate(message_id, { $pull: { reactions: { reaction_id: reaction_id } } }, { new: true });
    }
  }

  /**
   * Method to remove a reaction
   * @param reactionMessageDto
   * @param reactionsMessage
   * @param existReaction
   */
  async removeReaction(reactionMessageDto, reactionsMessage, existReaction) {
    const { message_id, reaction_id, user_id } = reactionMessageDto;
    if (existReaction) {
      reactionsMessage.reactions[0].users.push(user_id);
      await this.messageModel.findByIdAndUpdate(message_id, { reactions: reactionsMessage.reactions }, { new: true });
    } else {
      await this.messageModel.findByIdAndUpdate(message_id, {
        $push: {
          reactions: {
            reaction_id,
            users: [user_id],
          },
        },
      });
    }
  }
}
