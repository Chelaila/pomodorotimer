import axios from 'axios';
import { TimerConfig } from '../types/timer';

const API_URL = '/api/timer-configs';

export const timerService = {
  async getActiveConfig(): Promise<TimerConfig> {
    const response = await axios.get<TimerConfig>(`${API_URL}/active`);
    return response.data;
  },

  async getAllConfigs(): Promise<TimerConfig[]> {
    const response = await axios.get<TimerConfig[]>(API_URL);
    return response.data;
  },

  async createConfig(config: Partial<TimerConfig>): Promise<TimerConfig> {
    const response = await axios.post<TimerConfig>(API_URL, config);
    return response.data;
  },

  async updateConfig(id: string, config: Partial<TimerConfig>): Promise<TimerConfig> {
    const response = await axios.put<TimerConfig>(`${API_URL}/${id}`, config);
    return response.data;
  },

  async setActiveConfig(id: string): Promise<TimerConfig> {
    const response = await axios.put<TimerConfig>(`${API_URL}/${id}/activate`);
    return response.data;
  },

  async deleteConfig(id: string): Promise<void> {
    await axios.delete(`${API_URL}/${id}`);
  }
}; 