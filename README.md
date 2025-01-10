# node-api-server-template

Template for an api server on node JS.

```bash
yarn
yarn build
yarn test
```

## usage

```bash
curl \
    --header "Content-Type: application/json" \
    --request POST \
    --data '{"name":"c1","value":12}' \
    http://localhost:9980/api/v1/counter
{"name":"c1","value":12}
```

```bash
curl  http://localhost:9980/api/v1/counter?name=c1
{"name":"c1","value":12}
curl  http://localhost:9980/api/v1/counter?name=c0
{"name":"c0","value":0}
```

