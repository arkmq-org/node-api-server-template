import express from 'express';
import * as OpenApiValidator from 'express-openapi-validator';
import { Express } from 'express-serve-static-core';
import { Summary, connector, summarise } from 'swagger-routes-express';
import * as YAML from 'js-yaml';
import * as fs from 'fs';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as api from '../api/controllers';

export let API_SUMMARY: Summary;

const createServer = async (enableLogRequest: boolean): Promise<Express> => {
  const yamlSpecFile = path.join(__dirname, '../config/openapi.yml');

  const ymlData = fs.readFileSync(yamlSpecFile, 'utf-8');
  const apiDefinition = YAML.load(ymlData) as object;
  API_SUMMARY = summarise(apiDefinition);

  console.log(API_SUMMARY);

  const server = express();

  const validatorOptions = {
    apiSpec: yamlSpecFile,
    validateRequests: true,
    validateResponses: true,
    validateSecurity: true,
  };

  server.use(bodyParser.json());
  server.use(express.json());
  server.use(express.text());
  server.use(express.urlencoded({ extended: false }));
  server.use(cors());
  server.use(OpenApiValidator.middleware(validatorOptions));

  const connect = connector(api, apiDefinition, {
    onCreateRoute: (method: string, descriptor: any[]) => {
      console.log(
        `${method}: ${descriptor[0]} : ${(descriptor[1] as any).name}`,
      );
    },
  });

  connect(server);

  return server;
};

export default createServer;
