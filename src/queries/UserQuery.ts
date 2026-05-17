

import { pool } from "../config/dbConfig.js";

// TYPES HERE
interface CreateUserPayload {
    name: string;
    email: string;
    password: string;
}



// GET USER BY EMAIL
export const getUserByEmailQuery = async (email: string) => {

    return await pool.query(
        `
        SELECT * FROM "USERS"
        WHERE "EMAIL" = $1
        `,
        [email]
    );
};


// CREATE USER QUERY
export const createUserQuery = async ({
    name,
    email,
    password
}: CreateUserPayload) => {

    return await pool.query(
        `
        INSERT INTO "USERS"
        (
            "NAME",
            "EMAIL",
            "PASSWORD"
        )
        VALUES ($1, $2, $3)

        RETURNING
            "USER_ID",
            "NAME",
            "EMAIL",
            "CREATED_AT"
        `,
        [name, email, password]
    );
};


// CREATE USER PROFILE QUERY
export const createUserProfileQuery = async (
    userId: string
) => {

    return await pool.query(
        `
        INSERT INTO "USERPROFILE"
        (
            "USER_ID"
        )

        VALUES ($1)

        RETURNING *
        `,
        [userId]
    );
};