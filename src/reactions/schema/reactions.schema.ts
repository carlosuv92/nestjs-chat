import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReactionDocument = Reaction & Document;

@Schema()
export class Reaction {
  @Prop({ required: true })
  name: string;
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);
