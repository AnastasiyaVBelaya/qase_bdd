import { type Locator, type Page, type Response } from '@playwright/test';
import * as endpoints from '../constants/endpoints';
import {HTTP_STATUS} from '../constants/httpStatus';
import { blockCookieBanner } from '../utils/dialogs';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly errorMessage: Locator;
  
  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('[name="email"]');
    this.passwordInput = page.locator('[name="password"]');
    this.signInButton = page.locator('button[type="submit"]');
    this.errorMessage = page.getByRole('alert').first();
  }

  async goto(): Promise<void> {
    await blockCookieBanner(this.page);
    await this.page.goto(endpoints.LOGIN_PAGE);
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async waitForLoginSuccess(): Promise<Response> {
    return this.page.waitForResponse(
      (response) =>
        response.url().includes(endpoints.PROJECTS_FILTERS_API_PATH) &&
        response.status() === HTTP_STATUS.OK
    );
  }
  
    async waitForLoginFailure(): Promise<Response> {
      return this.page.waitForResponse(
        (response) =>
        response.url().includes(endpoints.LOGIN_API_PATH) &&
        response.status() === HTTP_STATUS.UNAUTHORIZED
    );
  }

  async getErrorMessage(): Promise<string | null> {
    return await this.errorMessage.textContent();
  }
}