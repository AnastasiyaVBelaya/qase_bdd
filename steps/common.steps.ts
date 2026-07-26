import { createBdd } from 'playwright-bdd';
import { test } from './fixtures';
import { generateProjectCode, generateProjectTitle } from '../utils/randomData';
import { createProject } from '../api/projectApi';
import { createSuite } from '../api/suiteApi';
import { closeAidenDialog } from '../utils/dialogs';

const { When } = createBdd(test);

When('I create a project via API', async ({ scenarioContext }) => {
    scenarioContext.projectTitle = generateProjectTitle();
    scenarioContext.projectCode = generateProjectCode();
    await createProject(scenarioContext.projectTitle, scenarioContext.projectCode);
});

When('I create a suite via API', async ({ scenarioContext }) => {
    const suiteTitle = `Suite ${Date.now()}`;
    scenarioContext.suiteTitle = suiteTitle;
    scenarioContext.suiteId = await createSuite(scenarioContext.projectCode!, suiteTitle);
});

When('I navigate to the project', async ({ projectsPage, page, scenarioContext }) => {
    await projectsPage.openProject(scenarioContext.projectCode!);
    await closeAidenDialog(page);
});

When('I navigate to the suite', async ({ page, scenarioContext }) => {
    await closeAidenDialog(page);
    await page.getByText(scenarioContext.suiteTitle!).first().click();
    await page.waitForTimeout(2000);
});