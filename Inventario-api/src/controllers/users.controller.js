"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const users_service_1 = require("../services/users.service");
class UserController {
    static async getUsers(req, res) {
        try {
            const users = await users_service_1.UserService.getAll();
            return res.json(users);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al obtener los usuarios" });
        }
    }
    static async getUserById(req, res) {
        try {
            const id = String(req.params.id);
            const user = await users_service_1.UserService.getById(id);
            if (!user) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }
            return res.json(user);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al obtener el usuario" });
        }
    }
    static async createUser(req, res) {
        try {
            const newUser = await users_service_1.UserService.create(req.body);
            return res.status(201).json(newUser);
        }
        catch (error) {
            return res.status(400).json({ error: "Error al crear el usuario (correo duplicado o datos inválidos)" });
        }
    }
    static async updateUser(req, res) {
        try {
            const id = String(req.params.id);
            const updatedUser = await users_service_1.UserService.update(id, req.body);
            return res.json(updatedUser);
        }
        catch (error) {
            return res.status(400).json({ error: "Error al actualizar el usuario" });
        }
    }
    static async deleteUser(req, res) {
        try {
            const id = String(req.params.id);
            await users_service_1.UserService.delete(id);
            return res.json({ message: "Usuario desactivado correctamente" });
        }
        catch (error) {
            return res.status(500).json({ error: "Error al eliminar el usuario" });
        }
    }
}
exports.UserController = UserController;
