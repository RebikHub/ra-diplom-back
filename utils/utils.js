function itemBasicMapper(item) {
  return ({
    id: item.id,
    category: item.category,
    title: item.title,
    price: item.price,
    images: item.images,
  })
}

export function randomNumber(start, stop) {
  return Math.floor(Math.random() * (stop - start + 1)) + start;
}

export function fortune(response, body = null, status = 200) {
  const delay = randomNumber(1, 10) * 100;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // if (Math.random() > 0.92) {
      //   reject(new Error('Something bad happened'));
      //   return;
      // }

      response.writeHead(status, {
        'Content-Type': 'application/json',
      });
      response.end(JSON.stringify(body));
      resolve();
    }, delay);
  });
}
