
import { pool } from "../config/dbConfig.js"

import * as Shows from "../queries/ShowsQuery.js";
import * as Booking  from "../queries/BookingQuery.js";

export const tempBookingService =
async (data: any) => {

    const client =
        await pool.connect();

    try {

        const {
            userId,
            showId,
            seatIds
        } = data;

        // VALIDATE SHOW

        const show =
            await Shows
            .getSingleShowQuery(showId);

        if (show.rowCount === 0) {
            throw new Error(
                "Invalid Show Id"
            );
        }

        // REMOVE DUPLICATES

        const uniqueSeatIds =
            [...new Set(seatIds)];

        if (
            uniqueSeatIds.length !==
            seatIds.length
        ) {

            throw new Error(
                "Duplicate seatIds are not allowed"
            );
        }

        // VALIDATE SEATS

        const validSeats =
            await Shows
            .getShowSeatsForValidateQuery(
                showId,
                uniqueSeatIds as []
            );

        if (
            validSeats.rowCount !==
            uniqueSeatIds.length
        ) {

            throw new Error(
                "Invalid Seats Id's or status"
            );
        }

        // TOTAL AMOUNT

        const totalAmount =
            validSeats.rows.reduce(
                (acc: number, seat: any) =>
                    acc + Number(seat.PRICE),
                0
            );

        // START TRANSACTION

        await client.query("BEGIN");

        // CREATE BOOKING

        const booking =
            await Booking
            .createBookingQuery(
                client,
                {
                    userId,
                    showId,
                    totalAmount
                }
            );

        const bookingData =
            booking.rows[0];

        // CREATE BOOKING SEATS

        await Booking
        .createBookingSeatsQuery(
            client,
            bookingData.BOOKING_ID,
            validSeats.rows
        );

        // LOCK SEATS

        await Shows
        .updateShowSeatsStatusQuery(
            client,
            userId,
            showId,
            uniqueSeatIds as []
        );

        await client.query("COMMIT");

        return {
            bookingId:
                bookingData.BOOKING_ID,

            expiresAt:
                bookingData.EXPIRES_AT,

            totalAmount
        };

    } catch (err) {

        await client.query("ROLLBACK");

        throw err;

    } finally {

        client.release();
    }
};