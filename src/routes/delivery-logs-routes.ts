import { Router } from "express"

import { DeliveryLogsController } from "@/controllers/delivery-logs-controller"

import { ensureAuthenticated } from "@/middlewares/ensure-authenticated"
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization"

const deliveryLogsController = new DeliveryLogsController
const deliveryLogsRoutes = Router()

deliveryLogsRoutes.post("/", ensureAuthenticated, verifyUserAuthorization(["sale"]), deliveryLogsController.create)
deliveryLogsRoutes.get("/:delivery_id/show", ensureAuthenticated, verifyUserAuthorization(["sale","customer"]), deliveryLogsController.show)

export { deliveryLogsRoutes }
