import axios from 'axios';

const api = axios.create({
    //Local
    baseURL: 'http://localhost:3333/',
    
    //Amazon
    //baseURL: 'https://api-cesbe.moondu.in/',
	
	//Producao
    //baseURL: 'https://docflow-api.cesbe.com.br',
    // baseURL: 'http://docflow-api.cesbe.com.br:3333',
})

export default api;