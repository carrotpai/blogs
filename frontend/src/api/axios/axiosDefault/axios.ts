import axios from 'axios';

const axiosDefault = axios.create({
	baseURL: 'http://localhost:3000/api/',
});

export default axiosDefault;
