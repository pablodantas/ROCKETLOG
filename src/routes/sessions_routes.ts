import { Router } from "express"
import { SessionsController } from "@/controllers/sessions-controller"

const sessionsController = new SessionsController
const sessionsRouter = Router()

sessionsRouter.post("/", sessionsController.create)

export { sessionsRouter }