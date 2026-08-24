
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

