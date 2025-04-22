import { Client } from "pg";

const client = ({
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    Max: 10
});


async function sql(sent: string, search: any[]): Promise<string[][]> {
    const query = {
        rowMode: "array",
        text: `${sent}`
    };
    const sql: Client = new Client(client);
    await sql.connect();
    const results = await sql.query(query, search);
    sql.end();
    return results.rows;
}


export { sql };