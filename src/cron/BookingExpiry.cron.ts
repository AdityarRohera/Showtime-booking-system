

// import cron from "node-cron";
// import { pool } from "../config/dbConfig.js";

// cron.schedule("*/1 * * * *", async () => {

//     console.log("Running booking expiry cron");

//     await pool.query(`
    
//         UPDATE "SHOW_SEATS"

//         SET
//             "STATUS" = 'AVAILABLE',
//             "LOCKED_BY_USER_ID" = NULL,
//             "LOCKED_AT" = NULL,
//             "LOCK_EXPIRY" = NULL

//         WHERE
//             "STATUS" = 'LOCKED'
//             AND "LOCK_EXPIRY" < NOW()
//     `);

//     await pool.query(`

//         UPDATE "BOOKINGS"

//         SET
//             "BOOKING_STATUS" = 'EXPIRED'

//         WHERE
//             "BOOKING_STATUS" = 'PENDING_PAYMENT'
//             AND "EXPIRES_AT" < NOW()
//     `);

// });




import cron from "node-cron";
import { pool } from "../config/dbConfig.js";

cron.schedule(
    "*/1 * * * *",
    async () => {

        const currentTime =
            new Date().toISOString();

        console.log(
            `\n========== BOOKING EXPIRY CRON STARTED ==========` 
        );

        console.log(
            `Cron Running At: ${currentTime}`
        );

        try {

            // RELEASE EXPIRED SHOW SEATS

            const releasedSeats =
                await pool.query(
                    `
                    UPDATE "SHOW_SEATS"

                    SET
                        "STATUS" = 'AVAILABLE',

                        "LOCKED_BY_USER_ID" = NULL,

                        "LOCKED_AT" = NULL,

                        "LOCK_EXPIRY" = NULL

                    WHERE
                        "STATUS" = 'LOCKED'

                        AND "LOCK_EXPIRY" < NOW()

                    RETURNING "SHOW_SEAT_ID"
                    `
                );

            console.log(
                `Released Seats Count: ${releasedSeats.rowCount}`
            );

            // EXPIRE BOOKINGS

            const expiredBookings =
                await pool.query(
                    `
                    UPDATE "BOOKINGS"

                    SET
                        "BOOKING_STATUS" = 'EXPIRED'

                    WHERE
                        "BOOKING_STATUS" = 'PENDING_PAYMENT'

                        AND "EXPIRES_AT" < NOW()

                    RETURNING "BOOKING_ID"
                    `
                );

            console.log(
                `Expired Bookings Count: ${expiredBookings.rowCount}`
            );

            console.log(
                `BOOKING EXPIRY CRON COMPLETED SUCCESSFULLY`
            );

        } catch (err) {

            console.log(
                `ERROR IN BOOKING EXPIRY CRON`
            );

            console.log(
                err instanceof Error
                    ? err.message
                    : err
            );

        } finally {

            console.log(
                `========== BOOKING EXPIRY CRON ENDED ==========\n`
            );
        }
    }
);