const ICONS: Record<string, string> = {

  RadarSite: 'radar.jpg',

  Aircraft: 'aircraft.png',

  SamBattery: 'sam.png',

  Ship: 'ship.png',

  GroundTarget: 'target.png'

};

export class EntityIconFactory {

    static get(entityType: string): string {

        return `assets/${ICONS[entityType] ?? 'default.png'}`;

    }

}