"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const api = axios_1.default.create({
    baseURL: 'http://localhost:3000/api', // Cambia 4000 por 3000
});
// Interceptor para agregar el token JWT automáticamente a cada petición
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // O la clave con la que guardes tu token al hacer login
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
exports.default = api;
