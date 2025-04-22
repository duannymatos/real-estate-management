import { sql } from "../dbConfig";
import Home from "../models/house";
import { checkYear, minMax, queryString, validateNewHome, validateUpdate, checkEmail } from "../models/validation"
import { homeDisplay } from "../display/objectDisplay"

// const queryString = `SELECT i.id, i.street_address, i.type, i.bedrooms, i.bathrooms, i.sqft, i.year_built, r.first_name, r.last_name, r.email, r.phone
// FROM inventory as i LEFT join realtors as r ON i.realtor = r.email`;

// THIS FUNCTION WILL RETURN ALL HOUSES
async function getAllHouses(): Promise<[string, Home[]]> {

    const results = await homeDisplay(queryString, []);
    return [`${results.length} PROPERTIES IN INVENTOTY`, results]
}

//THIS FUNCTION MUST RECEIVE A MINIMUM AND NUMBER THAT REPRESENT YEAR AND WILL RETURN HOMES WITHIN THAT YEAR RANGE
async function getByYear(min: string, max: string): Promise<[string, Home[]]> {

    const minUse = min;
    const maxUse = max;

    const year = checkYear(minUse, maxUse);

    if (year) {
        return [`${year}`, []];

    } else {
        const results = await homeDisplay(`${queryString} WHERE year_built BETWEEN $1 AND $2`, [min, max]);
        return [`${results.length} RESULTS FOUND`, results]
    }
}

//THIS FUNCTION MUST RECEIVE A MINIMUM AND NUMBER THAT REPRESENT BATHROOMS AND WILL RETURN HOMES WITHIN THAT YEAR RANGE
async function getByBedBath(minBed: string, maxBed: string, minBath: string, maxBath: string): Promise<[string, Home[]]> {

    const checkMinMaxBed = minMax(minBed, maxBed);
    const checkMinMaxBath = minMax(minBath, maxBath);

    if (checkMinMaxBed) {
        return [`${checkMinMaxBed} for bedrooms`, []];
    } else if (checkMinMaxBath) {
        return [`${checkMinMaxBath} for bathrooms`, []];
    } else {
        const results = await homeDisplay(`${queryString} WHERE bedrooms BETWEEN $1 AND $2 and bathrooms between $3 and $4`, [minBed, maxBed, minBath, maxBath]);
        return [`${results.length} RESULTS FOUND`, results]
    }

}

//THIS FUNCTION MUST RECEIVE A MINIMUM AND NUMBER THAT REPRESENT BATHROOMS AND WILL RETURN HOMES WITHIN THAT YEAR RANGE
async function getBySquareFeet(min: string, max: string): Promise<[string, Home[]]> {

    const minUse = min;
    const maxUse = max

    const checkMinMax = minMax(minUse, maxUse);

    if (checkMinMax) {
        return [`${checkMinMax}`, []];
    } else {
        const results = await homeDisplay(`${queryString} WHERE sqft BETWEEN $1 AND $2`, [minUse, maxUse]);
        return [`${results.length} RESULTS FOUND`, results]
    }

}

//THIS FUNCTION WILL RECEIVE AN EMAIL, CHECK IF IT CONTAINS A '@' AND IF PASSES, WILL RETURN
// ALL HOMES LISTED BY THAT REALTOR
async function byRealtor(email: string): Promise<[string, Home[]]> {

    if (!checkEmail(email)) {

        return ["Please enter valid Email", []];

    } else {

        const results = await sql(`${queryString} WHERE realtor = $1`, [email]);

        if (!results) {
            return ["Realtor not found", []]
        } else {
            const results = await homeDisplay(`${queryString} WHERE realtor = $1`, [email]);
            return [`${results.length} RESULTS FOUND`, results]
        }
    }
}


