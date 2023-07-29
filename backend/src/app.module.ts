import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { CategoryModule } from './category/categoty.module';
import { HashModule } from './hash/hash.module';
import { ConfigModule } from '@nestjs/config';
import config from './config/config';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [config] }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '../images'),
      serveRoot: '/images/',
    }),
    UserModule,
    PostModule,
    CategoryModule,
    HashModule,
    AuthModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
