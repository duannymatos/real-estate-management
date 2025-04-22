import express, { Application, Response, Request, Router } from "express";
import { sql } from "../dbConfig";
import Realtor from "../models/house";
import { realtorDisplay, formatPhoneNumber, checkEmail, login, userRegistration, showAllRealtors } from "../services/realtor-service";
import jwt from "jsonwebtoken"


const userRouter = Router();

const secret = "secret-test"

//WILL CHECK IF ENTERED LOGIN EMAIL AND PASSWORD MATCH DATABASE AND RETURN
//REALTOR INFORMATION OR ERROR MESSAGE
userRouter.post('/login', async (req: Request, res: Response) => {

    const result = await login(req.body.email, req.body.password);

    if (result[0].includes("Invalid")) {

        res.status(400).json(result);

    } else {

        const token = jwt.sign({ role: result[1][0].license, email: result[1][0].email, first_name: result[1][0].first_name }, secret, { expiresIn: 3600 })

        // if (req.session) {
        //     req.session.password = req.body.password
        //     req.session.email = req.body.email
        // };

        res.status(200).json({ token: token, auth: true });
    }
});

//WILL REGISTER USER AS LONG AS 
userRouter.post('/register', async (req: Request, res: Response) => {


    const token: any = req.headers["x-access-token"];

    if (token) {

        const decoded: any = jwt.decode(token);

        if (decoded.role === "broker") {
            res.json(await userRegistration(
                req.body.first_name,
                req.body.last_name,
                req.body.email,
                req.body.phone,
                req.body.password));
        };
    } else {
        res.json({ message: "Functionality reserved for Brokers: Login as Broker!" })
    }

});



// WILL LOGOUT BY DELETING COOKIE INFORMATION
userRouter.get("/logout", (req: Request, res: Response) => {

    const token: any = req.headers["x-acces-token"]
    const decoded = jwt.decode(token);

    // req.session?.destroy(() => {

    //     //WILL DESTROY SESSION COOKIE DATA

    // });

    res.status(200).json({ Message: "USER LOGGED OUT" })
});


//THIS FUNCTION WILL DISPLAY ALL REALTORS
userRouter.post("/showall", async (req: Request, res: Response) => {

    res.json(await showAllRealtors(req.body.field, req.body.sort));

})


// WILL RECEIVE AN EMAIL AND PASSWORD, USE EMAIL TO PULL FULL ROW OF USER INTO AN ARRAY AND COMPARE PASSWORD WITH THE PASSWORD INDEX OF THE ARRAY.
// IF EMAIL AND PASSWORD MATCH, FUNCTION RETURNS USER'S ROLE.
async function validation(email: string, password: string): Promise<string> {
    if (email || password) {

        let results: string[][] = await sql(`SELECT * FROM realtors WHERE email = $1`, [email.toLowerCase()]);

        if (results.length && results[0][4] === email.toLowerCase() && results[0][6] === password) {

            let role: string = results[0][3];

            return role;
        }
    }

    return ""

}


export { userRouter, validation };