
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');

// TEST 1: Valid login — should land on products page

test('valid login takes user to the products page', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await loginPage.login('standard_user', 'secret_sauce');

  await expect(page).toHaveURL(/inventory/);

  await expect(page.locator('.title')).toHaveText('Products');
});

// TEST 2: Wrong password — should show an error message
test('wrong password shows an error message', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  // Use a real username but the wrong password
  await loginPage.login('standard_user', 'wrong_password');

  // The error message element should appear on the page
  await expect(loginPage.errorMessage).toBeVisible();

  // And it should say something about incorrect credentials
  await expect(loginPage.errorMessage).toContainText('Username and password do not match');
});