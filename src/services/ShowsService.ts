

import * as Shows from "../queries/ShowsQuery.js";
import * as Events from "../queries/EventQuery.js";
import * as Venues from "../queries/VenueQuery.js";
import { pool } from "../config/dbConfig.js";


export const createShowService = async(data : any) => {

    const client = await pool.connect();

   try {

        const {eventId , venueId , showDate , startTime} = data;


        // VALIDATE EVENT

        const event =
            await Events.getSingleEventQuery(
                eventId
            );

        if (event.rows.length === 0) {
            throw new Error(
                "Event not found"
            );
        }

        // VENUE SEATS

        const venueSeats = await Venues.getVenueSeatsQuery(venueId);

        if (venueSeats.rows.length === 0) {
            throw new Error(
                "Venue not found"
            );
        }

        const seats = venueSeats.rows[0].LAYOUT_JSON;


         // CHECK SHOW SLOT

        const existingShow =
            await Shows.checkShowSlotQuery({
                venueId,
                showDate,
                startTime
            });

        if (
            existingShow.rows.length > 0
        ) {
            throw new Error(
                "Show already exists for this time slot"
            );
        }


        // START TRANSACTION

        await client.query('BEGIN');

        // CREATE NEW SHOW

        const show =
            await Shows.createShowQuery(
                client,
                data
            );

        const showData = show.rows[0];


        // CREATE SHOW SEATS

        await Shows.createShowSeatsQuery(client , showData.SHOW_ID , existingShow.rows[0].LAYOUT_JSON);


         // COMMIT

        await client.query("COMMIT");

        return showData;


   } catch(err) {
        // ROLLBACK

        await client.query("ROLLBACK");

        throw err;

   } finally {

        client.release();
   }
}

