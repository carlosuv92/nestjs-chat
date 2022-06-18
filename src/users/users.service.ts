import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schema/user.schema';
import { Model, Types } from 'mongoose';
import { FileDocument } from 'src/files/schema/file.schema';
import { File } from 'src/files/schema/file.schema';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map, Observable } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(File.name) private filesModel: Model<FileDocument>,
    private readonly httpService: HttpService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userModel.create(createUserDto);
    return user;
  }

  async updateAvatar(id: Types.ObjectId, avatar: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    user.avatar = avatar;
    await user.save();
    return user;
  }

  async findAll() {
    const users = await this.userModel.find().exec();
    return users;
  }

  async findOne(id: Types.ObjectId) {
    const user = await this.userModel.findOne({ _id: id });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async importUsers() {
    const url = 'http://oldsoft.test/api/get-consume-users?api_key=key_cur_prod_fnPqT5xQEi5Vcb9wKwbCf65c3BjVGyBB';
    const data = this.httpService.get(url);
    const users = await lastValueFrom(data.pipe(map(res => res.data)));

    for await (const user of users) {
      try {
        const userExists = await this.userModel.findOne({ email: user.email });
        if (!userExists) {
          await this.userModel.create(user);
        }
      } catch (error) {
        return error;
      }
    }

    return users;
  }
}
