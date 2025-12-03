# Playwright Automation Framework

A professional test automation framework built with Playwright, TypeScript, and Page Object Model (POM) pattern.

## Features

- **Playwright Test Framework**: Latest Playwright testing capabilities
- **TypeScript**: Type-safe code with modern JavaScript features
- **Page Object Model (POM)**: Maintainable and reusable page objects
- **OOP Design**: Class-based architecture with inheritance
- **Reusable BasePage**: Common methods for all page objects
- **Multi-Environment Support**: Dev, Stage, Production, and Test environments
- **Authenticated State**: Login once, reuse session across tests
- **Parallel Execution**: Run tests concurrently for faster results
- **Rich Reporting**: HTML, JSON, and list reporters
- **Cross-Browser Testing**: Chrome, Firefox, Safari, and mobile browsers

## Project Structure

```
playwright-automation-framework/
├── src/
│   ├── pages/              # Page Object Model classes
│   │   ├── base.page.ts    # Base page with reusable methods
│   │   └── home.page.ts    # Home page object
│   ├── tests/              # Test files
│   │   ├── auth.setup.ts   # Authentication setup
│   │   └── home.test.ts    # Home page tests
│   ├── utils/              # Utility functions
│   └── env/                # Environment configuration
│       └── env.config.ts   # Environment loader
├── auth/                   # Authentication state
│   └── auth.json           # Stored session (generated)
├── env/                    # Environment variables
│   ├── .env                # Default environment variables
│   ├── .env.dev            # Development environment
│   ├── .env.stage          # Staging environment
│   ├── .env.production     # Production environment
│   └── .env.test           # Test environment
├── playwright.config.ts    # Playwright configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd playwright-automation-framework
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

## Configuration

### Environment Setup

The framework supports multiple environments. Configure your environment variables in the respective `.env` files located in the `env/` folder:

- `env/.env` - Default configuration
- `env/.env.dev` - Development environment
- `env/.env.stage` - Staging environment
- `env/.env.production` - Production environment
- `env/.env.test` - Test environment

Example `env/.env` file:
```bash
ENV=dev
BASE_URL=https://dev.example.com
TEST_USERNAME=test@example.com
TEST_PASSWORD=testpassword123
HEADLESS=true
WORKERS=4
```

### Authentication Setup

Before running tests, you need to set up authentication:

1. Update credentials in your `env/.env` file or environment-specific file
2. Run the authentication setup:
```bash
npm run auth:setup
```

This will:
- Log in to your application
- Save the authenticated session to `auth/auth.json`
- Allow tests to skip login and use the saved session

## Running Tests

### Basic Test Execution

Run all tests:
```bash
npm test
```

Run tests in headed mode:
```bash
npm run test:headed
```

Run tests with UI mode:
```bash
npm run test:ui
```

Run tests in debug mode:
```bash
npm run test:debug
```

### Environment-Specific Execution

Run tests on development environment:
```bash
npm run test:dev
```

Run tests on staging environment:
```bash
npm run test:stage
```

Run tests on production environment:
```bash
npm run test:prod
```

### Advanced Options

Run specific test file:
```bash
npx playwright test src/tests/home.test.ts
```

Run tests by grep pattern:
```bash
npx playwright test --grep "should load home page"
```

Run tests on specific browser:
```bash
npx playwright test --project=chromium
```

Run tests with specific number of workers:
```bash
npx playwright test --workers=2
```

## Viewing Test Reports

Generate and open HTML report:
```bash
npm run test:report
```

The report will automatically open in your browser showing:
- Test results
- Screenshots on failures
- Videos on failures
- Trace files for debugging

## Writing Tests

### Example Test File

```typescript
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';

test.describe('Home Page Tests', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.open();
  });

  test('should load home page successfully', async () => {
    await homePage.verifyHomePageLoaded();
  });

  test('should search for a product', async () => {
    await homePage.searchForProduct('laptop');
    const currentURL = await homePage.getURL();
    expect(currentURL).toContain('search');
  });
});
```

### Creating Page Objects

1. Extend the `BasePage` class
2. Define locators in the constructor
3. Create methods for page interactions
4. Add verification methods

Example:
```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
  }

  async login(email: string, password: string): Promise<void> {
    await this.fill(this.emailInput, email);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  async verifyLoginPageLoaded(): Promise<void> {
    await this.verifyElementVisible(this.emailInput);
    await this.verifyElementVisible(this.passwordInput);
  }
}
```

## BasePage Methods

The `BasePage` class provides reusable methods:

### Navigation
- `navigateTo(path)`
- `reload()`
- `goBack()`
- `goForward()`

### Interactions
- `click(locator)`
- `fill(locator, text)`
- `hover(locator)`
- `selectOption(locator, value)`
- `checkCheckbox(locator)`
- `uncheckCheckbox(locator)`

### Waits
- `waitForElement(locator, state)`
- `waitForPageLoad()`
- `waitForTimeout(timeout)`

### Getters
- `getText(locator)`
- `getTitle()`
- `getURL()`
- `getAttribute(locator, attribute)`
- `getElementCount(locator)`

### Verifications
- `verifyElementVisible(locator)`
- `verifyElementHidden(locator)`
- `verifyElementContainsText(locator, text)`
- `verifyPageTitle(title)`
- `verifyURL(url)`

## Best Practices

1. **Use Page Object Model**: Keep locators and page logic in page objects
2. **Reuse BasePage Methods**: Don't reinvent common operations
3. **Independent Tests**: Each test should be able to run independently
4. **Descriptive Names**: Use clear, descriptive names for tests and methods
5. **Data-Driven Tests**: Use environment variables for test data
6. **Assertions**: Use Playwright's built-in assertions
7. **Screenshots**: Let framework handle screenshots on failures
8. **Parallel Execution**: Write tests that can run in parallel

## Troubleshooting

### Tests are failing due to missing auth.json
Run the authentication setup:
```bash
npm run auth:setup
```

### Tests are timing out
- Increase timeout in `env/.env` file
- Check if selectors are correct
- Verify BASE_URL is accessible

### Environment variables not loading
- Ensure .env files exist in the `env/` folder
- Check ENV variable is set correctly
- Verify no typos in variable names

### Browsers not installed
```bash
npx playwright install
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      - name: Run Playwright tests
        run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Add/update tests
4. Submit a pull request

## License

ISC
# WooCommerce-Test-Scenarios
