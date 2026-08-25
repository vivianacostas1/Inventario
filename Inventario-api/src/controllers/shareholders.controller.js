"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShareholderController = void 0;
const shareholders_service_1 = require("../services/shareholders.service");
class ShareholderController {
    static async getShareholders(req, res) {
        try {
            const shareholders = await shareholders_service_1.ShareholderService.getAll();
            return res.json(shareholders);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al obtener los accionistas" });
        }
    }
    static async getShareholderById(req, res) {
        try {
            const id = String(req.params.id);
            const shareholder = await shareholders_service_1.ShareholderService.getById(id);
            if (!shareholder) {
                return res.status(404).json({ error: "Accionista no encontrado" });
            }
            return res.json(shareholder);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al obtener el accionista" });
        }
    }
    static async createShareholder(req, res) {
        try {
            const newShareholder = await shareholders_service_1.ShareholderService.create(req.body);
            return res.status(201).json(newShareholder);
        }
        catch (error) {
            return res.status(400).json({
                error: "Error al crear el accionista (verifique que el correo no esté duplicado)",
                details: error.message
            });
        }
    }
    static async updateShareholder(req, res) {
        try {
            const id = String(req.params.id);
            const updatedShareholder = await shareholders_service_1.ShareholderService.update(id, req.body);
            return res.json(updatedShareholder);
        }
        catch (error) {
            return res.status(400).json({ error: "Error al actualizar el accionista" });
        }
    }
    static async deleteShareholder(req, res) {
        try {
            const id = String(req.params.id);
            await shareholders_service_1.ShareholderService.delete(id);
            return res.json({ message: "Accionista desactivado correctamente" });
        }
        catch (error) {
            return res.status(500).json({ error: "Error al eliminar el accionista" });
        }
    }
    // NUEVO MÉTODO: Conecta con el servicio para devolver los datos al modal del frontend
    static async getShareholdersFinancials(req, res) {
        try {
            const financials = await shareholders_service_1.ShareholderService.getFinancialSummary();
            return res.json(financials);
        }
        catch (error) {
            console.error("Error al obtener finanzas de accionistas:", error);
            return res.status(500).json({ error: "Error al calcular el capital y las ganancias de los accionistas" });
        }
    }
}
exports.ShareholderController = ShareholderController;
