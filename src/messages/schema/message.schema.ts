import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Reaction } from 'src/reactions/schema/reactions.schema';
import { Room } from 'src/rooms/schema/room.schema';
import { User } from 'src/users/schema/user.schema';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop()
  message: string;

  @Prop({ required: true, ref: User.name, type: Types.ObjectId })
  sender_id: Types.ObjectId;

  @Prop({ required: true, ref: Room.name, type: Types.ObjectId })
  room_id: Types.ObjectId;

  @Prop({ required: true })
  type: string;

  @Prop({ default: false })
  read: boolean;

  @Prop({ type: [{ reaction_id: { ref: Reaction.name, type: Types.ObjectId }, users: [{ ref: User.name, type: Types.ObjectId }] }] })
  reactions: [
    {
      reaction_id: Types.ObjectId;
      users: Types.ObjectId[];
    },
  ];

  @Prop({ ref: Message.name, type: Types.ObjectId })
  quote: string;

  @Prop({ ref: Message.name, type: Types.ObjectId })
  forward: string;

  @Prop({ default: false })
  edited: boolean;

  @Prop({ required: true, default: Date.now })
  created_at: Date;

  @Prop()
  updated_at: Date;

  @Prop()
  deleted_at: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
