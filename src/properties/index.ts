export class FindOptions {
    page: number;
    limit: number;
    query: any;
    sortBy: string;
    order: number;

    constructor ({ page, limit, query, sort, order } : { page?: string, limit?: string, query?: string, sort?: string, order?: string }) {
        this.page = page != undefined ? parseInt(page) : 1;
        this.limit = limit != undefined ? parseInt(limit) : 10;
        this.sortBy = sort != undefined ? sort : 'createdAt';
        this.order = order != undefined ? parseInt(order) : -1;
        this.query = new RegExp(query != undefined ? query : '', "gi");
    }
}

export class WovOptions {
    page: number;
    limit: number;
    query: any;
    sortBy: string;
    order: number;

    constructor ({ page, limit, sort, order, firstName, lastName, fullName, address, profession, satellite, city, country } : 
        { 
            page?: string, 
            limit?: string, 
            sort?: string, 
            order?: string, 
            firstName?: string, 
            lastName?: string, 
            fullName?: string, 
            address?: string, 
            profession?: string, 
            satellite?: string, 
            city?: string, 
            country?: string 
        }) {
        this.page = page != undefined ? parseInt(page) : 1;
        this.limit = limit != undefined ? parseInt(limit) : 10;
        this.sortBy = sort != undefined ? sort : 'createdAt';
        this.order = order != undefined ? parseInt(order) : -1;
        this.query = {
            firstName: new RegExp(firstName != undefined ? firstName : '', "gi"),
            lastName: new RegExp(lastName != undefined ? lastName : '', "gi"),
            address: new RegExp(address != undefined ? address : '', "gi"),
            satellite: new RegExp(satellite != undefined ? satellite : '', "gi"),
            city: new RegExp(city != undefined ? city : '', "gi"),
            country: new RegExp(country != undefined ? country : '', "gi"),
        }
    }
}