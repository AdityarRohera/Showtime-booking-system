
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