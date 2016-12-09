# WebSockets Performance Test Service/Client

## Run server

```
npm install
node server.js
```

Server will be started at `localhost:3000` by default.

## Run performance test

```
node client %PATH-TO-SERVER%
```

- where `%PATH-TO-SERVER%` is path to your server, ie: ws://localhost:3000

## Results:

* `uws`
  * Users connected: 31400, memory used: 120 MB (after GC)
  * Users connected: 16040, memory used: 127 MB (before GC)
  * Users connected: 16040, memory used: 59 MB (after GC)
* `ws` - Users connected: 16040, memory used: 2534 MB