"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryService = void 0;
const axios_1 = __importDefault(require("./axios"));
exports.categoryService = {
    getAll: async () => {
        const response = await axios_1.default.get('/categories');
        return response.data;
    },
    create: async (data) => {
        const response = await axios_1.default.post('/categories', data);
        return response.data;
    }
};
