import request from 'supertest';
import {Book, OrderStatus, signup, User} from '@shbooks/common';
import BookCollection from '../../src/models/book';
import OrderCollection from '../../src/models/order';
import app from '../../src/app';
import { StatusCodes } from 'http-status-codes';

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

it('Should marks an order as cancelled', async () => {
  const { id: bookId } = await BookCollection.insert(book as Book);

  // make a request to create an order 
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', signup(user))
    .send({ bookId })
    .expect(StatusCodes.CREATED);

  // make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', signup(user))
    .send()
    .expect(StatusCodes.OK);

  const updatedOrder = await OrderCollection.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Canceled);
});

it.todo('Should emits a order cancelled event');
