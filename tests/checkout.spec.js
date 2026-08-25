// tests/checkout.spec.js
//
// These are the CHECKOUT tests.
// We check the checkout form, required fields, and order completion.

const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');
const { CartPage } = require('./pages/CartPage');

// Helper: log in and add an item to cart before each test
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  const cartPage  = new CartPage(page);

  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
  await page.waitForURL(/inventory/);

  // Add item and navigate to checkout
  await cartPage.addFirstItemToCart();
  await cartPage.goToCart();
  await cartPage.proceedToCheckout();

  // Should now be on the checkout form page
  await page.waitForURL(/checkout-step-one/);
});

// ─────────────────────────────────────────────
// TEST 1: Leaving checkout form empty shows an error
// ─────────────────────────────────────────────
test('submitting empty checkout form shows a required field error', async ({ page }) => {
  // Click Continue without filling anything in
  await page.getByRole('button', { name: 'Continue' }).click();

  // An error message should appear
  const error = page.locator('[data-test="error"]');
  await expect(error).toBeVisible();
  await expect(error).toContainText('First Name is required');
});

// ─────────────────────────────────────────────
// TEST 2: Valid checkout form moves to the order summary page
// ─────────────────────────────────────────────
test('filling in checkout form correctly goes to order summary', async ({ page }) => {
  // Fill in the checkout form fields
  await page.getByPlaceholder('First Name').fill('Test');
  await page.getByPlaceholder('Last Name').fill('User');
  await page.getByPlaceholder('Zip/Postal Code').fill('12345');

  await page.getByRole('button', { name: 'Continue' }).click();

  // Should now be on the overview/summary page
  await expect(page).toHaveURL(/checkout-step-two/);
  await expect(page.locator('.title')).toHaveText('Checkout: Overview');
});

// ─────────────────────────────────────────────
// TEST 3: Completing an order shows the confirmation screen
// ─────────────────────────────────────────────
test('completing checkout shows the order confirmation page', async ({ page }) => {
  // Fill in the form
  await page.getByPlaceholder('First Name').fill('Test');
  await page.getByPlaceholder('Last Name').fill('User');
  await page.getByPlaceholder('Zip/Postal Code').fill('12345');
  await page.getByRole('button', { name: 'Continue' }).click();

  // On the summary page, click Finish
  await page.getByRole('button', { name: 'Finish' }).click();

  // The confirmation message should be visible
  await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
});
