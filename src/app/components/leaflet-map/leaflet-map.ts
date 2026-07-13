import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  effect
} from '@angular/core';

import { LeafletEntityRenderer } from './LeafletEntityRenderer';
import { EditorState } from '../../core/state/EditorState';
import { EntityRepository } from '../../core/services/EntityRepository';
import { EntityFactory } from '../../core/factories/EntityFactory';
import { Position } from '../../core/models/Position';
import * as L from 'leaflet';

@Component({
  selector: 'app-leaflet-map',
  standalone: true,
  imports: [],
  templateUrl: './leaflet-map.html',
  styleUrl: './leaflet-map.css'
})
export class LeafletMap implements AfterViewInit, OnDestroy
 {

  constructor(
  private editorState: EditorState,
  private entityRepository: EntityRepository
) {}
  @ViewChild('mapContainer', { static: true })
  mapContainer!: ElementRef<HTMLDivElement>;

  private map!: L.Map;
  private renderer!: LeafletEntityRenderer;

  ngAfterViewInit(): void {

    this.initializeMap();

  }

  private initializeMap(): void {

  this.map = L.map(this.mapContainer.nativeElement, {
    center: [20.5937, 78.9629],
    zoom: 5
  });

  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: '&copy; OpenStreetMap contributors'
    }
  ).addTo(this.map);
  this.renderer = new LeafletEntityRenderer(
  this.map,
  this.editorState
);
this.renderer.render(this.entityRepository.all());
  this.map.on('click', this.onMapClick.bind(this));

  setTimeout(() => {
    this.map.invalidateSize();
  }, 500);

}

private onMapClick(event: L.LeafletMouseEvent): void {

  const asset = this.editorState.selectedAsset();

  if (!asset) {

    console.log("No asset selected.");

    return;

  }

  const position = new Position(

    event.latlng.lat,

    event.latlng.lng,

    0

  );

  const entity = EntityFactory.create(

    asset,

    position,

    this.editorState.selectedTeam()

  );

  this.entityRepository.add(entity);
  this.renderer.render(this.entityRepository.all());

  console.log("Entity added:", entity);

}
  ngOnDestroy(): void {

    this.map.remove();

  }

}