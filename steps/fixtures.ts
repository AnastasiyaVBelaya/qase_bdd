import { test as base } from 'playwright-bdd';
import { LoginPage } from '../pages/LoginPage';
import { ProjectsPage } from '../pages/ProjectsPage';
import { CreateProjectPage } from '../pages/CreateProjectPage';
import { CreateSuitePage } from '../pages/CreateSuitePage';
import { CreateCasePage } from '../pages/CreateCasePage';
import { deleteProject } from '../api/projectApi';
import { handleAIResponse } from '../utils/aiAlerts';

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

type PageObjects = {
    createProjectPage?: CreateProjectPage;
    createSuitePage?: CreateSuitePage;
    createCasePage?: CreateCasePage;
};

type Fixtures = {
    credentials: Credentials;
    loginPage: LoginPage;
    projectsPage: ProjectsPage;
    scenarioContext: ScenarioContext;
    state: PageObjects;
};

const AI_MOCK_PATTERNS = ['**/ai/**', '**/aiden/**'];
const BLOCKED_PATTERNS = [
    '**/analytics/**',
    '**/intercom/**',
    '**/hubspot/**',
    '**/*usercentrics*/**',
];

export const test = base.extend<Fixtures>({
    page: async ({ browser }, use) => {
        const context = await browser.newContext({
            storageState: undefined,
            ignoreHTTPSErrors: true,
        });
        const page = await context.newPage();

        for (const pattern of AI_MOCK_PATTERNS) {
            await page.route(pattern, async (route) => {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ status: true, data: [] }),
                });
            });
        }

        for (const pattern of BLOCKED_PATTERNS) {
            await page.route(pattern, route => route.abort());
        }

        page.on('response', async (response) => {
            await handleAIResponse(page, response.url(), response.status());
        });

        await use(page);
        await context.close();
    },

    credentials: async ({ }, use) => {
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

    scenarioContext: async ({ }, use) => {
        const context: ScenarioContext = {};
        await use(context);
        if (context.projectCode) {
            await deleteProject(context.projectCode);
        }
    },

    state: async ({ }, use) => {
        await use({});
    },
});