const { createServer } = require('http');
const { parse } = require('url');
const { handleRequest } = require('./handlers/handleRequest.js');

const server = createServer((request, response) => {
  const { pathname, query } = parse(request.url, true);
  console.log(parse(request.url, true));
  handleRequest(request.method, pathname, query, request, response);
});

const port = process.env.PORT || 7070;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
