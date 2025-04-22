class Home {

    id: string;
    address: string;
    type: string;
    bedrooms: string;
    bathrooms: string;
    sqft: string;
    year_build: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;

    constructor(
        id?: string,
        address?: string,
        type?: string,
        bedrooms?: string,
        bathrooms?: string,
        sqft?: string,
        year_build?: string,
        first_name?: string,
        last_name?: string,
        email?: string,
        phone?: string

    ) {
        this.id = id || "";
        this.address = address || '';
        this.type = type || '';
        this.bedrooms = bedrooms || "";
        this.bathrooms = bathrooms || "";
        this.sqft = sqft || "";
        this.year_build = year_build || "";
        this.first_name = first_name || "";
        this.last_name = last_name || "";
        this.email = email || "";
        this.phone = phone || "";
    }
}

export default Home;