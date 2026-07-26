import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from './fixtures';
import * as endpoints from '../constants/endpoints';
import * as messages from '../constants/messages';
import * as testData from '../constants/testData';
import * as titles from '../constants/titles';

const { Given, When, Then } = createBdd(test);

Given('I am on the login page', async ({ loginPage }) => {
  await loginPage.goto();
});

When('I login with valid credentials', async ({ loginPage, credentials }) => {
  const responsePromise = loginPage.waitForLoginSuccess();
  await loginPage.login(credentials.email, credentials.password);
  await responsePromise;
});

Then('I am redirected to the projects page', async ({ page }) => {
  const escapedUrl = endpoints.PROJECTS_PAGE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  await expect(page).toHaveURL(new RegExp(`^${escapedUrl}(\\?.*)?$`));
});

Then('I see the projects page title', async ({ projectsPage }) => {
  await expect(projectsPage.title).toHaveText(titles.PROJECTS);
});

When('I login with invalid credentials', async ({ loginPage, credentials }) => {
  const responsePromise = loginPage.waitForLoginFailure();
  const invalidPassword = credentials.password + testData.INVALID_PASSWORD_SUFFIX;
  await loginPage.login(credentials.email, invalidPassword);
  await responsePromise;
});

Then('I see an error message', async ({ loginPage }) => {
  const errorText = await loginPage.getErrorMessage();
  expect(errorText).toContain(messages.INVALID_CREDENTIALS);
});

Then('I remain on the login page', async ({ page }) => {
  await expect(page).toHaveURL(endpoints.LOGIN_PAGE);
});
