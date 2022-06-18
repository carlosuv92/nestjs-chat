import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/schema/user.schema';

export type RoomDocument = Room & Document;

@Schema()
export class Room {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  avatar: string;

  @Prop()
  type: string;

  @Prop({ required: true, ref: User.name, type: [Types.ObjectId] })
  participants: [Types.ObjectId];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
