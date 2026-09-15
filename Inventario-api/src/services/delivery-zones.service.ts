import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";
import {
  CreateDeliveryZoneDTO,
  UpdateDeliveryZoneDTO,
} from "../types/delivery-zone";

export class DeliveryZoneService {
  static async getAll() {
    return await prisma.deliveryZone.findMany({
      orderBy: [
        { priority: "desc" },
        { name: "asc" },
      ],
    });
  }

  static async getActive() {
    return await prisma.deliveryZone.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { priority: "desc" },
        { name: "asc" },
      ],
    });
  }

  static async getById(id: string) {
    return await prisma.deliveryZone.findUnique({
      where: { id },
    });
  }

  static async create(data: CreateDeliveryZoneDTO) {
    return await prisma.deliveryZone.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        isActive: data.isActive ?? true,
        priority: data.priority ?? 0,
        zoneType: data.zoneType ?? "POLYGON",

        coordinates:
          data.coordinates === null || data.coordinates === undefined
            ? Prisma.JsonNull
            : (data.coordinates as Prisma.InputJsonValue),
      },
    });
  }

  static async update(id: string, data: UpdateDeliveryZoneDTO) {
    return await prisma.deliveryZone.update({
      where: { id },
      data: {
        ...(data.name !== undefined && {
          name: data.name,
        }),

        ...(data.description !== undefined && {
          description: data.description,
        }),

        ...(data.price !== undefined && {
          price: data.price,
        }),

        ...(data.isActive !== undefined && {
          isActive: data.isActive,
        }),

        ...(data.priority !== undefined && {
          priority: data.priority,
        }),

        ...(data.zoneType !== undefined && {
          zoneType: data.zoneType,
        }),

        ...(data.coordinates !== undefined && {
          coordinates:
            data.coordinates === null
              ? Prisma.JsonNull
              : (data.coordinates as Prisma.InputJsonValue),
        }),
      },
    });
  }

  static async delete(id: string) {
    return await prisma.deliveryZone.delete({
      where: { id },
    });
  }
}