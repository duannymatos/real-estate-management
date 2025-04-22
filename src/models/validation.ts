import { sql } from "../dbConfig";

const queryString = `SELECT i.id, i.street_address, i.type, i.bedrooms, i.bathrooms, i.sqft, i.year_built, r.first_name, r.last_name, r.email, r.phone
FROM inventory as i LEFT join realtors as r ON i.realtor = r.email`;

//THIS FUNCTION WILL RECEIVE A MIN NUMBER AND MAX NUMBER, CHECK IF THEY ARE ACTUAL NUMBERS
//IF SO, FUNCTION WILL RETURN NULL, OTHERWISE, WILL RETURN WITH ERROR MESSAGE.
function minMax(min: string | undefined, max: string | undefined): string | undefined {

    if (!min || !max) {

        if (!min) {
            return "Please enter MIN"
        } return "Please enter MAX"
    }


    let minInt = parseInt(min);
    let maxInt = parseInt(max);


    if (isNaN(minInt) || isNaN(maxInt)) {

        return "Please enter a number"
    } else if ((minInt > maxInt)) {

        return "MIN cannot be larger then MAX"

    } else if (minInt < 0) {

        return "Neither MIN nor MAX can be less than 0"
    } else {
        return
    }
}

//THIS FUNCTION WILL RECEIVE A MIN(YEAR) NUMBER AND MAX(YEAR) NUMBER, CHECK IF THEY ARE ACTUAL NUMBERS
//IF SO, FUNCTION WILL RETURN NULL, OTHERWISE, WILL RETURN WITH ERROR MESSAGE.
function checkYear(min: string | undefined, max: string | undefined): string | undefined {

    let year: number = new Date().getFullYear();

    if (!min || !max) {

        if (!min) {
            return "Please enter MIN year"
        } else {
            return "Please enter MAX year"
        }
    }

    let minInt = parseInt(min);
    let maxInt = parseInt(max);


    if (isNaN(minInt) || isNaN(maxInt)) {

        return "Please enter a number"
    }
    if ((minInt > maxInt)) {

        return "MIN cannot be larger then MAX"
    } else if (minInt < 0) {

        return "Neither MIN nor MAX can be less than 0"
    } else if (maxInt > year) {

        return `Max cannot be greater then ${year}`
    } else {
        return
    }

}

//THIS CODE WILL VALIDATE IF EVERY FIELD IS ENTERED CORRECTLY FOR A NEW HOME.
//IF ANYTHING IS NOT ENTERES PROPERLY, AN ERROR MESSAGE WILL RETURN.
async function validateNewHome(add: string, type: string, bed: number, bath: number, sqft: number, year: number, realtor: string, price: number): Promise<string> {

    let thisYear: number = new Date().getFullYear();

    const validateRealtor = await sql("select * from realtors where email = $1", [realtor]);
    const validateAddress = await sql("select * from inventory where street_address = $1", [add]);

    let typeUse = type.toLowerCase();
    let types = ["condo", "townhouse", "single family", "villa"];

    if (!add || !type || !bed || !bath || !sqft || !year || !realtor || !price) {

        return "Please fill all fields";

    } else if (!(types.indexOf(type) > -1)) {

        return "Please choose either Condo, Single Family, Townhouse or Villa for type";

    } else if (bed < 0 || bath < 0 || isNaN(bed) || isNaN(bath)) {

        return "Please enter valid bedroom/bathroom quantity";

    } else if (price < 0 || isNaN(price) || price < ((sqft * 155) * .80) || price > ((sqft * 155) * 1.50)) {

        if (price < (sqft * 155) * .80) {
            console.log("price below 80%")
            return "Price 20% below market value. Please enter valid price";
        } else if ((sqft * 155) * 1.50) {
            console.log("price above 80%")
            return "Price 50% above market value. Please enter valid price";
        } else {
            console.log("invalid price")
            return "Please enter valid price";
        }

    } else if (sqft < 0 || isNaN(sqft)) {

        return "Please enter valid sqft quantity";

    } else if (year < 0 || year > thisYear || isNaN(year)) {

        return "Please enter valid year built";

    } else if (!validateRealtor.length) {

        return "Please enter valid realtor";
    } else if (validateAddress.length) {
        return "Property already registered";
    } else {
        return "pass"
    }
}

//THIS CODE WILL VALIDATE IF EVERY FIELD IS ENTERED CORRECTLY FOR UPDATING.
//IF ANYTHING IS NOT ENTERES PROPERLY, AN ERROR MESSAGE WILL RETURN.
async function validateUpdate(add: string, bed: number, bath: number, sqft: number, year: number, realtor: string, price: number): Promise<string> {

    let thisYear: number = new Date().getFullYear();

    const validateRealtor = await sql("select * from realtors where email = $1", [realtor]);
    const validateAddress = await sql("select * from inventory where street_address = $1", [add]);


    let types = ["condo", "townhouse", "single family", "villa"];

    if (!add || !bed || !bath || !sqft || !year || !realtor || !price) {

        return "Please fill all fields";

    } else if (bed < 0 || bath < 0 || isNaN(bed) || isNaN(bath)) {

        return "Please enter valid bedroom/bathroom quantity";

    } else if (price < 0 || isNaN(price) || price < ((sqft * 155) * .80) || price > ((sqft * 155) * 1.50)) {

        if (price < (sqft * 155) * .80) {
            console.log("price below 80%")
            return "Price 20% below market value. Please enter valid price";
        } else if ((sqft * 155) * 1.50) {
            return "Price 50% above market value. Please enter valid price";
        } else {
            return "Please enter valid price";
        }

    } else if (sqft < 0 || isNaN(sqft)) {

        return "Please enter valid sqft quantity";

    } else if (year < 0 || year > thisYear || isNaN(year)) {

        return "Please enter valid year built";

    } else if (!validateRealtor.length) {

        return "Please enter valid realtor";

    } else if (!validateAddress.length) {

        return "Property not registered";

    } else {

        return "pass"
    }
}

//FUNCTION WILL TEST IS EMAIL CONTAINS "@"
//RETURNS A BOOLEAN
function checkEmail(email: string): boolean {
    if (!email.includes('@')) {
        return false
    } else {
        return true
    }
}




export { checkYear, minMax, queryString, validateNewHome, validateUpdate, checkEmail }