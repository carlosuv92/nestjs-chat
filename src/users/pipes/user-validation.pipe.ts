import { PipeTransform, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schema/user.schema';

export class EmailValidationPipe implements PipeTransform {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  transform(value: any) {
    const { email } = value;
    if (this.isUniqueEmail(email)) {
      throw new BadRequestException('Email already exists');
    }
    return value;
  }

  private isUniqueEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }
}
