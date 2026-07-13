import * as L from 'leaflet';

const ICONS: Record<string, string> = {

  RadarSite: 'radar.jpg',

  Aircraft: 'aircraft.png',

  SamBattery: 'sam.png',

  Ship: 'ship.png',

  GroundTarget: 'target.png'

};


export class LeafletIconFactory {

    

  static get(entityType: string): L.Icon {

    const file = ICONS[entityType] ?? 'default.png';

    return L.icon({

      iconUrl: `assets/${file}`,

      iconSize: [32, 32],

      iconAnchor: [16, 16],

      popupAnchor: [0, -16]

    });

  }

}