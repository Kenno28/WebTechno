import mongoose, { Document, Schema } from 'mongoose';

interface IHuman extends Document {
  name: string;
  password: string;
  alter: number;
}

const HumanSchema: Schema = new Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  alter: { type: Number, required: true },
});

const Human = mongoose.model<IHuman>('Human', HumanSchema);

export { Human, IHuman };

const Test: Schema = new Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  alter: { type: Number, required: true },
});