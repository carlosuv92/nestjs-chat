import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Schema } from 'mongoose';

export class RoomDto {
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => Schema.Types.ObjectId)
  participants: [Schema.Types.ObjectId];

  @IsNotEmpty()
  name: string;
}
