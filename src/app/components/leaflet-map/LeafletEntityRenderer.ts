import * as L from 'leaflet';
import { EditorState } from '../../core/state/EditorState';
import { Entity } from '../../core/models/Entity';

export class LeafletEntityRenderer {

  private readonly markers = new Map<string, L.Layer>();
  constructor(
    private map: L.Map,
      private editorState: EditorState
  ) {}

  render(entities: Entity[]): void {

    // Remove old markers
    this.markers.forEach(marker => marker.remove());

    this.markers.clear();

    // Draw all entities
    for (const entity of entities) {

          const marker = L.circleMarker(
  [
    entity.position.latitude,
    entity.position.longitude
  ],
  {
    radius: 8,
    color: '#0066ff',
    fillColor: '#3399ff',
    fillOpacity: 1
  }
);

marker.bindPopup(entity.definition.name);
marker.on('click', () => {

  this.editorState.selectedEntity.set(entity);

  console.log("Selected Entity:", entity);

});

marker.addTo(this.map);

// Change the type of markers map to L.Layer
this.markers.set(entity.id, marker);

    }

  }

}