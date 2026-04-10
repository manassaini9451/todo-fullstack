import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async register(data: any) {
    // password hash
    const hash = await bcrypt.hash(data.password, 10);

    const user = new this.userModel({
      name: data.name,
      email: data.email,
      password: hash,
      age: data.age,
      phone: data.phone,
      role: data.role || 'user',
      isActive: true,
    });

    return user.save();
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) return { message: 'User not found' };

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return { message: 'Invalid password' };

    return {
      message: 'Login successful',
      user,
    };
  }
}