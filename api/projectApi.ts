import { apiClient } from './apiClient';
import * as endpoints from '../constants/endpoints';
import { HTTP_STATUS } from '../constants/httpStatus';

export type QaseProject = {
    code: string;
    title: string;
};

export const createProject = async (title: string, code: string): Promise<QaseProject> => {
    const response = await apiClient.post(endpoints.PROJECTS_ENDPOINT, { title, code });
    return {
        code: response.data.result.code,
        title,
    };
};

export const getAllProjects = async (): Promise<QaseProject[]> => {
    const response = await apiClient.get(endpoints.PROJECTS_ENDPOINT, {
        params: { limit: 100 }
    });
    return response.data?.result?.entities ?? [];
};

export const deleteProject = async (code: string): Promise<void> => {
    try {
        await apiClient.delete(`${endpoints.PROJECTS_ENDPOINT}/${code}`);
    } catch (error: any) {
        if (error.response?.status === HTTP_STATUS.NOT_FOUND) return;
        throw error;
    }
};

export const deleteAllProjects = async (): Promise<void> => {
    const projects = await getAllProjects();
    await Promise.all(projects.map(p => deleteProject(p.code)));
};