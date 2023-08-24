import { fortune } from '../utils/utils.js';
import { handleTopSales, handleCategories, handleCategory, handleItems, handleSingleItem, handleOrder } from './handlers/handlers';

const handlers = {
  '/api/top-sales': handleTopSales,
  '/api/categories': handleCategories,
  '/api/category': handleCategory,
  '/api/items': handleItems,
  '/api/items/:id': handleSingleItem,
  '/api/order': handleOrder,
};

export default function handleRequest(method, pathname, query, request, response) {
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
    fortune(response, 'Not Found', 404);
  }
}
