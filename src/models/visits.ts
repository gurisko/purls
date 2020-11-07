import {
  Document,
  model,
  Schema,
  Types,
} from 'mongoose';

import {LinkRecord} from './links';

const VisitSchema = new Schema({
  browser: {
    type: String,
  },
  country: {
    type: String,
  },
  headers: {
    type: Map,
    of: String,
  },
  ip: {
    type: String,
    required: true,
  },
  link: {
    type: Types.ObjectId,
    ref: 'Link',
    required: true,
  },
  location: {
    type: String,
  },
  os: {
    type: String,
  },
  referrer: {
    type: String,
  },
}, {
  timestamps: true,
});

export interface VisitRecord extends Document {
  browser?: string;
  country?: string;
  createdAt: number;
  headers?: Types.Map<string>;
  ip: string;
  link: LinkRecord;
  location?: string
  os: string;
  referrer: string;
  updatedAt: number;
}

export const Visit = model<VisitRecord>('Visit', VisitSchema);
