import { PipeTransform, BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schema/user.schema';

@Injectable()
export class UserIdValidationPipe implements PipeTransform {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async transform(value: any) {
    const { user_id } = value;
    if (await this.isUniqueEmail(user_id)) {
      throw new BadRequestException('UserId already exists');
    }
    return value;
  }

  private isUniqueEmail(user_id: Number) {
    return this.userModel.findOne({ user_id }).exec();
  }
}

@Injectable()
export class EmailValidationPipe implements PipeTransform {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async transform(value: any) {
    console.log(value, 'aquo');

    const { email } = value;
    if (await this.isUniqueEmail(email)) {
      throw new BadRequestException('Email already exists');
    }
    return value;
  }

  public isUniqueEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }
}
