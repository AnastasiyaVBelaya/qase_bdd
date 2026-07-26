import { deleteAllProjects } from './api/projectApi';

async function globalSetup() {
  await deleteAllProjects();
}

export default globalSetup;