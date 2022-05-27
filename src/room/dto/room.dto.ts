import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';

export class RoomDto {
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => Types.ObjectId)
  participants: [Types.ObjectId];

  @IsNotEmpty()
  name: string;
}
