import {
  Document,
  model,
  Schema,
  Types,
} from 'mongoose';

import {Link} from './links';

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
});

export interface Visit extends Document {
  browser?: string;
  country?: string;
  headers?: Types.Map<string>;
  ip: string;
  link: Link;
  location?: string
  os: string;
  referrer: string;
}

export const visit = model<Visit>('Visit', VisitSchema);
