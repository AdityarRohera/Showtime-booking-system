
import { pool } from "../config/dbConfig.js"


export const createEventQuery = (
    client: any,
    data: any
) => {

    const {
        title,
        description,
        eventType,
        duration,
        releaseDate,
        thumbnailUrl,
        bannerUrl,
        language,
        status
    } = data;

    return client.query(
        `
        INSERT INTO "EVENTS"
        (
            "TITLE",
            "DESCRIPTION",
            "EVENT_TYPE",
            "DURATION",
            "RELEASE_DATE",
            "THUMBNAIL_URL",
            "BANNER_URL",
            "LANGUAGE",
            "STATUS"
        )

        VALUES
        (
            $1, $2, $3, $4,
            $5, $6, $7, $8, $9
        )

        RETURNING *
        `,
        [
            title,
            description,
            eventType,
            duration,
            releaseDate,
            thumbnailUrl,
            bannerUrl,
            language,
            status
        ]
    );
};


// GET ALL EVENTS BY FILTERS

// queries/event.query.ts

export const getAllEventsQuery = async ( filters: any) => {

    const {status, eventType, language, createdAt, releaseDate, releaseYear, startDate, endDate, limit, offset} = filters;

    let query = `
        SELECT *
        FROM "EVENTS"
        WHERE 1=1
    `;

    const values = [];

    // STATUS FILTER

    if (status) {

        values.push(status);

        query += `
            AND "STATUS" = $${values.length}
        `;
    }

    // TYPE FILTER

    if (eventType) {

        values.push(eventType);

        query += `
            AND "EVENT_TYPE" = $${values.length}
        `;
    }

    // LANGUAGE FILTER

    if (language) {

        values.push(language);

        query += `
            AND "LANGUAGE" = $${values.length}
        `;
    }

     // EXACT RELEASE DATE

    if (releaseDate) {

        values.push(releaseDate);

        query += `
            AND DATE("RELEASE_DATE")
            = $${values.length}
        `;
    }

    // EXACT RELEASE YEAR
    if (releaseYear) {

        values.push(releaseYear);

        query += `
            AND EXTRACT(
                YEAR FROM "RELEASE_DATE"
            ) = $${values.length}
        `;
    }

    // EXACT CREATED DATE

    if (createdAt) {

        values.push(createdAt);

        query += `
            AND DATE("CREATED_AT")
            = $${values.length}
        `;
    }

    // DATE RANGE

    if (startDate && endDate) {

        values.push(startDate);

        query += `
            AND "RELEASE_DATE"
            >= $${values.length}
        `;

        values.push(endDate);

        query += `
            AND "RELEASE_DATE"
            <= $${values.length}
        `;
    }

    // PAGINATION

    values.push(limit);

    query += `
        LIMIT $${values.length}
    `;

    values.push(offset);

    query += `
        OFFSET $${values.length}
    `;

    return await pool.query(
        query,
        values
    );
};



// GET SINGLE EVENT

export const getSingleEventQuery = async (
    eventId: string
) => {

    return await pool.query(
        `
        SELECT *
        FROM "EVENTS"

        WHERE "EVENT_ID" = $1
        `,
        [eventId]
    );
};




// UPDATE EVENT QUERY

export const updateEventQuery = (
    client: any,
    data: any
) => {

    const {
        eventId,
        title,
        description,
        eventType,
        duration,
        releaseDate,
        thumbnailUrl,
        bannerUrl,
        language,
        status
    } = data;

    return client.query(
        `
        UPDATE "EVENTS"

        SET
            "TITLE" = $1,
            "DESCRIPTION" = $2,
            "EVENT_TYPE" = $3,
            "DURATION" = $4,
            "RELEASE_DATE" = $5,
            "THUMBNAIL_URL" = $6,
            "BANNER_URL" = $7,
            "LANGUAGE" = $8,
            "STATUS" = $9,
            "UPDATED_AT" = CURRENT_TIMESTAMP

        WHERE "EVENT_ID" = $10

        RETURNING *
        `,
        [
            title,
            description,
            eventType,
            duration,
            releaseDate,
            thumbnailUrl,
            bannerUrl,
            language,
            status,
            eventId
        ]
    );
};