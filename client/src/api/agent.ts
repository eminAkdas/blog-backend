import axios, { type AxiosResponse } from 'axios';
import { type Post, type Category, type CreatePost, type UpdatePost, type UserLogin, type UserRegister } from '../types/models';

const agent = axios.create({
    baseURL: 'https://blog-backend-t5fx.onrender.com/api' // Portuna dikkat!
});

// Request Interceptor: Her istekten önce çalışır
agent.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Response'un içindeki "data" kısmını otomatik almak için yardımcı
const responseBody = <T>(response: AxiosResponse<T>) => response.data;

// Ortak HTTP İstek Fonksiyonları
const requests = {
    get: <T>(url: string) => agent.get<T>(url).then(responseBody),
    post: <T>(url: string, body: object) => agent.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: object) => agent.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => agent.delete<T>(url).then(responseBody),
};

// Modüllere göre istekler
const Posts = {
    list: () => requests.get<Post[]>('/Posts'),
    details: (id: string) => requests.get<Post>(`/Posts/${id}`),
    create: (post: CreatePost) => requests.post<void>('/Posts', post),
    update: (id: string, post: UpdatePost) => requests.put<void>(`/Posts/${id}`, post),
    delete: (id: string) => requests.del<void>(`/Posts/${id}`),
};

const Categories = {
    list: () => requests.get<Category[]>('/Categories'),
};

const Auth = {
    login: (user: UserLogin) => requests.post<string>('/Auth/login', user),
    register: (user: UserRegister) => requests.post<{ userId: number }>('/Auth/register', user),
};

const agentObj = {
    Posts,
    Categories,
    Auth
};

export default agentObj;