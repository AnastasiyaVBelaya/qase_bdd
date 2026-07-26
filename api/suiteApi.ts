import { apiClient } from './apiClient';
import * as endpoints from '../constants/endpoints';

export const createSuite = async (
    projectCode: string,
    title: string
): Promise<number> => {
    const response = await apiClient.post(`${endpoints.SUITES_ENDPOINT}/${projectCode}`, { title });
    return response.data?.result?.id;
};

export const getAllSuites = async (projectCode: string): Promise<any[]> => {
    const response = await apiClient.get(`${endpoints.SUITES_ENDPOINT}/${projectCode}`);
    return response.data?.result?.entities ?? [];
};

export const getSuite = async (projectCode: string, suiteId: number): Promise<any> => {
    const response = await apiClient.get(`${endpoints.SUITES_ENDPOINT}/${projectCode}/${suiteId}`);
    return response.data?.result;
};