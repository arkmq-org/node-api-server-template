import createServer from './utils/server';
import http from 'http';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

console.log(
  `Starting plugin ${process.env.PLUGIN_NAME} ${process.env.PLUGIN_VERSION}`,
);

createServer(true)
  .then((server) => {
    let options = {};

    const srv = http.createServer(options, server);
    srv.listen(9980, () => {
      console.log('Listening on http://0.0.0.0:9980');
    });
  })
  .catch((err) => {
    console.error(`Error: ${err}`);
    process.exit(1);
  });
