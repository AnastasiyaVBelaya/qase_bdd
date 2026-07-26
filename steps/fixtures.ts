import { test as base } from 'playwright-bdd';
import { LoginPage } from '../pages/LoginPage';
import { ProjectsPage } from '../pages/ProjectsPage';
import { CreateProjectPage } from '../pages/CreateProjectPage';
import { CreateSuitePage } from '../pages/CreateSuitePage';
import { CreateCasePage } from '../pages/CreateCasePage';
import { deleteProject } from '../api/projectApi';

type Credentials = {
    email: string;
    password: string;
};

type ScenarioContext = {
    projectTitle?: string;
    projectCode?: string;
    suiteTitle?: string;
    suiteId?: number;
    caseTitle?: string;
    caseId?: number;
};

type State = {
    createProjectPage?: CreateProjectPage;
    createSuitePage?: CreateSuitePage;
    createCasePage?: CreateCasePage;
};

type Fixtures = {
    credentials: Credentials;
    loginPage: LoginPage;
    projectsPage: ProjectsPage;
    scenarioContext: ScenarioContext;
    state: State;
};

export const test = base.extend<Fixtures>({
    credentials: async ({}, use) => {

        await use({
            email: process.env.USER_EMAIL!,
            password: process.env.USER_PASSWORD!,
        });
    },

    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    projectsPage: async ({ page }, use) => {
        await use(new ProjectsPage(page));
    },
    
    scenarioContext: async ({}, use) => {
        const context: ScenarioContext = {};
        await use(context);
        if (context.projectCode) {
            await deleteProject(context.projectCode);
        }
    },

    state: async ({}, use) => {
        await use({});
    },
});