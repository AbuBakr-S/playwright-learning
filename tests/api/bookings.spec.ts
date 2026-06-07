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
  const response = await request.post('https://restful-booker.herokuapp.com/booking', {
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
  expect(response.status()).toBe(200);
  const responseBody = await response.json();
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