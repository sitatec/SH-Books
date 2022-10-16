import { Book, signup, User } from '@shbooks/common';
import request from 'supertest';
import app from '../../src/app';
import BookCollection from '../../src/models/book';

const user: User = {
  id: "id",
  email: "sita@shbooks.com",
  password: "ljfslS4Rfl",
  firstName: "first",
  lastName: "last",
};

const book = {
  title: "ttl",
  description: "desc",
  price: 32.0,
  sellerId: user.id,
  imageUrl: "url",
  authorName: "author",
};


it('Should fetches the order', async () => {
  const {id: bookId} = await BookCollection.insert(book as Book);

  // make a request to build an order with this book
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', signup(user))
    .send({ bookId })
    .expect(201);

  // make request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', signup(user))
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it('Should returns an error if one user tries to fetch another users order', async () => {
  const {id: bookId} = await BookCollection.insert(book as Book);

  // make a request to build an order with this book
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', signup(user))
    .send({ bookId })
    .expect(201);

  // make request to fetch the order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', signup({...user, id: 'other_user_id'}))
    .send()
    .expect(401);
});
