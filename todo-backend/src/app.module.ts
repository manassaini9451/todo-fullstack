import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 
    }),

    MongooseModule.forRoot(process.env.MONGO_URL as string),

    AuthModule,
    TodoModule,
  ],
})
export class AppModule {}