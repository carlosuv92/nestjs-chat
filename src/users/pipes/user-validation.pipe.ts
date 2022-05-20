import { PipeTransform, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { User, UserDocument } from '../schema/user.schema';

export class EmailValidationPipe implements PipeTransform {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async transform(value: any) {
    const { email } = value;
    if (await this.isUniqueEmail(email)) {
      throw new BadRequestException('Email already exists');
    }
    return value;
  }

  private isUniqueEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }
}

export class UserValidationPipe implements PipeTransform {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async transform(value: any) {
    const { sender_id } = value;
    if (!(await this.isUserExists(sender_id))) {
      throw new BadRequestException('User does not exist');
    }
    return value;
  }

  private isUserExists(id: Schema.Types.ObjectId) {
    return this.userModel.findOne({ _id: id }).exec();
  }
}
