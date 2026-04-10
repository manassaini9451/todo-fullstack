import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

interface MongoError {
  code?: number;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService
  ) {}

  // ✅ REGISTER
  async register(data: any) {
    const { email, password } = data;

    // 1. Check user exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    // 2. Hash password
    const hash = await bcrypt.hash(password, 10);

    try {
      const user = new this.userModel({
        name: data.name,
        email,
        password: hash,
        age: data.age,
        phone: data.phone,
        role: data.role || 'user',
        isActive: true,
      });

      return await user.save();

    } catch (error: unknown) {
      const err = error as MongoError;

      // ✅ Mongo duplicate error
      if (err.code === 11000) {
        throw new BadRequestException('User already exists');
      }

      console.error('REGISTER ERROR:', error);
      throw new BadRequestException('Something went wrong');
    }
  }

  // ✅ LOGIN
  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new BadRequestException('Invalid password');
    }

    // JWT payload
    const payload = {
      userId: user._id,
      email: user.email,
    };

    const token = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      token,
      user,
    };
  }
}