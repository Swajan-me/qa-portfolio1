
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

  await loginPage.login('standard_user', 'wrong_password');

  await expect(loginPage.errorMessage).toBeVisible();

  await expect(loginPage.errorMessage).toContainText('Username and password do not match');
});

// TEST 3: Empty fields — should show a validation error
test('clicking login with empty fields shows a required field error', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await loginPage.login('', '');

  await expect(loginPage.errorMessage).toBeVisible();
  await expect(loginPage.errorMessage).toContainText('Username is required');
});
