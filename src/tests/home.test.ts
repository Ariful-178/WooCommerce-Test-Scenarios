import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';



test.describe('woocommerce', () => {

  test('should complete WooCommerce checkout flow from Extensions to Order Confirmation', async ({ page }) => {
    test.setTimeout(90000); // Increase timeout to 90 seconds
    // Initialize page object
    const homePage = new HomePage(page);

    // Test data
    const checkoutData = {
      firstName: 'John',
      lastName: 'Doe',
      streetAddress: '123 Main Street',
      townCity: 'Dhaka',
      district: 'Bagerhat',
      productUsage: 'Other'
    };

    // Step 1: Navigate to BASE_URL
    // Authentication is automatically loaded from auth.json via playwright.config.ts
    await homePage.open();
    console.log('✓ Navigated to BASE_URL with auth state loaded');

    // Step 2: Click Extensions button
    await homePage.clickExtensionButton();
    console.log('✓ Clicked Extensions button');

    // Step 3: Click Free category
    await homePage.clickFreeButton();
    console.log('✓ Clicked Free button');

    // Step 4: Click WooPayments product
    await homePage.clickWooPaymentsLink();
    console.log('✓ Clicked WooPayments link');

    // Step 5: Click Add to Cart
    await homePage.clickAddToCart();
    console.log('✓ Clicked Add to Cart button');

    // Step 6: Click cart icon
    await homePage.clickCartIcon();
    console.log('✓ Clicked Cart icon');

    // Step 7: Click Proceed to Checkout
    await homePage.clickProceedToCheckout();
    console.log('✓ Clicked Proceed to Checkout');

    // Step 8: Wait for checkout page to load
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000); // Wait for checkout page to fully load

    // Note: Billing address is pre-filled from user profile, no need to fill form
    // Check if form fields exist or if address is pre-filled
    const isPlaceOrderVisible = await homePage.isPlaceOrderButtonVisible();

    if (isPlaceOrderVisible) {
      console.log('✓ Checkout page loaded with pre-filled billing address');
    } else {
      // If form fields are visible, fill them
      await homePage.fillCheckoutForm(checkoutData);
      console.log('✓ Filled billing information');
      await homePage.selectDistrict(checkoutData.district);
      console.log(`✓ Selected District: ${checkoutData.district}`);
      await homePage.selectProductUsage(checkoutData.productUsage);
      console.log(`✓ Selected Product Usage: ${checkoutData.productUsage}`);
    }

    // Step 9: Click Place Order button
    await page.waitForTimeout(1000); // Brief wait before placing order
    await homePage.clickPlaceOrder();
    console.log('✓ Clicked Place Free Order button');

    // Step 12: Verify order success
    await homePage.verifyOrderSuccess();
    console.log('✓ Order confirmation message verified');

    // Additional assertion for success message visibility
    const isSuccessVisible = await homePage.isOrderSuccessVisible();
    expect(isSuccessVisible).toBe(true);
    console.log('✓ Test completed successfully: WooCommerce checkout flow verified');
  });

  test('should navigate to Orders and view first order', async ({ page }) => {
    test.setTimeout(60000); // Increase timeout to 60 seconds
    // Initialize page object
    const homePage = new HomePage(page);

    // Step 1: Navigate to BASE_URL
    await homePage.open();
    console.log('✓ Navigated to BASE_URL with auth state loaded');

    // Step 2: Click Orders button
    await homePage.clickOrdersButton();
    console.log('✓ Clicked Orders button');

    // Step 3: Click first View button
    await homePage.clickFirstViewButton();
    console.log('✓ Clicked first View button');

    // Wait to see the order details page
    await page.waitForTimeout(2000);
    console.log('✓ Order details page loaded');
  });



  
});


