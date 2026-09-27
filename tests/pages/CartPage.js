class CartPage {
  constructor(page) {
    this.page = page;
    this.cartIcon = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.firstAddToCartButton = page.locator('.btn_inventory').first();
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
  }

  async addFirstItemToCart() {
    await this.firstAddToCartButton.click();
  }

  async goToCart() {
    await this.cartIcon.click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}

module.exports = { CartPage };
