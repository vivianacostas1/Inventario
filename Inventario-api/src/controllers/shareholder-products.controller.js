"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShareholderProductController = void 0;
const shareholder_products_service_1 = require("../services/shareholder-products.service");
class ShareholderProductController {
    static async getAssignments(req, res) {
        try {
            const assignments = await shareholder_products_service_1.ShareholderProductService.getAll();
            return res.json(assignments);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al obtener las asignaciones" });
        }
    }
    static async assignProduct(req, res) {
        try {
            // Recogemos el productId de los parámetros de la ruta y el shareholderId/quantity del body
            const { productId } = req.params;
            const { shareholderId, quantity } = req.body;
            const assignmentData = {
                productId: productId || req.body.productId,
                shareholderId,
                quantity: quantity !== undefined ? parseInt(quantity) : 0,
            };
            const assignment = await shareholder_products_service_1.ShareholderProductService.assignProduct(assignmentData);
            return res.status(201).json({
                message: "Producto asignado o actualizado correctamente al accionista",
                assignment,
            });
        }
        catch (error) {
            return res.status(400).json({
                error: "Error al asignar el producto al accionista",
                details: error.message
            });
        }
    }
    static async removeAssignment(req, res) {
        try {
            const id = String(req.params.id);
            await shareholder_products_service_1.ShareholderProductService.removeAssignment(id);
            return res.json({ message: "Asignación eliminada correctamente" });
        }
        catch (error) {
            return res.status(400).json({ error: "No se pudo eliminar la asignación o no existe" });
        }
    }
}
exports.ShareholderProductController = ShareholderProductController;
