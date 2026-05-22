
import type{ Request , Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.js";

import * as BookingService from "../services/BookingService.js";

export const tempBooking = async (
    req: Request,
    res: Response
) => {

    try {

        console.log(
            "-------------Inside temp booking handler-------------"
        );

        const userId =
            (req as AuthenticatedRequest)
            .user.userId;

        const {
            showId,
            seatIds
        } = req.body;

        // DATA OBJECT

        const data = {
            userId,
            showId,
            seatIds
        };

        // SERVICE

        const response =
            await BookingService.tempBookingService(data);

        return res.status(201).json({
            success: true,
            message:
                "Seats locked successfully",
            data: response
        });

    } catch (err: unknown) {

        console.log(
            "Error comes in temp booking",
            err instanceof Error
                ? err.message
                : err
        );

        if (err instanceof Error) {

            const handledErrors = [
                "Invalid Show Id",
                "Invalid Seats Id's or status",
                "Duplicate seatIds are not allowed"
            ];

            if (
                handledErrors.includes(
                    err.message
                )
            ) {

                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }
        }

        return res.status(500).json({
            success: false,
            message:
                "Internal server error"
        });
    }
};