import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class MessageDto {
  @IsMongoId()
  room_id: Types.ObjectId;
}

export class SeenDto {
  @IsMongoId()
  room_id: Types.ObjectId;

  @IsMongoId()
  user_id: Types.ObjectId;
}

export class UpdateMessageDto {
  @IsMongoId()
  message_id: Types.ObjectId;

  message: Types.ObjectId;
}

export class IdMessageDto {
  @IsMongoId()
  message_id: Types.ObjectId;
}

export class ReactionMessageDto {
  @IsMongoId()
  message_id: Types.ObjectId;

  @IsMongoId()
  reaction_id: Types.ObjectId;

  @IsMongoId()
  user_id: Types.ObjectId;
}
