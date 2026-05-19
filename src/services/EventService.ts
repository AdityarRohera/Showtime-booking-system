
import * as Cast from "../queries/CastQuery.js";
import * as Genre from "../queries/GenreQuery.js";
import * as Events from "../queries/EventQuery.js";

import { pool } from "../config/dbConfig.js";

interface CreateEventPayload {
    title: string;
    description?: string;
    eventType: string;
    duration: number;
    releaseDate?: string;
    thumbnailUrl?: string;
    bannerUrl?: string;
    language: string;
    status?: string;
    castIds: string[];
    genresIds: string[];
}

export const createEventService = async (
    data: CreateEventPayload
) => {

    const client = await pool.connect();

    try {

        const {castIds,genresIds} = data;

        // START TRANSACTION

        await client.query("BEGIN");

        // CHECK DUPLICATE CAST IDS

        const uniqueCastIds = new Set(castIds);

        if (
            uniqueCastIds.size !== castIds.length
        ) {
            throw new Error(
                "Duplicate castIds are not allowed"
            );
        }

        // VALIDATE CAST IDS

        const castData =
            await Cast.getCastsByIds(castIds);

        if (
            castData.rowCount !== castIds.length
        ) {
            throw new Error("Invalid CastIds");
        }

        // VALIDATE GENRE IDS 

         const uniqueGenreIds = new Set(genresIds);

         if (
             uniqueGenreIds.size !==
             genresIds.length
         ) {
             throw new Error(
                 "Duplicate genresIds are not allowed"
             );
         }

        // VALIDATE GENRE IDS

        const genreData =
            await Genre.getGenresIds(genresIds);

        if (
            genreData.rowCount !== genresIds.length
        ) {
            throw new Error("Invalid GenreIds");
        }

        // CREATE EVENT

        const event =
            await Events.createEventQuery(
                client,
                data
            );

        const eventData = event.rows[0];

        // CREATE EVENT GENRES

        await Genre.createBulkGenresQuery(
            client,
            eventData.EVENT_ID,
            genresIds
        );

        // CREATE EVENT CASTS

        await Cast.createBulkCastQuery(
            client,
            eventData.EVENT_ID,
            castIds
        );

        // COMMIT

        await client.query("COMMIT");

        return eventData;

    } catch (err) {

        // ROLLBACK

        await client.query("ROLLBACK");

        throw err;

    } finally {

        client.release();
    }
};


// services/event.service.ts

export const getAllEventsService = async (filters: any) => {

    const {page,limit} = filters;

    const offset = (page - 1) * limit;

    const response =
        await Events.getAllEventsQuery({
            ...filters,
            offset
        });

    return response.rows;
};