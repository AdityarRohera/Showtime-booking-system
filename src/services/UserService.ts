
import { pool } from "../config/dbConfig.js";
import bcrypt from "bcrypt";
import * as User  from "../queries/UserQuery.js";

interface SignupPayload {
    name: string;
    email: string;
    password: string;
}

interface LoginPayload {
    email: string;
    password: string;
}


export const signupService = async ({
    name,
    email,
    password
}: SignupPayload) => {

    // CREATE CLIENT CONNECTION
    const client = await pool.connect();

    try {

        // START TRANSACTION

        await client.query("BEGIN");

        // CHECK USER EXISTS
        const existingUser = await User.getUserByEmailQuery(email);

        if (existingUser.rows.length > 0) {
            throw new Error("User already exists");
        }

        // HASH PASSWORD
        const hashedPassword = await bcrypt.hash(password, 10);

        // CREATE USER
        const user = await User.createUserQuery(
            {
                name,
                email,
                password: hashedPassword
            }
        );

        // CREATE USER PROFILE
        const userProfile = await User.createUserProfileQuery(user.rows[0].USER_ID);

        // COMMIT TRANSACTION
        await client.query("COMMIT");

        return {
            user: user.rows[0],
            userProfile: userProfile.rows[0]
        };

    } catch (err) {

        // ROLLBACK IF ERROR
        await client.query("ROLLBACK");
        throw err;

    } finally {
        // RELEASE CONNECTION
        client.release();
    }
};

export const loginService = async ({
    email,
    password
}: LoginPayload) => {

    // FIND USER

    const user = await User.getUserByEmailQuery(email);

    if (user.rows.length === 0) {
        throw new Error("Invalid User");
    }

    const existingUser = user.rows[0];

    // COMPARE PASSWORD

    const isPasswordMatched = await bcrypt.compare(
        password,
        existingUser.PASSWORD
    );

    if (!isPasswordMatched) {
        throw new Error("Incorrect password");
    }

    // REMOVE PASSWORD
    delete existingUser.PASSWORD;
    return existingUser;
};