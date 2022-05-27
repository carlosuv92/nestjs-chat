import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MessageModule } from './message/message.module';
import { RoomModule } from './room/room.module';
import { FilesModule } from './files/files.module';
import { ReactionsModule } from './reactions/reactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
    MessageModule,
    RoomModule,
    FilesModule,
    ReactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // empty
}
