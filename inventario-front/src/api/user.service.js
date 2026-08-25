"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const axios_1 = __importDefault(require("./axios"));
exports.userService = {
    async getAll() {
        const response = await axios_1.default.get('/users');
        return response.data;
    },
    async create(userData) {
        const response = await axios_1.default.post('/users', userData);
        return response.data;
    },
    async update(id, userData) {
        const response = await axios_1.default.put(`/users/${id}`, userData);
        return response.data;
    },
    async delete(id) {
        await axios_1.default.delete(`/users/${id}`);
    },
};
