import { apiClient } from './apiClient';
import * as endpoints from '../constants/endpoints';

export type QaseCase = {
    id: number;
    title: string;
};

export const getTestCase = async (projectCode: string, caseId: number): Promise<QaseCase> => {
    const response = await apiClient.get(`${endpoints.CASES_ENDPOINT}/${projectCode}/${caseId}`);
    return response.data?.result;
};