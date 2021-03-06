import {
  Document,
  model,
  Model,
  Schema,
} from 'mongoose';

const LinkSchema = new Schema({
  address: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  target: {
    type: String,
    required: true,
  },
});

export interface LinkRecord extends Document {
  address: string;
  target: string;
}

export const Link = model<LinkRecord, Model<LinkRecord>>('Link', LinkSchema);
