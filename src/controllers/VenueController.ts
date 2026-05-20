
import type { Request , Response } from 'express';
import type { AuthenticatedRequest } from '../middlewares/auth.js';
import * as VenueServices from '../services/VenueService.js';


export const createVenue = async (
    req: Request,
    res: Response
) => {

    try {

        const {
            name,
            city,
            state,
            address,
            latitude,
            longitude,
            layoutJson
        } = req.body;

        // DATA OBJECT

        const data = {
            name,
            city,
            state,
            address,
            latitude,
            longitude,
            layoutJson
        };

        // VALIDATION

        // validateCreateVenue(data);

        // SERVICE

        const response =
            await VenueServices.createVenueService(
                data
            );

        return res.status(201).json({
            success: true,
            message:
                "Venue created successfully",
            data: response
        });

    } catch (err: unknown) {

        console.log(
            "Error comes in create venue",
            err instanceof Error
                ? err.message
                : err
        );

        if (err instanceof Error) {

            const handledErrors = [
                "layoutJson must be array"
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