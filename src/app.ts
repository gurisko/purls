import express from 'express';
import nocache from 'nocache';

require('dotenv').config();

import {connect as connectMongo} from './lib/mongo';
import {
  getAsync,
  setAsync,
} from './lib/redis';
import {
  Link,
  LinkRecord,
} from './models/links';
import {visitLink} from './visit';

const app = express();
app.use(nocache());

app.get('/404', async (req, res, next) => {
  return res.status(404).send('not found');
});

/**
 * Any reserved URLs should be defined before this handler
 */
app.get('/:id', async (req, res, next) => {
  let record: LinkRecord | null;
  const address = req.params.id.replace('+', '');

  const cached = await getAsync(address);
  record = cached
    ? JSON.parse(cached) as LinkRecord
    : await Link.findOne({address}).lean();

  if (!record) {
    return res.redirect(301, '/404');
  }

  res.redirect(record.target);

  await Promise.all([
    visitLink(record, req),
    cached ? null : setAsync(address, JSON.stringify(record)),
  ]);
});

void async function() {
  try {
    await connectMongo();
    app.listen(process.env.PORT);
  } catch (err) {
    process.exit(1);
  }
}();
