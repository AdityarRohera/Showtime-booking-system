

import type { Request , Response } from 'express';
import * as UserService from '../services/UserService.js';
const secret = process.env.TOKEN_SECRET;


export const signup = async(req : Request , res : Response) => {
    try{

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        const response = await UserService.signupService({name, email, password});

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: response
        });


    } catch(err : unknown){
        console.log("Error comes in signup" , err);

        let errorMessage;

        if(err instanceof Error){
            
             // USER ALREADY EXISTS
            if (err.message === "User already exists"){
                return res.status(409).json({
                    success: false,
                    message: err.message
                });
            }

            errorMessage = err.message

        }else if(typeof err === "string"){
            errorMessage = err;

        } else{
            errorMessage = err;
        }

        return res.status(500).json({
            success : false,
            message : "Internal server Error",
            error : errorMessage
        })
    }
}

export const login = async (
    req: Request,
    res: Response
) => {

    try {

        const { email, password } = req.body;

        // VALIDATION
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const response = await UserService.loginService({
            email,
            password
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: response
        });

    } catch (err: unknown) {

        console.log("Error comes in login", err);

        let errorMessage;

        if (err instanceof Error) {

            // INVALID CREDENTIALS

            if (err.message === "Invalid user") {
                return res.status(401).json({
                    success: false,
                    message: err.message
                });
            }

            if (err.message === "Incorrect Password") {
                return res.status(401).json({
                    success: false,
                    message: err.message
                });
            }

            errorMessage = err.message;

         } else if (typeof err === "string") {
            errorMessage = err;

        } else {
            errorMessage = "Unknown Error";
        }

        return res.status(500).json({
            success: false,
            message: "Internal server Error",
            error: errorMessage
        });
    }
};

