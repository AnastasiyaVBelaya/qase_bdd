import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from './fixtures';
import { generateString } from '../utils/randomData';
import { CreateProjectPage } from '../pages/CreateProjectPage';

const { When, Then } = createBdd(test);

When('I create a new project with random data', async ({ page, projectsPage, state, scenarioContext }) => {
    const title = generateString();
    const code = generateString();

    await projectsPage.openCreateProjectForm();
    
    state.createProjectPage = new CreateProjectPage(page);
    await expect(state.createProjectPage.modalTitle).toBeVisible();
    await state.createProjectPage.fillTitle(title);
    await state.createProjectPage.fillCode(code);
    await state.createProjectPage.submit();

    scenarioContext.projectTitle = title;
    scenarioContext.projectCode = code;
});

Then('I see the new project in the list', async ({ page, scenarioContext }) => {
    await expect(page.getByText(scenarioContext.projectTitle!)).toBeVisible();
});