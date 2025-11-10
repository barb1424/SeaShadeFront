import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080', 
});

apiClient.interceptors.request.use(
  (config) => {
    // Pega o objeto 'user' do localStorage
    const userString = localStorage.getItem('user');
    
    if (userString) {
      const user = JSON.parse(userString);
      
      const token = user.accessToken; 

      // Se o token existir, adiciona ao cabeçalho da requisição
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    // Em caso de erro na configuração da requisição
    return Promise.reject(error);
  }
);

export default apiClient;
