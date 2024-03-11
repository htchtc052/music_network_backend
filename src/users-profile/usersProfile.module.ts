import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TracksModule } from '../tracks/tracks.module';
import { UsersProfileController } from './usersProfile.controller';
import { UsersService } from '../users/users.service';
import { UsersRepository } from '../users/users.repository';
import { GetUserProfileMiddleware } from './middlewares/getUserProfile.middleware';
import { TracksService } from '../tracks/tracks.service';
import { TracksRepository } from '../tracks/tracksRepository';

@Module({
  imports: [ConfigModule, TracksModule],
  controllers: [UsersProfileController],
  providers: [UsersService, UsersRepository, TracksService, TracksRepository],
  exports: [UsersService],
})
export class UsersProfileModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GetUserProfileMiddleware).forRoutes(UsersProfileController);
  }
}
