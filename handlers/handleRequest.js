const { fortune, parseRequestBody } = require('../utils/utils.js');
const { handleTopSales, handleCategories, handleCategory, handleItems, handleSingleItem, handleOrder, handleError } = require('./handlers.js');

const handlers = {
  '/api/top-sales': handleTopSales,
  '/api/categories': handleCategories,
  '/api/category': handleCategory,
  '/api/items': handleItems,
  '/api/item': handleSingleItem,
  '/api/order': handleOrder,
};

function handleRequest(method, pathname, query, request, response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    response.writeHead(200);
    response.end();
    return;
  }

  const handler = handlers[pathname];

  if (handler) {
    handler(method, query, request, response);
  } else {
    fortune(response, 'Not Found', 404).catch((error) => {
      handleError(response);
    });
  }
}

module.exports = { handleRequest }