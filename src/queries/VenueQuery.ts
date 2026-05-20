
import { pool } from "../config/dbConfig.js"


export const getVenueByIdQuery = async(venueId : any) => {
    return pool.query(
        `
            SELECT * FROM "VENUE"
            WHERE "VENUE_ID" = $1
        `,
        [venueId]
    )
}

export const getVenueSeatsQuery = async(venueId : any) => {
    return pool.query(
        `
            SELECT * FROM "VENUE_SEATS"
            WHERE "VENUE_ID" = $1
        `,
        [venueId]
    )
}