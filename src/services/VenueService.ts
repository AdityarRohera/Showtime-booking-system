

import { pool } from "../config/dbConfig.js";

import * as Venue from "../queries/VenueQuery.js";


export const createVenueService =
async (data: any) => {

    const client = await pool.connect();

    try {

        const {
            name,
            city,
            address
        } = data;

        // CHECK EXISTING VENUE

        const existingVenue =
            await Venue.getVenueByNameAndAddressQuery(
                name,
                city,
                address
            );

        if (
            existingVenue.rows.length > 0
        ) {
            throw new Error(
                "Venue already exists"
            );
        }

        await client.query("BEGIN");

        // CREATE VENUE

        const venue =
            await Venue.createVenueQuery(
                client,
                data
            );

        const venueData =
            venue.rows[0];

        // CREATE VENUE SEATS

        await Venue.createVenueSeatsQuery(
            client,
            venueData.VENUE_ID,
            data.layoutJson
        );

        await client.query("COMMIT");

        return venueData;

    } catch (err) {

        await client.query("ROLLBACK");

        throw err;

    } finally {

        client.release();
    }
};