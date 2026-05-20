
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


export const getEvent = async (
    req: Request,
    res: Response
) => {

    try {

        console.log(
            "-------------Inside get event handler-------------"
        );

        const userId =
            (req as AuthenticatedRequest)
            .user.userId;

        const {
            status,
            eventType,
            language,
            releaseDate,
            releaseYear,
            createdAt,
            startDate,
            endDate,
            page = 1,
            limit = 10
        } = req.query;

        // FILTERS 

        const filters = {

                status:
                    status
                        ? String(status).toUpperCase()
                        : undefined,

                eventType:
                    eventType
                        ? String(eventType).toUpperCase()
                        : undefined,

                language:
                    language
                        ? String(language).toUpperCase()
                        : undefined,

                createdAt:
                    createdAt
                        ? String(createdAt)
                        : undefined,

                releaseDate:
                    releaseDate
                        ? String(releaseDate)
                        : undefined,

                releaseYear:
                    releaseYear
                        ? Number(releaseYear)
                        : undefined,

                startDate:
                    startDate
                        ? String(startDate)
                        : undefined,

                endDate:
                    endDate
                        ? String(endDate)
                        : undefined,

                page: Number(page) || 1,

                limit: Number(limit) || 10
            };          


        // SERVICES

        const response = await EventServices.getAllEventsService(filters);

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


// controllers/event.controller.ts

export const getSingleEvent = async (
    req: Request,
    res: Response
) => {

    try {

        const { eventId } = req.params;

        // VALIDATION

        if (!eventId) {

            return res.status(400).json({
                success: false,
                message: "Event id is required"
            });
        }

        // SERVICE

        const response =
            await EventServices.getSingleEventService(
                eventId as string
            );

        return res.status(200).json({
            success: true,
            data: response
        });

    } catch (err: unknown) {

        console.log(
            "Error comes in get single event",
            err
        );

        if (err instanceof Error) {

            if (
                err.message ===
                "Event not found"
            ) {

                return res.status(404).json({
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
};


// controllers/event.controller.ts

export const updateEvent = async (
    req: Request,
    res: Response
) => {

    try {

        const { eventId } = req.params;

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

        // VALIDATION

        if (!eventId) {

            return res.status(400).json({
                success: false,
                message: "Event id is required"
            });
        }

        const data = {
            eventId,
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
        };

        // VALIDATE

        validateCreateEvent(data);

        // SERVICE

        const response =
            await EventServices.updateEventService(
                data
            );

        return res.status(200).json({
            success: true,
            message: "Event updated successfully",
            data: response
        });

    } catch (err: unknown) {

        console.log(
            "Error comes in update event",
            err instanceof Error
                ? err.message
                : err
        );

        if (err instanceof Error) {

            const handledErrors = [
                "Event not found",
                "Invalid CastIds",
                "Invalid GenreIds",
                "Duplicate castIds are not allowed",
                "Duplicate genresIds are not allowed"
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
};