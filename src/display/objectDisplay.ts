import Home from "../models/house";
import Realtor from "../models/realtor"
import { sql } from "../dbConfig";

//THIS FUNCTION RECEIVED THE QUERY STRING AND QUERY ARGUMENTS AND A HOME OBJECT
//FOR EACH ROW FOUND IN QUERY
async function homeDisplay(query: string, args: string[]): Promise<Home[]> {

    const results = await sql(query, args);

    let a = [];

    for (let i = 0; i < results.length; i++) {
        a.push(new Home(...results[i]))
    };

    return a;

};

//RETURNS A NEW REALTOR OBJECT
async function realtorDisplay(query: string, args: string[]): Promise<Realtor[]> {

    const results = await sql(query, args);

    let a = [];

    for (let i = 0; i < results.length; i++) {
        a.push(new Realtor(...results[i]))
    };

    return a;

};

export { homeDisplay, realtorDisplay }