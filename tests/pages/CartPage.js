// tests/pages/CartPage.js
//
// Page Object for the Products page and Cart page.
// After login, users land on the products page.
// This file handles adding items to the cart and going to checkout.

class CartPage {
  constructor(page) {
    this.page = page;

    // The cart icon in the top right corner
    this.cartIcon = page.locator('.shopping_cart_link');

    // The number badge on the cart icon (shows how many items are in cart)
    this.cartBadge = page.locator('.shopping_cart_badge');

    // The "Add to cart" button for the first product on the page
    this.firstAddToCartButton = page.locator('.btn_inventory').first();

    // The checkout button inside the cart page
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
  }

  // Click the first "Add to cart" button on the products page
  async addFirstItemToCart() {
    await this.firstAddToCartButton.click();
  }

  // Click the cart icon to go to the cart page
  async goToCart() {
    await this.cartIcon.click();
  }

  // Click checkout (you need to be on the cart page first)
  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}

module.exports = { CartPage };
