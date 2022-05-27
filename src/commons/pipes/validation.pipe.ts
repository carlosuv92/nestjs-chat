import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ValidateObjectId implements PipeTransform<any, Types.ObjectId> {
  transform(value: any): Types.ObjectId {
    const validObjectId = Types.ObjectId.isValid(value);
    if (!validObjectId) {
      throw new BadRequestException('Parameter is not a valid ObjectId');
    }

    return value;
  }
}

@Injectable()
export class ValidateMultipleObjectId implements PipeTransform<any, Types.ObjectId[]> {
  transform(value: any): Types.ObjectId[] {
    const isAllObjectId = value.every(id => Types.ObjectId.isValid(id));
    if (!isAllObjectId) throw new BadRequestException('At least one participant is invalid');

    return value;
  }
}
