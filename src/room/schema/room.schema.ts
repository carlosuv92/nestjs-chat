import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
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

  @Prop({ required: true, ref: User.name, type: [MongooseSchema.Types.ObjectId] })
  participants: [MongooseSchema.Types.ObjectId];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
