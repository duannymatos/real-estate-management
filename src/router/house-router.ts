import express, { Application, Response, Request, Router, NextFunction } from "express";
import { getAllHouses, getByYear, getByID, byRealtor, getByType, getByBedBath, getBySquareFeet, deleteHome, addNew, updateHome } from "../services/house-services"
import { validation } from "./userRouter";
import Home from "../models/house";
import jwt from "jsonwebtoken"


const houseRouter = Router();

//WILL RETURN ALL HOMES IN INVENTORY
//MUST BE REALTOR TO ACCESS INFORMATION
//IF USER IS NOT LOGGED IN, WILL RECEIVE ERROR MESSAGE
houseRouter.get('/inventory', async (req: Request, res: Response) => {

    // res.json(await getAllHouses());

    const token: any = req.headers["x-access-token"];

    if (token) {

        const decoded: any = jwt.decode(token);

        // let role: string = await validation(req.session.email, req.session.password)

        if (decoded.role === "broker") {
            const result = await getAllHouses();
            res.json(result)
        } else {
            res.json({ message: "Functionality reserved for Brokers: Login as Broker!" })
        }
    }
});

//WILL RETURN A LIST WITH ALL HOMES THAT MATCH YEAR RANGE
houseRouter.post('/year', async (req: Request, res: Response) => {

    res.json(await getByYear(req.body.min, req.body.max));

})

//WILL ENTER A NEW PROPERTY.
//IF UNSATISFIED INFORMATION IS ENTERED, WILL RETURN ERROR MESSAGE
houseRouter.post('/new', async (req: Request, res: Response) => {

    const token: any = req.headers["x-access-token"];

    if (token) {

        const decoded: any = jwt.decode(token);

        if (decoded.role.toLowerCase() === "broker" || decoded.role.toLowerCase() === "associate") {

            res.json(await addNew(
                req.body.street_address,
                req.body.type,
                req.body.bedrooms,
                req.body.bathrooms,
                req.body.sqft,
                req.body.year_built,
                req.body.realtor,
                req.body.price));

        } else {
            res.json({ message: "Functionality reserved for Sales associates and Brokers: Please login!" })
        }
    }
});

//WILL RETURN ALL HOMES LISTED BY REALTOR ENTERED
houseRouter.post('/realtor', async (req: Request, res: Response) => {

    res.json(await byRealtor(req.body.email));

});

//WILL RETURN ALL PROPERTIES THAT MATCH TYPE. IF INVALID TYPE IS
//ENTERED, FUNCTION WILL RETURN ERROR MESSAGE
houseRouter.post('/type', async (req: Request, res: Response) => {

    res.json(await getByType(req.body.type));
});

//WILL RETURN A LIST WITH ALL HOMES THAT MATCH BEDROOM/BATHROOM RANGE
houseRouter.post('/bedbath', async (req: Request, res: Response) => {

    res.json(await getByBedBath(req.body.minBed, req.body.maxBed, req.body.minBath, req.body.maxBath))
})

//WILL RETURN A LIST WITH ALL HOMES THAT MATCH SQUARE FEET RANGE
houseRouter.post('/squarefeet', async (req: Request, res: Response) => {

    res.json(await getBySquareFeet(req.body.min, req.body.max))
})

//WILL DELETE PROPERTY THAT MATCHES STREET ADDRESS AND REALTOR
houseRouter.delete('/delete', async (req: Request, res: Response) => {

    const token: any = req.headers["x-access-token"];

    if (token) {

        const { street_address, realtor } = req.body;

        const decoded: any = jwt.decode(token);

        if (decoded === null) {
            res.status(400).json({ message: "Invalid Token" })
        } else {
            if (decoded.role === "broker") {

                res.json(await deleteHome(street_address, realtor));
            } else {
                res.json({ Message: "Functionality reserved for Brokers: Login as Broker!" })
            }
        }
    }

})

//MUST RECEIVE ALL INFORMATION ABOUT PROPERTY AND WILL UPDATE WHOLE ROLE
//WHERE ADDRESS AND REALTOR MATCHES
houseRouter.put("/update", async (req: Request, res: Response) => {

    const token: any = req.headers["x-access-token"];

    if (token) {

        const decoded: any = jwt.decode(token);


        if (decoded === null) {

            res.status(400).json({ message: "Invalid Token" })

        } else if (decoded.role.toLowerCase() === "broker") {

            res.json(await updateHome(
                req.body.street_address,
                req.body.bedrooms,
                req.body.bathrooms,
                req.body.sqft,
                req.body.year_built,
                req.body.realtor,
                req.body.price));

        } else {
            res.json({ message: "Functionality reserved for Sales associates and Brokers: Please login!" })
        }

    }
})

//MUST KEEP AS LAST FUNCTION, DUE TO IT'S DEFAULT SEARCH
//WILL RETURN PROPERTY THAT MATCHES ID NUMBER, OTHERWIER
//WILL RETURN ERROR MESSAGE
houseRouter.get("/:id", async (req: Request, res: Response, next) => {

    const results: [string, Home[]] = await getByID(parseInt(req.params.id));
    res.setHeader('content-type', 'application/json');
    res.json(results);
});




export default houseRouter;