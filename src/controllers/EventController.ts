
import type { Request , Response } from 'express';
import type { AuthenticatedRequest } from '../middlewares/auth.js';
import * as EventServices from '../services/EventService.js';
import { validateCreateEvent } from '../validations/event.validation.js';

export const createEvent = async (
    req: Request,
    res: Response
) => {

    try {

        console.log(
            "-------------Inside create event handler-------------"
        );

        const userId =
            (req as AuthenticatedRequest)
            .user.userId;

        const {
            title,
            description,
            eventType,
            duration,
            releaseDate,
            thumbnailUrl,
            bannerUrl,
            language,
            status,
            castIds,
            genresIds
        } = req.body;

        // CREATE DATA OBJECT

        const data = {
            title,
            description,
            eventType,
            duration,
            releaseDate,
            thumbnailUrl,
            bannerUrl,
            language,
            status,
            castIds,
            genresIds,
            createdBy: userId
        };

        // VALIDATION

        validateCreateEvent(data);

        // SERVICE

        const response =
            await EventServices.createEventService(
                data
            );

        return res.status(201).json({
            success: true,
            message: "Event created successfully",
            data: response
        });

    } catch (err: unknown) {

        console.log(
            "Error comes in create event",
            err
        );

        if (err instanceof Error) {

            // VALIDATION ERRORS

            if (
                err.message ===
                "Title is required"
            ) {

                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }

            if (
                err.message ===
                "Event type is required"
            ) {

                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }

            if (
                err.message ===
                "Duration is required"
            ) {

                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }

            if (
                err.message ===
                "Language is required"
            ) {

                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }

            if (
                err.message ===
                "castIds must be array"
            ) {

                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }

            if (
                err.message ===
                "genresIds must be array"
            ) {

                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }

            // BUSINESS ERRORS

            if (
                err.message ===
                "Duplicate genresIds are not allowed" ||

                err.message ===
                "Duplicate castIds are not allowed"
            ) {
            
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }

            if (
                err.message ===
                "Invalid CastIds"
            ) {

                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }

            if (
                err.message ===
                "Invalid GenreIds"
            ) {

                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }
        }

        // INTERNAL SERVER ERROR

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};