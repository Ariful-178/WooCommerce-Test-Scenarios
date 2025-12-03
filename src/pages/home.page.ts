import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
  private readonly logo: Locator;
  private readonly navigationMenu: Locator;
  private readonly searchInput: Locator;
  private readonly searchButton: Locator;
  private readonly headerTitle: Locator;
  private readonly loginButton: Locator;
  private readonly profileMenu: Locator;
  private readonly featuredSection: Locator;
  private readonly productCards: Locator;
  private readonly footerLinks: Locator;
  private readonly newsletterInput: Locator;
  private readonly subscribeButton: Locator;

  // WooCommerce navigation locators
  private readonly extensionButton: Locator;
  private readonly freeButton: Locator;
  private readonly wooPaymentsLink: Locator;
  private readonly addToCartButton: Locator;
  private readonly ordersButton: Locator;
  private readonly firstViewButton: Locator;

  // WooCommerce checkout locators
  private readonly cartIcon: Locator;
  private readonly proceedToCheckoutButton: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly streetAddressInput: Locator;
  private readonly townCityInput: Locator;
  private readonly districtDropdown: Locator;
  private readonly productUseDropdown: Locator;
  private readonly placeOrderButton: Locator;
  private readonly orderSuccessHeading: Locator;
  private readonly districtOption: (districtName: string) => Locator;
  private readonly productUseOption: (optionName: string) => Locator;

  constructor(page: Page) {
    super(page);

    this.logo = page.locator('[data-testid="logo"]');
    this.navigationMenu = page.locator('nav[data-testid="main-navigation"]');
    this.searchInput = page.locator('input[placeholder="Search..."]');
    this.searchButton = page.locator('button[data-testid="search-button"]');
    this.headerTitle = page.locator('h1[data-testid="header-title"]');
    this.loginButton = page.locator('button[data-testid="login-button"]');
    this.profileMenu = page.locator('[data-testid="profile-menu"]');
    this.featuredSection = page.locator('section[data-testid="featured-section"]');
    this.productCards = page.locator('[data-testid="product-card"]');
    this.footerLinks = page.locator('footer a');
    this.newsletterInput = page.locator('input[name="newsletter-email"]');
    this.subscribeButton = page.locator('button[data-testid="subscribe-button"]');

    // WooCommerce navigation locators - stable with healing fallbacks
    this.extensionButton = page.locator('//button[@data-tracks-key="extensions"]//span')
      .or(page.locator('button[data-tracks-key="extensions"] span'))
      .or(page.getByRole('button', { name: /extensions/i }))
      .first();

    this.freeButton = page.locator('//a[@data-tracks-key="free"]')
      .or(page.locator('a[data-tracks-key="free"]'))
      .or(page.getByRole('link', { name: /free/i }))
      .first();

    this.wooPaymentsLink = page.locator('//a[normalize-space(text())="WooPayments"]')
      .or(page.getByRole('link', { name: 'WooPayments' }))
      .or(page.locator('a[href*="woopayments"]'))
      .first();

    this.addToCartButton = page.locator('//a[@aria-controls="cart-added-popover"]')
      .or(page.locator('a[aria-controls="cart-added-popover"]'))
      .or(page.getByRole('link', { name: /add to cart/i }))
      .nth(1);

    this.ordersButton = page.getByRole('link', { name: 'Orders', exact: true })
      .or(page.locator('a[href*="/my-account/orders"]'))
      .or(page.locator('//span[normalize-space(text())="Orders"]').locator('..'))
      .first();

    this.firstViewButton = page.locator('//a[contains(@class,"wccom-button view")]')
      .or(page.locator('a.wccom-button.view'))
      .or(page.getByRole('link', { name: 'View', exact: true }))
      .first();

    // WooCommerce checkout locators - stable with healing fallbacks
    this.cartIcon = page.locator('//a[@data-tracks-placement="header-cart"]')
      .or(page.locator('a[data-tracks-placement="header-cart"]'))
      .or(page.locator('[data-testid="cart-icon"]'))
      .first();

    this.proceedToCheckoutButton = page.locator('//div[normalize-space(text())="Proceed to Checkout"]')
      .or(page.getByRole('link', { name: /proceed to checkout/i }))
      .or(page.locator('a:has-text("Proceed to checkout")'))
      .or(page.locator('button:has-text("Proceed to checkout")'))
      .first();

    this.firstNameInput = page.locator('//label[contains(.,"First name *")]/following::input')
      .or(page.locator('label:has-text("First name") + input'))
      .or(page.locator('input[name="firstName"]'))
      .first();

    this.lastNameInput = page.locator('//label[contains(.,"Last name *")]/following::input')
      .or(page.locator('label:has-text("Last name") + input'))
      .or(page.locator('input[name="lastName"]'))
      .first();

    this.streetAddressInput = page.locator('//label[contains(.,"Street address *")]/following::input')
      .or(page.locator('label:has-text("Street address") + input'))
      .or(page.locator('input[name="streetAddress"]'))
      .first();

    this.townCityInput = page.locator('//label[contains(.,"Town / City *")]/following::input')
      .or(page.locator('label:has-text("Town") + input'))
      .or(page.locator('input[name="city"]'))
      .first();

    this.districtDropdown = page.locator('//span[@aria-label="District"]')
      .or(page.locator('span[aria-label="District"]'))
      .or(page.locator('[data-testid="district-dropdown"]'))
      .first();

    this.productUseDropdown = page.locator('//span[@role="combobox"]')
      .or(page.locator('span[role="combobox"]'))
      .nth(2);

    this.placeOrderButton = page.locator('//button[normalize-space(text())="Place free order"]')
      .or(page.locator('//div[@class="form-row place-order"]//button[1]'))
      .or(page.getByRole('button', { name: /place free order/i }))
      .or(page.locator('button:has-text("Place free order")'))
      .first();

    this.orderSuccessHeading = page.locator('//h1[normalize-space(text())="Thanks for your order!"]')
      .or(page.getByRole('heading', { name: /thanks for your order/i }))
      .or(page.locator('[data-testid="order-success"]'))
      .first();

    // Dynamic locator functions for dropdown options
    this.districtOption = (districtName: string) =>
      page.locator(`//li[normalize-space(text())="${districtName}"]`)
        .or(page.locator(`li:has-text("${districtName}")`))
        .or(page.locator(`option:has-text("${districtName}")`))
        .first();

    this.productUseOption = (optionName: string) =>
      page.locator(`//li[normalize-space(text())="${optionName}"]`)
        .or(page.locator(`li:has-text("${optionName}")`))
        .or(page.locator(`option:has-text("${optionName}")`))
        .first();
  }

  async open(): Promise<void> {
    await this.navigateTo('/');
    await this.waitForPageLoad();
  }

  async searchForProduct(productName: string): Promise<void> {
    await this.fill(this.searchInput, productName);
    await this.click(this.searchButton);
    await this.waitForPageLoad();
  }

  async clickLogo(): Promise<void> {
    await this.click(this.logo);
  }

  async isLogoVisible(): Promise<boolean> {
    return await this.isVisible(this.logo);
  }

  async getHeaderTitle(): Promise<string> {
    return await this.getInnerText(this.headerTitle);
  }

  async clickLoginButton(): Promise<void> {
    await this.click(this.loginButton);
  }

  async isLoginButtonVisible(): Promise<boolean> {
    return await this.isVisible(this.loginButton);
  }

  async isProfileMenuVisible(): Promise<boolean> {
    return await this.isVisible(this.profileMenu);
  }

  async clickProfileMenu(): Promise<void> {
    await this.click(this.profileMenu);
  }

  async navigateToMenuItem(menuItem: string): Promise<void> {
    const menuItemLocator = this.navigationMenu.locator(`text="${menuItem}"`);
    await this.click(menuItemLocator);
    await this.waitForPageLoad();
  }

  async isFeaturedSectionVisible(): Promise<boolean> {
    return await this.isVisible(this.featuredSection);
  }

  async getProductCardsCount(): Promise<number> {
    return await this.getElementCount(this.productCards);
  }

  async clickProductCardByIndex(index: number): Promise<void> {
    const productCard = this.productCards.nth(index);
    await this.click(productCard);
    await this.waitForPageLoad();
  }

  async getProductCardTitle(index: number): Promise<string> {
    const productCard = this.productCards.nth(index);
    const titleLocator = productCard.locator('h3, [data-testid="product-title"]');
    return await this.getInnerText(titleLocator);
  }

  async subscribeToNewsletter(email: string): Promise<void> {
    await this.scrollToElement(this.newsletterInput);
    await this.fill(this.newsletterInput, email);
    await this.click(this.subscribeButton);
  }

  async getFooterLinksCount(): Promise<number> {
    return await this.getElementCount(this.footerLinks);
  }

  async clickFooterLink(linkText: string): Promise<void> {
    const footerLink = this.footerLinks.filter({ hasText: linkText });
    await this.scrollToElement(footerLink);
    await this.click(footerLink);
  }

  async verifyHomePageLoaded(): Promise<void> {
    await this.verifyElementVisible(this.logo);
    await this.verifyElementVisible(this.navigationMenu);
    await this.verifyElementVisible(this.searchInput);
  }

  async verifyUserLoggedIn(): Promise<void> {
    await this.verifyElementVisible(this.profileMenu);
    await this.verifyElementHidden(this.loginButton);
  }

  async verifyFeaturedSectionDisplayed(): Promise<void> {
    await this.verifyElementVisible(this.featuredSection);
  }

  // WooCommerce navigation methods
  async clickExtensionButton(): Promise<void> {
    await this.click(this.extensionButton);
    await this.waitForDomContentLoaded();
  }

  async clickFreeButton(): Promise<void> {
    await this.click(this.freeButton);
    await this.waitForDomContentLoaded();
  }

  async clickWooPaymentsLink(): Promise<void> {
    await this.scrollToElement(this.wooPaymentsLink);
    await this.click(this.wooPaymentsLink);
    await this.waitForDomContentLoaded();
  }

  async clickAddToCart(): Promise<void> {
    await this.scrollToElement(this.addToCartButton);
    await this.click(this.addToCartButton);
    await this.waitForTimeout(3000); // Wait for cart update animation
  }

  async clickOrdersButton(): Promise<void> {
    await this.ordersButton.waitFor({ state: 'attached', timeout: 10000 });
    await this.ordersButton.click({ force: true });
    await this.waitForDomContentLoaded();
    await this.waitForTimeout(2000); // Wait for orders page to load
  }

  async clickFirstViewButton(): Promise<void> {
    await this.scrollToElement(this.firstViewButton);
    await this.click(this.firstViewButton);
    await this.waitForDomContentLoaded();
  }

  // WooCommerce checkout methods
  async clickCartIcon(): Promise<void> {
    await this.click(this.cartIcon);
    await this.waitForDomContentLoaded();
  }

  async clickProceedToCheckout(): Promise<void> {
    await this.scrollToElement(this.proceedToCheckoutButton);
    await this.click(this.proceedToCheckoutButton);
    await this.waitForDomContentLoaded();
  }

  async fillCheckoutForm(data: {
    firstName: string;
    lastName: string;
    streetAddress: string;
    townCity: string;
  }): Promise<void> {
    await this.fill(this.firstNameInput, data.firstName);
    await this.fill(this.lastNameInput, data.lastName);
    await this.fill(this.streetAddressInput, data.streetAddress);
    await this.fill(this.townCityInput, data.townCity);
  }

  async selectDistrict(districtName: string): Promise<void> {
    await this.scrollToElement(this.districtDropdown);
    await this.click(this.districtDropdown);
    await this.waitForTimeout(1000); // Wait for dropdown to open
    const option = this.districtOption(districtName);
    await this.waitForElement(option, 'visible');
    await this.click(option);
  }

  async selectProductUsage(usageOption: string): Promise<void> {
    await this.scrollToElement(this.productUseDropdown);
    await this.click(this.productUseDropdown);
    await this.waitForTimeout(1000); // Wait for dropdown to open
    const option = this.productUseOption(usageOption);
    await this.waitForElement(option, 'visible');
    await this.click(option);
  }

  async clickPlaceOrder(): Promise<void> {
    await this.scrollToElement(this.placeOrderButton);
    await this.click(this.placeOrderButton);
  }

  async isPlaceOrderButtonVisible(): Promise<boolean> {
    try {
      return await this.placeOrderButton.isVisible({ timeout: 5000 });
    } catch {
      return false;
    }
  }

  async verifyOrderSuccess(): Promise<void> {
    await this.waitForElement(this.orderSuccessHeading, 'visible');
    await this.verifyElementVisible(this.orderSuccessHeading);
    await this.verifyElementHasText(this.orderSuccessHeading, 'Thanks for your order!');
  }

  async isOrderSuccessVisible(): Promise<boolean> {
    return await this.isVisible(this.orderSuccessHeading);
  }
}
