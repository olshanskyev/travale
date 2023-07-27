declare type DestinationType = 'country' | 'city' | 'popular_destinations';

export abstract class Destination {

    constructor(type: DestinationType) {
        this.type = type;
    }
    type: DestinationType;
}

export class PopularDestinations extends Destination {
    constructor() {
        super('popular_destinations');
    }
}