// queries/cast.query.ts

import { pool } from "../config/dbConfig.js";

// GET CAST IDS

export const getCastsByIds = (
    castIds: string[]
) => {

    return pool.query(
        `
        SELECT "CAST_ID"
        FROM "CASTS"

        WHERE "CAST_ID" = ANY($1::uuid[])
        `,
        [castIds]
    );
};

// CREATE BULK EVENT CASTS

export const createBulkCastQuery = (
    client: any,
    eventId: string,
    castIds: string[]
) => {

    return client.query(
        `
        INSERT INTO "EVENT_CASTS"
        (
            "EVENT_ID",
            "CAST_ID"
        )

        SELECT
            $1::uuid,
            UNNEST($2::uuid[])
        `,
        [eventId, castIds]
    );
};


// DELETE CAST QUERY

export const deleteEventCastQuery = (
    client: any,
    eventId: string
) => {

    return client.query(
        `
        DELETE FROM "EVENT_CASTS"

        WHERE "EVENT_ID" = $1
        `,
        [eventId]
    );
};