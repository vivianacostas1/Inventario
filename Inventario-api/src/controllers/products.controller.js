"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const products_service_1 = require("../services/products.service");
class ProductController {
    static async getProducts(req, res) {
        try {
            const products = await products_service_1.ProductService.getAll();
            return res.json(products);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al obtener los productos" });
        }
    }
    static async getProductById(req, res) {
        try {
            const id = String(req.params.id);
            const product = await products_service_1.ProductService.getById(id);
            if (!product) {
                return res.status(404).json({ error: "Producto no encontrado" });
            }
            return res.json(product);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al obtener el producto" });
        }
    }
    static async createProduct(req, res) {
        try {
            const newProduct = await products_service_1.ProductService.create(req.body);
            return res.status(201).json(newProduct);
        }
        catch (error) {
            return res.status(400).json({
                error: "Error al crear el producto (verifique SKU único, categoría o proveedor válidos)",
                details: error.message
            });
        }
    }
    static async getNextSku(req, res) {
        try {
            const nextSku = await products_service_1.ProductService.getNextSku();
            return res.json({ sku: nextSku });
        }
        catch (error) {
            return res.status(500).json({ error: "Error al generar SKU" });
        }
    }
    static async updateProduct(req, res) {
        try {
            const id = String(req.params.id);
            const updatedProduct = await products_service_1.ProductService.update(id, req.body);
            return res.json(updatedProduct);
        }
        catch (error) {
            return res.status(400).json({ error: "Error al actualizar el producto" });
        }
    }
    static async deleteProduct(req, res) {
        try {
            const id = String(req.params.id);
            await products_service_1.ProductService.delete(id);
            return res.json({ message: "Producto desactivado correctamente" });
        }
        catch (error) {
            return res.status(500).json({ error: "Error al eliminar el producto" });
        }
    }
}
exports.ProductController = ProductController;
