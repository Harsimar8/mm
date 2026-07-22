const ICONS: Record<string, string> = {

  RadarSite: 'radar.png',

  Aircraft: 'aircraft.png',
  AWACS : 'awacs.png',
  

  SamBattery: 'sam.png',

  Ship: 'ship.png',

  GroundTarget: 'target.png'

};

export class EntityIconFactory {

    static get(entityType: string): string {

        return `assets/${ICONS[entityType] ?? 'default.png'}`;

    }

}