
import { pool } from "../config/dbConfig.js"



// GET VENUE BY NAME CITY ADDRESS

export const getVenueByNameAndAddressQuery =
(
    name: string,
    city: string,
    address: string
) => {

    return pool.query(
        `
        SELECT *
        FROM "VENUES"

        WHERE
            "NAME" = LOWER($1)

            AND "CITY" = LOWER($2)

            AND "ADDRESS" = LOWER($3)
        `,
        [
            name,
            city,
            address
        ]
    );
};

// CREATE VENUE QUERY

export const createVenueQuery = (
    client: any,
    data: any
) => {

    const {
        name,
        city,
        state,
        address,
        latitude,
        longitude
    } = data;

    return client.query(
        `
        INSERT INTO "VENUES"
        (
            "NAME",
            "CITY",
            "STATE",
            "ADDRESS",
            "LATITUDE",
            "LONGITUDE"
        )

        VALUES
        (
            $1, $2, $3,
            $4, $5, $6
        )

        RETURNING *
        `,
        [
            name,
            city,
            state,
            address,
            latitude,
            longitude
        ]
    );
};


// CREATE VENUE SEATS QUERY

 // queries/venue.query.ts

export const createVenueSeatsQuery = (
    client: any,
    venueId: string,
    layoutJson: any[]
) => {

    return client.query(
        `
        INSERT INTO "VENUE_SEATS"
        (
            "VENUE_ID",
            "LAYOUT_JSON"
        )

        VALUES
        (
            $1,
            $2
        )

        RETURNING *
        `,
        [
            venueId,
            JSON.stringify(layoutJson)
        ]
    );
};


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
