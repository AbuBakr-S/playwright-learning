import { test, expect } from '@playwright/test';

test('login page displays correct title', async ({ page }) => {
  await page.goto('');
  await expect(page).toHaveTitle(/Swag Labs/);
});

test('login with standard user', async ({ page }) => {
  await page.goto('');

  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');

  await page.getByRole('button', { name: 'Login' }).click();

  // Heading is not used here so it won't break if the element type changes
  // Successful login should land the user on the product catalogue
  await expect(page.getByTestId('title')).toHaveText('Products')
});

test('locked out user is denied access with error message', async ({ page }) => {
  await page.goto('');

  await page.getByPlaceholder('Username').fill('locked_out_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');

  await page.getByRole('button', { name: 'Login' }).click();

  // Locked out users should be denied with a clear explanation
  await expect(page.getByTestId('error')).toContainText('Sorry, this user has been locked out.');
});