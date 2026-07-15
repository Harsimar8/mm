import * as L from 'leaflet';

import { EntityIconFactory } from '../../core/factories/EntityIconFactory';

export class LeafletIconFactory {

    static get(entityType: string): L.Icon {

        return L.icon({

            iconUrl: EntityIconFactory.get(entityType),

            iconSize: [32,32],

            iconAnchor: [16,16],

            popupAnchor: [0,-16]

        });

    }

}