import { fortune, itemBasicMapper } from '../utils/utils.js';
import { readFileSync } from 'fs';

const categories = JSON.parse(readFileSync('./data/categories.json', 'utf-8'));
const items = JSON.parse(readFileSync('./data/products.json', 'utf-8'));
const topSaleIds = [66, 65, 73];

export function handleTopSales(method, query, request, response) {
  if (method === 'GET') {
    const topSaleItems = items.filter(item => topSaleIds.includes(item.id)).map(itemBasicMapper);
    fortune(response, topSaleItems);
  } else {
    fortune(response, 'Method Not Allowed', 405);
  }
}

export function handleCategories(method, query, request, response) {
  if (method === 'GET') {
    fortune(response, categories);
  } else {
    fortune(response, 'Method Not Allowed', 405);
  }
}

export function handleCategory(method, query, request, response) {
  if (method === 'GET') {
    const page = query.page === undefined ? 1 : Number(query.page);
    const limit = query.limit === undefined ? 10 : Number(query.limit);
    const id = Number(query.categoryId);
    const category = id === 0 ? items : items.filter(item => item.category === id);

    const endIndex = page * limit;
    const paginatedItems = category.slice(0, endIndex).map(itemBasicMapper);

    fortune(response, paginatedItems);
  } else {
    fortune(response, 'Method Not Allowed', 405);
  }
}

export function handleItems(method, query, request, response) {
  if (method === 'GET') {
    const q = query.q === undefined ? '' : query.q.trim().toLowerCase();
    const filtered = items
      .filter(item => item.title.toLowerCase().includes(q) || item.color.toLowerCase() === q)
      .map(itemBasicMapper);

    fortune(response, filtered);
  } else {
    fortune(response, 'Method Not Allowed', 405);
  }
}

export function handleSingleItem(method, query, request, response) {
  if (method === 'GET') {
    const id = Number(query.id);
    const item = items.find(item => item.id === id);
    if (item === undefined) {
      fortune(response, 'Not Found', 404);
    } else {
      fortune(response, item);
    }
  } else {
    fortune(response, 'Method Not Allowed', 405);
  }
}

export function handleOrder(method, query, request, response) {
  if (method === 'POST') {
    const requestBody = JSON.parse(request.body);
    const { owner: { phone, address }, items } = requestBody;
    if (typeof phone !== 'string') {
      fortune(response, 'Bad Request: Phone', 400);
    } else if (typeof address !== 'string') {
      fortune(response, 'Bad Request: Address', 400);
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
      fortune(response, 'Bad Request', 400);
    } else {
      fortune(response, null, 204);
    }
  } else {
    fortune(response, 'Method Not Allowed', 405);
  }
}
