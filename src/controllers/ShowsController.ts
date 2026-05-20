
import type { Request , Response } from 'express';
import type { AuthenticatedRequest } from '../middlewares/auth.js';

import * as ShowsServices from '../services/ShowsService.js';

export const createShow = async(req : Request , res : Response) => {

    try{

        const {eventId , venueId , showDate , startTime , endTime , language} = req.body;

        const data = {eventId , venueId , showDate , startTime , endTime , language};

        // validation

        // create new show

        const response =
            await ShowsServices.createShowService(
                data
            );

        return res.status(201).json({
            success: true,
            message: "Show created successfully",
            data: response
        });


    } catch(err : unknown){

         console.log(
            "Error comes in create show",
            err instanceof Error
                ? err.message
                : err
        );

        if (err instanceof Error) {

            const handledErrors = [
                "Event not found",
                "Venue not found",
                "Show already exists for this time slot"
            ];

            if (
                handledErrors.includes(err.message)
            ) {

                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
}