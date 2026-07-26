import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from './fixtures';
import { getAllSuites } from '../api/suiteApi';
import { CreateSuitePage } from '../pages/CreateSuitePage';

const { When, Then } = createBdd(test);

When('I create a new suite with random data', async ({ page, state, scenarioContext }) => {
    const suiteTitle = `Suite ${Date.now()}`;
    scenarioContext.suiteTitle = suiteTitle;

    await page.getByRole('button', { name: 'Create new suite' }).click();

    state.createSuitePage = new CreateSuitePage(page);
    await expect(state.createSuitePage.titleInput).toBeVisible();

    await state.createSuitePage.fillTitle(suiteTitle);
    await state.createSuitePage.submit();

});

Then('I see the new suite in the list', async ({ page, scenarioContext }) => {
    await expect(page.getByText(scenarioContext.suiteTitle!).first()).toBeVisible();
});

Then('the suite is created via API', async ({ scenarioContext }) => {
    const suites = await getAllSuites(scenarioContext.projectCode!);
    const created = suites.find(s => s.title === scenarioContext.suiteTitle);
    expect(created).toBeDefined();
});