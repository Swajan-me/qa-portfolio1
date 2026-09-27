const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');
const { CartPage } = require('./pages/CartPage');

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  const cartPage  = new CartPage(page);

  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
  await page.waitForURL(/inventory/);

  await cartPage.addFirstItemToCart();
  await cartPage.goToCart();
  await cartPage.proceedToCheckout();

  await page.waitForURL(/checkout-step-one/);
});

test('submitting empty checkout form shows a required field error', async ({ page }) => {
  await page.getByRole('button', { name: 'Continue' }).click();

  const error = page.locator('[data-test="error"]');
  await expect(error).toBeVisible();
  await expect(error).toContainText('First Name is required');
});


test('filling in checkout form correctly goes to order summary', async ({ page }) => {

  await page.getByPlaceholder('First Name').fill('Test');
  await page.getByPlaceholder('Last Name').fill('User');
  await page.getByPlaceholder('Zip/Postal Code').fill('12345');

  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page).toHaveURL(/checkout-step-two/);
  await expect(page.locator('.title')).toHaveText('Checkout: Overview');
});

test('completing checkout shows the order confirmation page', async ({ page }) => {
  await page.getByPlaceholder('First Name').fill('Test');
  await page.getByPlaceholder('Last Name').fill('User');
  await page.getByPlaceholder('Zip/Postal Code').fill('12345');
  await page.getByRole('button', { name: 'Continue' }).click();

  await page.getByRole('button', { name: 'Finish' }).click();
  
  await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
});
