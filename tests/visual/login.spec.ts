import { test, expect } from "@playwright/test";

test("login page visual appearance", async ({ page }) => {
  await page.goto("");
  await expect(page.locator('.login_wrapper-inner')).toHaveScreenshot('login-form.png')
});

test("login page visual appearance with error", async ({ page }) => {
  await page.goto("");
  await page.getByPlaceholder("Username").fill("locked_out_user");
  await page.getByPlaceholder("Password").fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByTestId('error')).toBeVisible();
  await expect(page.locator('.login_wrapper-inner')).toHaveScreenshot('login-form-error.png')
});
