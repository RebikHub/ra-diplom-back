const { fortune, itemBasicMapper } = require('../utils/utils.js');
const { readFileSync } = require('fs');

const categories = JSON.parse(readFileSync('./data/categories.json', 'utf-8'));
const items = JSON.parse(readFileSync('./data/products.json', 'utf-8'));
const topSaleIds = [66, 65, 73];

function handleError(response, statusCode = 500) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify({ error: 'Internal Server Error' }));
}

function handleTopSales(method, query, request, response) {
  if (method === 'GET') {
    const topSaleItems = items.filter(item => topSaleIds.includes(item.id)).map(itemBasicMapper);
    fortune(response, topSaleItems).catch((error) => {
      handleError(response);
    });
  } else {
    fortune(response, 'Method Not Allowed', 405).catch((error) => {
      handleError(response);
    });
  }
}

function handleCategories(method, query, request, response) {
  if (method === 'GET') {
    fortune(response, categories).catch((error) => {
      handleError(response);
    });
  } else {
    fortune(response, 'Method Not Allowed', 405).catch((error) => {
      handleError(response);
    });
  }
}

function handleCategory(method, query, request, response) {
  if (method === 'GET') {
    const page = query.page === undefined ? 1 : Number(query.page);
    const limit = query.limit === undefined ? 10 : Number(query.limit);
    const id = Number(query.categoryId);
    const category = id === 0 ? items : items.filter(item => item.category === id);

    const endIndex = page * limit;
    const paginatedItems = category.slice(0, endIndex).map(itemBasicMapper);

    fortune(response, paginatedItems).catch((error) => {
      response.writeHead(500, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ error: 'Internal Server Error' }));
    });
  } else {
    fortune(response, 'Method Not Allowed', 405).catch((error) => {
      handleError(response);
    });
  }
}

function handleItems(method, query, request, response) {
  if (method === 'GET') {
    const q = query.q === undefined ? '' : query.q.trim().toLowerCase();
    const filtered = items
      .filter(item => item.title.toLowerCase().includes(q) || item.color.toLowerCase() === q)
      .map(itemBasicMapper);

    fortune(response, filtered).catch((error) => {
      handleError(response);
    });
  } else {
    fortune(response, 'Method Not Allowed', 405).catch((error) => {
      handleError(response);
    });
  }
}

function handleSingleItem(method, query, request, response) {
  if (method === 'GET') {
    const id = Number(query.id);
    const item = items.find(item => item.id === id);
    if (item === undefined) {
      fortune(response, 'Not Found', 404).catch((error) => {
        handleError(response);
      });
    } else {
      fortune(response, item).catch((error) => {
        handleError(response);
      });
    }
  } else {
    fortune(response, 'Method Not Allowed', 405).catch((error) => {
      handleError(response);
    });
  }
}

function handleOrder(method, query, request, response) {
  if (method === 'POST') {
    const requestBody = JSON.parse(request.body);
    const { owner: { phone, address }, items } = requestBody;
    if (typeof phone !== 'string') {
      fortune(response, 'Bad Request: Phone', 400).catch((error) => {
        handleError(response);
      });
    } else if (typeof address !== 'string') {
      fortune(response, 'Bad Request: Address', 400).catch((error) => {
        handleError(response);
      });
    } else if (!Array.isArray(items) || !items.every(({ id, price, count }) => {
      if (typeof id !== 'number' || id <= 0) {
        return false;
      }
      if (typeof price !== 'number' || price <= 0) {
        return false;
      }
      if (typeof count !== 'number' || count <= 0) {
        return false;
      }
      return true;
    })) {
      fortune(response, 'Bad Request', 400).catch((error) => {
        handleError(response);
      });
    } else {
      fortune(response, null, 204).catch((error) => {
        handleError(response);
      });
    }
  } else {
    fortune(response, 'Method Not Allowed', 405).catch((error) => {
      handleError(response);
    });
  }
}

module.exports = {
  handleTopSales, handleCategories, handleCategory, handleItems, handleSingleItem, handleOrder
}