import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Message } from 'src/message/schema/message.schema';

export type FileDocument = File & Document;

@Schema()
export class File {
  @Prop({ required: true, ref: Message.name, type: Types.ObjectId })
  message_id: Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  type: string;

  @Prop()
  extension: string;

  @Prop()
  size: number;

  @Prop()
  path: string;

  @Prop({ required: true, default: Date.now })
  created_at: Date;
}

export const FileSchema = SchemaFactory.createForClass(File);
