import api from './api';

export const ecosystemService = {
    getStats: async () => {
        const response = await api.get('/ecosystem/stats');
        return response.data; // { success: true, data: { nodes, livestream_rate, signals, opportunities } }
    }
};
