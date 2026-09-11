const http = require('http');
const responseHandler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': responseHandler.getIndex,
  '/cats': responseHandler.getCats,
  default: responseHandler.getIndex
};

const onRequest = (request, response) => {
  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedURL = new URL(request.url, `${protocol}://${request.headers.host}`);
  console.log(parsedURL);

  request.acceptedTypes = request.headers.accept ? request.headers.accept.split(',') : [];
  
  const handler = urlStruct[parsedURL.pathname];

  if (handler) {
    handler(request, response);
  } else {
    urlStruct.default(request, response);
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1:${port}`);
});
