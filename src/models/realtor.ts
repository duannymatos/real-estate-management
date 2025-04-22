class Realtor {

    id: string;
    first_name: string;
    last_name: string;
    license: string;
    email: string;
    phone: string;


    constructor(
        id?: string,
        first_name?: string,
        last_name?: string,
        license?: string,
        email?: string,
        phone?: string


    ) {
        this.id = id || "";
        this.first_name = first_name || "";
        this.last_name = last_name || "";
        this.license = license || "";
        this.email = email || "";
        this.phone = phone || "";
    }
}

export default Realtor;