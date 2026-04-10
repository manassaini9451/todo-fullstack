import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Todo {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  completed: boolean;

  @Prop({ default: 'low' })
  priority: string; // low | medium | high

  @Prop()
  dueDate: Date;

  @Prop()
  userId: string; // future me user-wise todo ke liye

  @Prop({ default: true })
  isActive: boolean;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);