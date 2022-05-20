import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/users/schema/user.schema';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop({ required: true })
  message: string;

  @Prop({ required: true, ref: User.name, type: MongooseSchema.Types.ObjectId })
  sender_id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  room_id: number;

  @Prop({ required: true })
  type: string;

  @Prop()
  read: boolean;

  @Prop()
  attachment: string;

  @Prop()
  attachment_type: string;

  @Prop()
  attachment_name: string;

  @Prop()
  attachment_size: number;

  @Prop({ required: true, default: Date.now })
  created_at: Date;

  @Prop()
  updated_at: Date;

  @Prop()
  deleted_at: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
