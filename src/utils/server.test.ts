import http from 'http';
import createServer from './server';
import fetch from 'node-fetch';

let testServer: http.Server;

const apiUrlBase = 'http://localhost:9980/api/v1';
const startApiServer = async (): Promise<boolean> => {
  const result = await createServer(false)
  .then((server) => {
    testServer = http.createServer({}, server);
    testServer.listen(9980, () => {});
    return true;
  })
  .catch((err) => {
    console.error(`Error: ${err}`);
    return false;
  });
  return result;
};

const stopApiServer = () => {
  testServer.close();
};

beforeAll(async () => {
  const result = await startApiServer();
  expect(result).toBe(true);
  expect(testServer).toBeDefined();
});

afterAll(() => {
  stopApiServer();
});

const doGet = async (url: string): Promise<fetch.Response> => {
  const sep = url.indexOf('?') > -1 ? '&' : '?';
  const fullUrl =
    apiUrlBase +
    url +
    sep;
  const encodedUrl = fullUrl.replace(/,/g, '%2C');
  const response = await fetch(encodedUrl, {
    method: 'GET',
  });
  return response;
};

const doPost = async (
  url: string,
  postBody: fetch.BodyInit,
): Promise<fetch.Response> => {
  const sep = url.indexOf('?') > -1 ? '&' : '?';
  const fullUrl =
    apiUrlBase +
    url +
    sep;
  const encodedUrl = fullUrl.replace(/,/g, '%2C');

  const reply = await fetch(encodedUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: postBody,
  });

  return reply;
};

describe('test api server apis', () => {
  it('test get counter', async () => {
    const resp = await doGet('/counter?name=c1');
    expect(resp.ok).toBeTruthy();

    const value = await resp.json();
    expect(value.name).toEqual("c1");
    expect(value.value).toEqual(0);
  });

  it('test set counter', async () => {
    const resp = await doPost('/counter',
      JSON.stringify({
        name:"c1", value:12
      }),
    );
    expect(resp.ok).toBeTruthy();

    const value = await resp.json();
    expect(value.name).toEqual("c1");
    expect(value.value).toEqual(12);
  });
});
