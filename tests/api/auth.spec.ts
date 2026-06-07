import { test, expect } from '@playwright/test';

test('authentication returns a token', async ({ request }) => {
  const response = await request.post('https://restful-booker.herokuapp.com/auth', {
    data: {
      username: 'admin',
      password: 'password123'
    }
  });
  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  expect(responseBody.token).toBeTruthy();
});

test('authentication fails when using invalid credentials', async ({ request }) => {
  const response = await request.post('https://restful-booker.herokuapp.com/auth', {
    data: {
      username: 'invalid_user',
      password: 'invalid_password'
    }
  });
  // Poor API design - 401 Unauthorized would be more appropriate
  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  expect(responseBody.reason).toBe('Bad credentials');
  expect(responseBody.token).toBeUndefined()
});