import Realtor from "../models/realtor";
import { sql } from "../dbConfig";
import { checkEmail } from "../models/validation";
import { formatPhoneNumber } from "../models/formating";
import { realtorDisplay } from "../display/objectDisplay"
import bcrypt from 'bcrypt';

//WILL CHECK IF ENTERED LOGIN EMAIL AND PASSWORD MATCH DATABASE AND RETURN
//REALTOR INFORMATION OR ERROR MESSAGE
async function login(email: string, password: string): Promise<[string, Realtor[]]> {
    const emailUse = email.toLowerCase();

    const results = await sql(
        `SELECT id, first_name, last_name, license, email, phone, password FROM realtors WHERE email = $1`,
        [emailUse]
    );

    if (!results.length) {
        return ['Invalid Email', []];
    }

    const user: any = results[0];

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (user.email === emailUse && passwordMatch) {
        return [
            "USER LOGGED IN - USER INFORMATION",
            await realtorDisplay(`SELECT * FROM realtors WHERE email = $1`, [emailUse])
        ];
    } else {
        return ['Invalid password', []];
    }
}

//WILL RETURN ALL REALTORS FOUND IN RALTORS TABLE IN DATABASE
async function showAllRealtors(field: string, sort: string): Promise<[string, Realtor[]]> {

    let fieldUse: string = field;
    let sortUse: string = sort;

    const results = await sql("SELECT * FROM REALTORS", [])


    if (sortUse === "asc") {
        return [`${results.length} REALTORS FOUND`, await realtorDisplay(`SELECT * FROM realtors order by ${fieldUse} asc`, [])];
    } else if (sortUse === "desc") {
        return [`${results.length} REALTORS FOUND`, await realtorDisplay(`SELECT * FROM realtors order by ${fieldUse} desc`, [])];
    } else {
        return ["Please select sort as ASC or DESC", []];
    };
}

//ALLOWS REALTORS TO REGISTER TO THE DATABASE. IF ENTERED INFORMATION DOES NOT PASS DATA VALIDATION
//WILL RETURN ERROR MESASGE
async function userRegistration(firstName: string, lastName: string, email: string, phone: number, password: string): Promise<string> {

    const phoneFormat = phone;

    let emailLower = email.toLowerCase();

    const formatPhone = formatPhoneNumber(phoneFormat);

    let flag = true;

    if (phone && !formatPhone) {
        return 'Please enter valid phone number';

    } else if (!firstName || !lastName || !email || !formatPhone || !password) {
        return 'Please fill out all fields';

        flag = false;

    } else if (!checkEmail(email)) {
        return 'Please enter valid email';

    } else if (password.length < 8) {
        return 'Password must be greater than 8 characters';
    } else {
        const results = await sql('SELECT * FROM realtors WHERE email = $1', [emailLower]);

        if (results.length > 0) {
            return `${email} already in use`;
        } else {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            await sql(`INSERT INTO realtors (first_name, last_name, license, email, phone, password) 
                       VALUES ($1, $2, 'associate', $3, $4, $5)`,
                [firstName, lastName, emailLower, formatPhone, hashedPassword]);

            return `Greetings, ${firstName}. your account has been successfully registered`;
        }
    }
}

export { realtorDisplay, formatPhoneNumber, checkEmail, login, userRegistration, showAllRealtors };