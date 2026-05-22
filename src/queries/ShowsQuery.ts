
import { pool } from "../config/dbConfig.js"


export const createShowQuery = async(client : any , data : any) => {

    const {eventId , venueId , showDate , startTime , endTime , language} = data;
    return await pool.query(
        `
            INSERT INTO "SHOWS"
            (
                "EVENT_ID",
                "VENUE_ID",
                "SHOW_DATE",
                "START_TIME",
                "END_TIME",
                "LANGUAGE",
                "STATUS"
            )
            VALUES
            (
                $1 , $2 , $3 , $4 , 
                $5 , $6 , 'ACTIVE'
            )
                
            RETURNING *
        ` , 
        [eventId , venueId , showDate , startTime , endTime , language]
    )
}


export const createShowSeatsQuery = async (client: any, showId: string, layoutJson: any[]) => {

    const values: any[] = [];

    const placeholders: string[] = [];

    let index = 1;

    // PREPARE DATA

    for (const row of layoutJson) {

        for (const seat of row) {

            if (!seat) continue;

            values.push(
                showId,
                seat.seatNo,
                seat.type,
                seat.price,
                "AVAILABLE"
            );

            placeholders.push(
                `(
                    $${index},
                    $${index + 1},
                    $${index + 2},
                    $${index + 3},
                    $${index + 4}
                )`
            );

            index += 5;
        }
    }

    // SINGLE BULK INSERT QUERY

    return await client.query(
        `
        INSERT INTO "SHOW_SEATS"
        (
            "SHOW_ID",
            "SEAT_NO",
            "SEAT_TYPE",
            "PRICE",
            "STATUS"
        )

        VALUES
        ${placeholders.join(",")}

        RETURNING *
        `,
        values
    );
};


// CHECK SHOW ALREADY EXIST FOR PARTICULAR SLOT
export const checkShowSlotQuery = async ({venueId ,showDate,startTime} : any) => {
    return pool.query(
        `
            SELECT * FROM "SHOWS"
            WHERE "VENUE_ID" = $1
            AND "SHOW_DATE" = $2
            AND "START_TIME" = $3
        `,
        [venueId , showDate , startTime]
    )
}


// GET SINGLE SHOW QUERY

export const getSingleShowQuery =
(
    showId: string
) => {

    return pool.query(
        `
        SELECT *
        FROM "SHOWS"

        WHERE "SHOW_ID" = $1
        `,
        [showId]
    );
};


// GET SHOW SEATS QUERY

export const getShowSeatsQuery =
(
    showId: string
) => {

    return pool.query(
        `
        SELECT
            "SHOW_SEAT_ID",
            "SEAT_NO",
            "SEAT_TYPE",
            "PRICE",
            "STATUS"
        FROM "SHOW_SEATS"

        WHERE "SHOW_ID" = $1

        ORDER BY "SEAT_NO" ASC
        `,
        [showId]
    );
};



// GET SEATS FOR VALIDATE

// queries/show.query.ts

export const getShowSeatsForValidateQuery =
(
    showId: string,
    seatIds: string[]
) => {

    return pool.query(
        `
        SELECT
            "SHOW_SEAT_ID",
            "SEAT_NO",
            "SEAT_TYPE",
            "PRICE",
            "STATUS"

        FROM "SHOW_SEATS"

        WHERE "SHOW_ID" = $1

        AND "SHOW_SEAT_ID"
        = ANY($2::uuid[])

        AND "STATUS" = 'AVAILABLE'
        `,
        [
            showId,
            seatIds
        ]
    );
};


// queries/show.query.ts

export const updateShowSeatsStatusQuery =
(
    client: any,
    userId: string,
    showId: string,
    seatIds: string[]
) => {

    return client.query(
        `
        UPDATE "SHOW_SEATS"

        SET
            "STATUS" = 'LOCKED',

            "LOCKED_BY_USER_ID" = $1,

            "LOCKED_AT" = NOW(),

            "LOCK_EXPIRY" =
            NOW() + INTERVAL '5 minutes'

        WHERE "SHOW_ID" = $2

        AND "SHOW_SEAT_ID"
        = ANY($3::uuid[])

        AND "STATUS" = 'AVAILABLE'

        RETURNING *
        `,
        [
            userId,
            showId,
            seatIds
        ]
    );
};