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

    state.createCasePage = new CreateCasePage(page);
    await state.createCasePage!.openCreateCaseForm();
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

    await closeAidenDialog(page);
});

Then('I see the test case in the list', async ({ page, scenarioContext }) => {
    await expect(page.getByText(scenarioContext.caseTitle!).first()).toBeVisible();
});

Then('the test case is created via API', async ({ page, scenarioContext }) => {
    // 1. Гарантированно закрываем модальные окна
    await closeAidenDialog(page);
    
    const caseId = `${scenarioContext.projectCode}-1`;
    
    // 2. Устанавливаем слушатель ДО клика. 
    // Фильтруем по ID кейса в URL и методу GET
    const responsePromise = page.waitForResponse(
        (res) => res.url().includes(caseId) && 
                 res.request().method() === 'GET' && 
                 res.status() === HTTP_STATUS.OK
    );
    
    // 3. Кликаем по ссылке на кейс (используем href для точности)
    await page.locator(`a[href="/case/${caseId}"]`).first().click();

    // 4. Ждем ответ и парсим JSON
    const response = await responsePromise;
    const data = await response.json();
    
    // 5. Валидация API ответа согласно предоставленной структуре
    expect(data.status).toBe(true);
    expect(data.case.title).toBe(scenarioContext.caseTitle);
    
    // 6. Валидация в UI (ждем появления заголовка в боковой панели)
    await expect(page.getByRole('heading', { name: scenarioContext.caseTitle! })).toBeVisible({ timeout: 10000 });
});