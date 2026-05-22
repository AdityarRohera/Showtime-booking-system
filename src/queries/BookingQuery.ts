


// queries/booking.query.ts

export const createBookingQuery = (
    client: any,
    data: any
) => {

    const {
        userId,
        showId,
        totalAmount
    } = data;

    return client.query(
        `
        INSERT INTO "BOOKINGS"
        (
            "USER_ID",
            "SHOW_ID",
            "BOOKING_STATUS",
            "TOTAL_AMOUNT",
            "EXPIRES_AT"
        )

        VALUES
        (
            $1,
            $2,
            'PENDING_PAYMENT',
            $3,
            NOW() + INTERVAL '5 minutes'
        )

        RETURNING *
        `,
        [
            userId,
            showId,
            totalAmount
        ]
    );
};

// queries/booking.query.ts

export const createBookingSeatsQuery =
async (
    client: any,
    bookingId: string,
    seats: any[]
) => {

    const values: any[] = [];

    const placeholders: string[] = [];

    let index = 1;

    for (const seat of seats) {

        values.push(
            bookingId,
            seat.SHOW_SEAT_ID,
            seat.SEAT_NO,
            seat.SEAT_TYPE,
            seat.PRICE
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

    return client.query(
        `
        INSERT INTO "BOOKING_SEATS"
        (
            "BOOKING_ID",
            "SHOW_SEAT_ID",
            "SEAT_NUMBER_SNAPSHOT",
            "SEAT_TYPE_SNAPSHOT",
            "PRICE_SNAPSHOT"
        )

        VALUES
        ${placeholders.join(",")}

        RETURNING *
        `,
        values
    );
};