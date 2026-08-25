// tests/cart.spec.js
//
// These are the CART tests.
// We check that adding items, viewing the cart, and going to checkout works.

const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');
const { CartPage } = require('./pages/CartPage');

// This runs before every test in this file — logs in first
// so we don't repeat the login steps in every single test
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
  // Wait until we are on the products page before continuing
  await page.waitForURL(/inventory/);
});

// ─────────────────────────────────────────────
// TEST 1: Adding an item updates the cart badge count
// ─────────────────────────────────────────────
test('adding an item to cart shows badge count of 1', async ({ page }) => {
  const cartPage = new CartPage(page);

  // Click "Add to cart" on the first product
  await cartPage.addFirstItemToCart();

  // The cart badge (the red number on the cart icon) should show "1"
  await expect(cartPage.cartBadge).toHaveText('1');
});

// ─────────────────────────────────────────────
// TEST 2: Cart page shows the item that was added
// ─────────────────────────────────────────────
test('cart page shows the item after it is added', async ({ page }) => {
  const cartPage = new CartPage(page);

  await cartPage.addFirstItemToCart();
  await cartPage.goToCart();

  // On the cart page, there should be exactly 1 item listed
  const cartItems = page.locator('.cart_item');
  await expect(cartItems).toHaveCount(1);
});

// ─────────────────────────────────────────────
// TEST 3: Checkout button takes user to checkout page
// ─────────────────────────────────────────────
test('clicking checkout from cart goes to the checkout page', async ({ page }) => {
  const cartPage = new CartPage(page);

  await cartPage.addFirstItemToCart();
  await cartPage.goToCart();
  await cartPage.proceedToCheckout();

  // The URL should now contain /checkout-step-one
  await expect(page).toHaveURL(/checkout-step-one/);
});

// ─────────────────────────────────────────────
// TEST 4: Cart is empty when no items are added
// ─────────────────────────────────────────────
test('cart badge is not visible when no items are added', async ({ page }) => {
  const cartPage = new CartPage(page);

  // Without adding anything, the badge should not exist
  await expect(cartPage.cartBadge).not.toBeVisible();
});
