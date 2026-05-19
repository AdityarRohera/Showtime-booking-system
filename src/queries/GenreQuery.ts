// queries/genre.query.ts

import { pool } from "../config/dbConfig.js";

// GET GENRES IDS

export const getGenresIds = (
    genresIds: string[]
) => {

    return pool.query(
        `
        SELECT "GENRE_ID"
        FROM "GENRES"

        WHERE "GENRE_ID" = ANY($1::uuid[])
        `,
        [genresIds]
    );
};

// CREATE BULK EVENT GENRES

export const createBulkGenresQuery = (
    client: any,
    eventId: string,
    genreIds: string[]
) => {

    return client.query(
        `
        INSERT INTO "EVENT_GENRES"
        (
            "EVENT_ID",
            "GENRE_ID"
        )

        SELECT
            $1::uuid,
            UNNEST($2::uuid[])
        `,
        [eventId, genreIds]
    );
};