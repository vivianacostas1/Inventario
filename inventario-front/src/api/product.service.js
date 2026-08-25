"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = void 0;
const axios_1 = __importDefault(require("./axios"));
exports.productService = {
    async getAll() {
        const response = await axios_1.default.get('/products');
        return response.data;
    },
    async create(productData) {
        const response = await axios_1.default.post('/products', productData);
        return response.data;
    },
    async delete(id) {
        await axios_1.default.delete(`/products/${id}`);
    },
};
