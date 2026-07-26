import axios from 'axios';
import { PUBLIC_API_BASE_URL } from '../constants/endpoints';
import { API_TOKEN_MISSING } from '../constants/messages';

const API_TOKEN = process.env.API_TOKEN;

if (!API_TOKEN) {
    throw new Error(API_TOKEN_MISSING);
}

export const apiClient = axios.create({
  baseURL: PUBLIC_API_BASE_URL,
  headers: {
    'Token': API_TOKEN,
    'Content-Type': 'application/json',
  },
});