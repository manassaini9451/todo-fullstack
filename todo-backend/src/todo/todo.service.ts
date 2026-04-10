import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo } from './todo.schema';

@Injectable()
export class TodoService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<Todo>) {}

  // CREATE
  create(data: any) {
    return new this.todoModel(data).save();
  }

  // READ
  findAll() {
    return this.todoModel.find({ isActive: true });
  }

  // UPDATE (EDIT)
  update(id: string, data: any) {
    return this.todoModel.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  // DELETE (SOFT DELETE)
  delete(id: string) {
    return this.todoModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );
  }
}