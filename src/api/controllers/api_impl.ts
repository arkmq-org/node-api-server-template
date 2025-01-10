import * as express from 'express';

const counters = new Map<string, number>();

export const getCounter = (
  req: express.Request,
  res: express.Response,
): void => {
  try {
      if (typeof req.query.name === "string") {
          const counterValue = counters.get(req.query.name) !== undefined ? counters.get(req.query.name) : 0;
          res.json({
              name: req.query.name,
              value: counterValue,
          });
      }
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'server error: ' + JSON.stringify(err),
    });
  }
};

export const setCounter = (
  req: express.Request,
  res: express.Response,
): void => {
  try {
      if (typeof req.body.name === "string") {
          counters.set(req.body.name, req.body.value)
          res.json({
              name: req.body.name,
              value: counters.get(req.body.name),
          });
      }
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'server error: ' + JSON.stringify(err),
    });
  }
};
