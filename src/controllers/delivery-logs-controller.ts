import { Request, Response } from "express"
import { z } from "zod"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"



class DeliveryLogsController {
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            delivery_id: z.string().uuid(),
            description: z.string(),
        })
        const { delivery_id, description } = bodySchema.parse(request.body)

        const delivery = await prisma.delivery.findUnique({
            where: { id: delivery_id }
        })

        if (!delivery) {
            throw new AppError("delivery not found", 400)
        }

        if (delivery.status === "delivered") {
            throw new AppError("this order has already been delivered", 404)
        }

        if (delivery.status === "processing") {
            throw new AppError("change status to shipped", 404)
        }

        await prisma.deliveryLog.create({
            data: {
                deliveryId: delivery_id,
                description
            }
        })

        return response.status(201).json()
    }

    async show(request: Request, response: Response) {
        const bodySchema = z.object({
            delivery_id: z.string().uuid(),
        })
        const { delivery_id, } = bodySchema.parse(request.params)

        const delivery = await prisma.delivery.findUnique({
            where: { id: delivery_id },
            include: {
                user: { select: { id: true } },
                logs: true,
            }
        })

        if (request.user?.role === "customer" &&
            request.user.id !== delivery?.userId
        ) {
            throw new AppError("the user can only view their deliveries", 401)
        }

        return response.status(201).json({ delivery })
    }
} export { DeliveryLogsController }