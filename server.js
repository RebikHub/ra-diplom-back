const http = require('http');
const fs = require('fs');
const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa2-cors');
const koaBody = require('koa-body');

const categories = JSON.parse(fs.readFileSync('./data/categories.json'));
const items = JSON.parse(fs.readFileSync('./data/products.json'));
const topSaleIds = [66, 65, 73];
const moreCount = 6;

const itemBasicMapper = item => ({
    id: item.id,
    category: item.category,
    title: item.title,
    price: item.price,
    images: item.images,
});

const randomNumber = (start, stop) => {
    return Math.floor(Math.random() * (stop - start + 1)) + start;
}

const fortune = (ctx, body = null, status = 200) => {
    const delay = randomNumber(1, 10) * 100;
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() > 0.92) {
                reject(new Error('Something bad happened'));
                return;
            }

            ctx.response.status = status;
            ctx.response.body = body;
            resolve();
        }, delay);
    })
}

const app = new Koa();
app.use(cors());
app.use(koaBody({
    json: true
}));

const router = new Router();

router.get('/api/top-sales', async (ctx, next) => {
    return fortune(ctx, items.filter(o => topSaleIds.includes(o.id)).map(itemBasicMapper));
});

router.get('/api/categories', async (ctx, next) => {
    return fortune(ctx, categories);
});

router.get('/api/category', async (ctx, next) => {
    const { query } = ctx.request;

    const page = query.page === undefined ? 1 : Number(query.page);
    const limit = query.limit === undefined ? 10 : Number(query.limit);
    const id = Number(query.categoryId)
    const category = id === 0 ? items : items.filter((item) => item.category === id);

    const endIndex = page * limit;

    const paginatedItems = category.slice(0, endIndex).map(itemBasicMapper);

    return fortune(ctx, paginatedItems);
});

router.get('/api/items', async (ctx, next) => {
    const { query } = ctx.request;
    const q = query.q === undefined ? '' : query.q.trim().toLowerCase();
    const filtered = items
        .filter(o => o.title.toLowerCase().includes(q) || o.color.toLowerCase() === q)
        .map(itemBasicMapper);

    return fortune(ctx, filtered);
});

router.get('/api/items/:id', async (ctx, next) => {
    const id = Number(ctx.params.id);
    const item = items.find(o => o.id === id);
    if (item === undefined) {
        return fortune(ctx, 'Not found', 404);
    }

    return fortune(ctx, item);
});

router.post('/api/order', async (ctx, next) => {
    const { owner: { phone, address }, items } = JSON.parse(ctx.request.body);
    if (typeof phone !== 'string') {
        return fortune(ctx, 'Bad Request: Phone', 400);
    }
    if (typeof address !== 'string') {
        return fortune(ctx, 'Bad Request: Address', 400);
    }
    if (!Array.isArray(items)) {
        return fortune(ctx, 'Bad Request: Items', 400);
    }
    if (!items.every(({ id, price, count }) => {
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
        return fortune(ctx, 'Bad Request', 400);
    }

    return fortune(ctx, null, 204);
});

app.use(router.routes())
app.use(router.allowedMethods());

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback());
server.listen(port);