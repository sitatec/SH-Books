import { User, Book, signup } from '@shbooks/common';
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

const buildBook = () => BookCollection.insert(book as Book);

it('Should fetches orders for an particular user', async () => {
  // Create three books
  const bookOne = await buildBook();
  const bookTwo = await buildBook();
  const bookThree = await buildBook();

  const userOneCookie = signup(user);
  const userTwoCookie = signup({...user, id: 'id_two'});
  // Create one order as User #1
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOneCookie)
    .send({ bookId: bookOne.id })
    .expect(201);

  // Create two orders as User #2
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwoCookie)
    .send({ bookId: bookTwo.id })
    .expect(201);
  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwoCookie)
    .send({ bookId: bookThree.id })
    .expect(201);

  // Make request to get orders for User #2
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwoCookie)
    .expect(200);

  // Make sure we only got the orders for User #2
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
  expect(response.body[0].book.id).toEqual(bookTwo.id);
  expect(response.body[1].book.id).toEqual(bookThree.id);
});
