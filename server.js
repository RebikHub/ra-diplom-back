import { createServer } from 'http';
import { parse } from 'url';
import handleRequest from './handlers/requestHandler.js';

const server = createServer((request, response) => {
  const { pathname, query } = parse(request.url, true);
  handleRequest(request.method, pathname, query, request, response);
});

const port = process.env.PORT || 7070;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
