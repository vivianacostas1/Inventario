"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const axios_1 = __importDefault(require("./axios"));
exports.authService = {
    async login(credentials) {
        const response = await axios_1.default.post('/auth/login', credentials);
        // 👇 GUARDA EL TOKEN AQUÍ AUTOMÁTICAMENTE 👇
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },
    async logout() {
        localStorage.removeItem('token'); // Limpia también el token al salir
        await axios_1.default.post('/auth/logout');
    },
    async getProfile() {
        const response = await axios_1.default.get('/auth/profile');
        return response.data;
    },
};
