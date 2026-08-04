import { Router } from "express";
import { CustomerController } from "../controllers/customers.controller";

const router = Router();

router.get("/", CustomerController.getCustomers);
router.get("/:id", CustomerController.getCustomerById);
router.post("/", CustomerController.createCustomer);
router.put("/:id", CustomerController.updateCustomer);
router.delete("/:id", CustomerController.deleteCustomer);

export default router;