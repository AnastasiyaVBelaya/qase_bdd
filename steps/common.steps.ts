import { createBdd } from 'playwright-bdd';
import { test } from './fixtures';
import { generateString  } from '../utils/randomData';
import { createProject } from '../api/projectApi';
import { createSuite } from '../api/suiteApi';


const { When } = createBdd(test);

When('I create a project via API', async ({ scenarioContext }) => {
    scenarioContext.projectTitle = generateString ();
    scenarioContext.projectCode = generateString ();
    await createProject(scenarioContext.projectTitle, scenarioContext.projectCode);
});

When('I create a suite via API', async ({ scenarioContext }) => {
    const suiteTitle = generateString();
    scenarioContext.suiteTitle = suiteTitle;
    scenarioContext.suiteId = await createSuite(scenarioContext.projectCode!, suiteTitle);
});

When('I navigate to the project', async ({ projectsPage, page, scenarioContext }) => {
    await projectsPage.openProject(scenarioContext.projectCode!);

});

When('I navigate to the suite', async ({ page, scenarioContext }) => {

    await page.getByText(scenarioContext.suiteTitle!).first().click();
    await page.getByRole('heading', { name: scenarioContext.suiteTitle! }).waitFor({ state: 'visible' });
});