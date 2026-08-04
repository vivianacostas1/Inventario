import { Request, Response } from "express";
import { UserService } from "../services/users.service";

export class UserController {
  static async getUsers(req: Request, res: Response) {
    try {
      const users = await UserService.getAll();
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener los usuarios" });
    }
  }

  static async getUserById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const user = await UserService.getById(id);
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener el usuario" });
    }
  }

  static async createUser(req: Request, res: Response) {
    try {
      const newUser = await UserService.create(req.body);
      return res.status(201).json(newUser);
    } catch (error) {
      return res.status(400).json({ error: "Error al crear el usuario (correo duplicado o datos inválidos)" });
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const updatedUser = await UserService.update(id, req.body);
      return res.json(updatedUser);
    } catch (error) {
      return res.status(400).json({ error: "Error al actualizar el usuario" });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      await UserService.delete(id);
      return res.json({ message: "Usuario desactivado correctamente" });
    } catch (error) {
      return res.status(500).json({ error: "Error al eliminar el usuario" });
    }
  }
}