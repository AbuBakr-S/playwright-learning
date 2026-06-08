import { test, expect } from '@playwright/test';

let token: string;

test.beforeAll(async ({ request }) => {
  const response = await request.post('https://restful-booker.herokuapp.com/auth', {
    data: {
      username: 'admin',
      password: 'password123'
    }
  });
  const responseBody = await response.json();
  token = responseBody.token;
});


test('should return booking details after creation', async ({ request }) => {
  const createResponse = await request.post('https://restful-booker.herokuapp.com/booking', {
    data: {
      firstname: 'John',
      lastname: 'Doe',
      totalprice: 150,
      depositpaid: true,
      bookingdates: {
        checkin: '2026-07-20',
        checkout: '2026-07-27'
      },
      additionalneeds: 'Breakfast'
    }
  });
  expect(createResponse.status()).toBe(200);
  const responseBody = await createResponse.json();
  expect(responseBody.bookingid).toBeTruthy();
  expect(responseBody.booking.firstname).toBe('John');
  expect(responseBody.booking.lastname).toBe('Doe');
  expect(responseBody.booking.bookingdates.checkin).toBe('2026-07-20');
  expect(responseBody.booking.bookingdates.checkout).toBe('2026-07-27');
});


test('should reflect updated price and deposit after update', async ({ request }) => {
  const createResponse = await request.post('https://restful-booker.herokuapp.com/booking', {
    data: {
      firstname: 'Jane',
      lastname: 'Smith',
      totalprice: 200,
      depositpaid: false,
      bookingdates: {
        checkin: '2026-08-01',
        checkout: '2026-08-10'
      },
      additionalneeds: 'Late checkout'
    }
  });
  expect(createResponse.status()).toBe(200);
  const createResponseBody = await createResponse.json();
  const bookingId = createResponseBody.bookingid;
  expect(bookingId).toBeTruthy(); 

  const updateResponse = await request.put(`https://restful-booker.herokuapp.com/booking/${bookingId}`, {
    headers: {
      'Cookie': `token=${token}`
    },
    data: {
      firstname: 'Jane',
      lastname: 'Smith',
      totalprice: 250,
      depositpaid: true,
      bookingdates: {
        checkin: '2026-08-01',
        checkout: '2026-08-10'
      },
      additionalneeds: 'Late checkout'
    }
  });
  expect(updateResponse.status()).toBe(200);
  const updateResponseBody = await updateResponse.json();
  expect(updateResponseBody.totalprice).toBe(250);
  expect(updateResponseBody.depositpaid).toBe(true);
});


test('should return 404 after a booking is deleted', async ({ request }) => {
  const createResponse = await request.post('https://restful-booker.herokuapp.com/booking', {
    data: {
      firstname: 'Alice',
      lastname: 'Johnson',
      totalprice: 300,
      depositpaid: true,
      bookingdates: {
        checkin: '2026-09-01',
        checkout: '2026-09-05'
      },
      additionalneeds: 'None'
    }
  });
  expect(createResponse.status()).toBe(200);
  const createResponseBody = await createResponse.json();
  const bookingId = createResponseBody.bookingid;
  expect(bookingId).toBeTruthy();

  const deleteResponse = await request.delete(`https://restful-booker.herokuapp.com/booking/${bookingId}`, {
    headers: {
      'Cookie': `token=${token}`
    }
  });
  // API returns 201 instead of the more appropriate 204 No Content
  expect(deleteResponse.status()).toBe(201);

  const getResponse = await request.get(`https://restful-booker.herokuapp.com/booking/${bookingId}`);
  expect(getResponse.status()).toBe(404);
});