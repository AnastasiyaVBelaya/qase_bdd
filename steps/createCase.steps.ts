import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from './fixtures';
import * as endpoints from '../constants/endpoints';
import { HTTP_STATUS } from '../constants/httpStatus';
import { closeAidenDialog } from '../utils/dialogs';
import { CreateCasePage } from '../pages/CreateCasePage';

const { When, Then } = createBdd(test);

When('I create a new test case with title {string}', async ({ page, state, scenarioContext }, title: string) => {
    await closeAidenDialog(page);
    await page.getByRole('button', { name: 'Manual test' }).click();
    await page.getByRole('menuitem', { name: 'Create manually' }).click();

    state.createCasePage = new CreateCasePage(page);
    await state.createCasePage.fillTitle(title);
    scenarioContext.caseTitle = title;
});

When('I select priority {string}', async ({ state }, value: string) => {
    await state.createCasePage!.selectPriority(value);
});

When('I select severity {string}', async ({ state }, value: string) => {
    await state.createCasePage!.selectSeverity(value);
});

When('I select type {string}', async ({ state }, value: string) => {
    await state.createCasePage!.selectType(value);
});

When('I select layer {string}', async ({ state }, value: string) => {
    await state.createCasePage!.selectLayer(value);
});

When('I select behavior {string}', async ({ state }, value: string) => {
    await state.createCasePage!.selectBehavior(value);
});

When('I enable the {string} checkbox', async ({ state }, checkboxName: string) => {
    await state.createCasePage!.enableAutomation();
});

When('I add the following steps to the test case:', async ({ state }, dataTable) => {
    const rows = dataTable.hashes();
    for (const row of rows) {
        await state.createCasePage!.addStep(row.action, row.data, row.expected);
    }
});

When('I attach file {string} to step {int}', async ({ state }, fileName: string, stepNumber: number) => {
    await state.createCasePage!.uploadAttachment(`test-files/${fileName}`, stepNumber);
});

When('I submit the test case', async ({ page, state, scenarioContext }) => {
    const responsePromise = page.waitForResponse(
        (response) => {
            const url = response.url();
            return url.includes(endpoints.CASES_SAVE_FORM) && 
                   response.status() === HTTP_STATUS.OK;
        },
        { timeout: 60000 }
    );

    await state.createCasePage!.save();

    const response = await responsePromise;
    const data = await response.json();
    scenarioContext.caseId = data.result?.id;
});

Then('I see the test case in the list', async ({ page, scenarioContext }) => {
    await expect(page.getByText(scenarioContext.caseTitle!).first()).toBeVisible();
});

When('I click on the created test case', async ({ page, scenarioContext }) => {
    const caseId = `${scenarioContext.projectCode}-1`;
    await page.locator(`a:has-text("${caseId}")`).first().click();
});

Then('the test case is created via API', async ({ page, scenarioContext }) => {
    const response = await page.waitForResponse(
        (res) => res.url().includes(endpoints.CASES_LOAD_API) && res.status() === HTTP_STATUS.OK,
        { timeout: 30000 }
    );

    const data = await response.json();
    expect(data.status).toBe(true);
    expect(data.case.title).toBe(scenarioContext.caseTitle);
});