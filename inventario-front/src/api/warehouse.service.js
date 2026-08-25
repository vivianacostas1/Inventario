"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.warehouseService = void 0;
const axios_1 = __importDefault(require("./axios"));
exports.warehouseService = {
    async getAll() {
        const response = await axios_1.default.get('/warehouses');
        return response.data;
    },
    async create(data) {
        const response = await axios_1.default.post('/warehouses', data);
        return response.data;
    },
    async update(id, data) {
        const response = await axios_1.default.put(`/warehouses/${id}`, data);
        return response.data;
    },
    async delete(id) {
        await axios_1.default.delete(`/warehouses/${id}`);
    },
};
