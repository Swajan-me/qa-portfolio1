const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');
const { CartPage } = require('./pages/CartPage');

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
  await page.waitForURL(/inventory/);
});

test('adding an item to cart shows badge count of 1', async ({ page }) => {
  const cartPage = new CartPage(page);
  await cartPage.addFirstItemToCart();
  await expect(cartPage.cartBadge).toHaveText('1');
});

test('cart page shows the item after it is added', async ({ page }) => {
  const cartPage = new CartPage(page);

  await cartPage.addFirstItemToCart();
  await cartPage.goToCart();
  const cartItems = page.locator('.cart_item');
  await expect(cartItems).toHaveCount(1);
});

test('clicking checkout from cart goes to the checkout page', async ({ page }) => {
  const cartPage = new CartPage(page);

  await cartPage.addFirstItemToCart();
  await cartPage.goToCart();
  await cartPage.proceedToCheckout();

  await expect(page).toHaveURL(/checkout-step-one/);
});

test('cart badge is not visible when no items are added', async ({ page }) => {
  const cartPage = new CartPage(page);

  await expect(cartPage.cartBadge).not.toBeVisible();
});
