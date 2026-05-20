
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