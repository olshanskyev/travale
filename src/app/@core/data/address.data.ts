
export interface AddressServiceData {
    getAddress(lat: number, lng: number, zoom: number): Promise<any>;
}
