import * as L from 'leaflet';
import { EditorState } from '../../core/state/EditorState';
import { Entity } from '../../core/models/Entity';
import { LeafletIconFactory } from './LeafletIconFactory';
import { LeafletSelection } from "./LeafletSelection";

export class LeafletEntityRenderer {

  private readonly markers = new Map<string, L.Marker>();
  constructor(
    private map: L.Map,
    private selection: LeafletSelection
) {}

  render(entities: Entity[]): void {

    
    // Remove old markers
    this.markers.forEach(marker => marker.remove());

    this.markers.clear();

    // Draw all entities
    for (const entity of entities) {

          const marker = L.marker(
  [
    entity.position.latitude,
    entity.position.longitude
  ],
  {
   icon: LeafletIconFactory.get(
  entity.definition.entityType
),
    draggable: true
  }
);

marker.bindPopup(entity.definition.name);
marker.bindTooltip(

  `
  <b>${entity.definition.name}</b><br>
  Type: ${entity.definition.entityType}<br>
  Role: ${entity.definition.role}<br>
  Team: ${entity.team}
  `,

  {
    direction: 'top',
    offset: [0, -10]
  }

);
marker.on('click', () => {

    this.selection.select(entity);

});

marker.on('dragend', (event) => {

  const position = event.target.getLatLng();

  entity.position.latitude = position.lat;

  entity.position.longitude = position.lng;

  console.log("Entity moved:", entity);

});
marker.addTo(this.map);

// Change the type of markers map to L.Layer
this.markers.set(entity.id, marker);

    }

  }

  


}