import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from './fixtures';
import * as endpoints from '../constants/endpoints';
import { HTTP_STATUS } from '../constants/httpStatus';
import * as messages from '../constants/messages';
import * as testData from '../constants/testData';
import * as titles from '../constants/titles';

const { Given, When, Then } = createBdd(test);

Given('I am on the login page', async ({ loginPage }) => {
  await loginPage.goto();
});

When('I login with valid credentials', async ({ loginPage, page, credentials }) => {
  const [response] = await Promise.all([
        page.waitForResponse(
            (response) =>
                response.url().includes(endpoints.PROJECTS_FILTERS_API_PATH) &&
                response.status() === HTTP_STATUS.OK
        ),
        loginPage.login(credentials.email, credentials.password),
    ]);
    await page.waitForLoadState('domcontentloaded');
});

Then('I am redirected to the projects page', async ({ page }) => {
  const escapedUrl = endpoints.PROJECTS_PAGE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  await expect(page).toHaveURL(new RegExp(`^${escapedUrl}(\\?.*)?$`));
});

Then('I see the projects page title', async ({ projectsPage }) => {
  await expect(projectsPage.title).toHaveText(titles.PROJECTS);
});

When('I login with invalid credentials', async ({ loginPage, page, credentials }) => {
  const [response] = await Promise.all([
        page.waitForResponse(
            (response) =>
                response.url().includes(endpoints.LOGIN_API_PATH) &&
                response.status() === HTTP_STATUS.UNAUTHORIZED
        ),
        loginPage.login(credentials.email, credentials.password + testData.INVALID_PASSWORD_SUFFIX),
    ]);
    await page.waitForLoadState('domcontentloaded');
});

Then('I see an error message', async ({ loginPage }) => {
  const errorText = await loginPage.getErrorMessage();
  expect(errorText).toContain(messages.INVALID_CREDENTIALS);
});

Then('I remain on the login page', async ({ page }) => {
  await expect(page).toHaveURL(endpoints.LOGIN_PAGE);
});