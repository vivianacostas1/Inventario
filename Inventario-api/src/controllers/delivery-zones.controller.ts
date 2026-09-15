import { Request, Response } from "express";
import { DeliveryZoneService } from "../services/delivery-zones.service";

export class DeliveryZoneController {
  static async getDeliveryZones(req: Request, res: Response) {
    try {
      const zones = await DeliveryZoneService.getAll();
      return res.json(zones);
    } catch (error) {
      return res.status(500).json({
        error: "Error al obtener las zonas de entrega",
      });
    }
  }

  static async getActiveDeliveryZones(req: Request, res: Response) {
    try {
      const zones = await DeliveryZoneService.getActive();
      return res.json(zones);
    } catch (error) {
      return res.status(500).json({
        error: "Error al obtener las zonas de entrega activas",
      });
    }
  }

  static async getDeliveryZoneById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);

      const zone = await DeliveryZoneService.getById(id);

      if (!zone) {
        return res.status(404).json({
          error: "Zona de entrega no encontrada",
        });
      }

      return res.json(zone);
    } catch (error) {
      return res.status(500).json({
        error: "Error al obtener la zona de entrega",
      });
    }
  }

  static async createDeliveryZone(req: Request, res: Response) {
    try {
      const newZone = await DeliveryZoneService.create(req.body);

      return res.status(201).json(newZone);
    } catch (error: any) {
      return res.status(400).json({
        error: "Error al crear la zona de entrega",
        details: error.message,
      });
    }
  }

  static async updateDeliveryZone(req: Request, res: Response) {
    try {
      const id = String(req.params.id);

      const updatedZone = await DeliveryZoneService.update(
        id,
        req.body
      );

      return res.json(updatedZone);
    } catch (error: any) {
      return res.status(400).json({
        error: "Error al actualizar la zona de entrega",
        details: error.message,
      });
    }
  }

  static async deleteDeliveryZone(req: Request, res: Response) {
    try {
      const id = String(req.params.id);

      await DeliveryZoneService.delete(id);

      return res.json({
        message: "Zona de entrega eliminada correctamente",
      });
    } catch (error: any) {
      return res.status(400).json({
        error: "Error al eliminar la zona de entrega",
        details: error.message,
      });
    }
  }
}