//THIS FUNCTION WILL RECEIVE AN ID NUMBER, QUERY THE DB AND RETURN
//THE HOUSE THAT MATCHES THAT ID OR WILL RETURN ERROR MESSAGE
async function getByID(id: number): Promise<[string, Home[]]> {

    if (isNaN(id)) {

        return ["Please enter a number", []];

    } else {
        const results = await sql(`${queryString} WHERE i.id = $1`, [id]);

        if (!results.length) {
            return [`House with ID #${id} was not fount`, []];
        } else {

            const results = await homeDisplay(`${queryString} WHERE i.id = $1`, [id + ""]);
            return [`${results.length} RESULTS FOUND`, results]
        }
    }

}

//THIS FUNCTION WILL RECEIVE A PROPERTY TYPE, CHECK IF IT IS THE TYPE SPECIFIED IN VARIABLE "TYPES" AND,
//IF SO, WILL RETURN A HOME OBJECT FOR EACH ROW FOUND, OTHERWISE, WILL RETURN ERROR MESSAGE
async function getByType(propertyType: string): Promise<[string, Home[]]> {
    let type = propertyType.toLowerCase();
    let types = ["condo", "townhouse", "single family", "villa"];

    if (!(types.indexOf(type) > -1)) {
        return ["Please choose either Condo, Single Family, Townhouse or Villa", []];
    } else {

        const results = await homeDisplay(`${queryString} WHERE type = $1`, [type]);
        return [`${results.length} RESULTS FOUND`, results];

    }
}

//THIS FUNCTION WILL DELETE A PROPERTY IN CASE ADDRESS AND REALTOR EMAIL
//MATCHES THE THE DATABASE
async function deleteHome(address: string, realtor: string): Promise<string> {

    const result = await sql(`select * from inventory where street_address = $1 and realtor = $2`, [address, realtor]);

    if (!address || !realtor) {

        return "Please fill out all fields";

    } else if (!result.length) {

        return "Property not found";

    } else {

        const message = `${address} <---- HAS BEEN DELETED`;

        await sql(`DELETE FROM inventory WHERE street_address = $1 AND realtor = $2`, [address, realtor])

        return message;
    }
}

//THIS FUNCTION WILL ADD A NEW PROPERTY IN CASE ENTERED FIELDS PASS DATA VALIDATION.
//FILLING ALL FIELDS IS A REQUIREMENT
async function addNew(add: string, type: string, bed: number, bath: number, sqft: number, year: number, realtor: string, price: number): Promise<string> {

    let validation = await validateNewHome(add, type, bed, bath, sqft, year, realtor, price);

    if (validation.includes("pass")) {

        sql(`insert into inventory (street_address, type, bedrooms, bathrooms, sqft, year_built, realtor, price)
            values ($1, $2, $3, $4, $5, $6, $7, $8)`, [add, type, bed, bath, sqft, year, realtor, price]);

        return `Your property at ${add} has been sucessfully registered`

    } else {
        return validation;
    }
}

//THIS FUNCTION WILL UPDATE A PROPERTY IF ADDRESS AND REALTOR MATCHES.
//FILLING ALL FIELDS IS A REQUIREMENT
async function updateHome(add: string, bed: number, bath: number, sqft: number, year: number, realtor: string, price: number): Promise<string> {

    let validation = await validateUpdate(add, bed, bath, sqft, year, realtor, price);

    if (validation.includes("pass")) {

        await sql(`update inventory set (street_address, bedrooms, bathrooms, sqft, year_built, realtor, price) = 
        ($1, $2, $3, $4, $5, $6, $7) where street_address = 
        $1 and realtor = $6`, [add, bed, bath, sqft, year, realtor, price]);

        // console.table(await sql("select * from inventory", []));

        return `Your property at ${add} has been sucessfully updated`

    } else {
        return validation;
    }
}


export {
    getAllHouses,
    getByYear,
    getByID,
    byRealtor,
    getByType,
    getByBedBath,
    getBySquareFeet,
    deleteHome,
    addNew,
    updateHome,
}