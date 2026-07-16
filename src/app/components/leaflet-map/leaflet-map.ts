import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  effect,
  inject
} from '@angular/core';


import { MapSyncService } from '../../core/services/MapSync';
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
export class LeafletMap implements AfterViewInit, OnDestroy {

  constructor(
    private editorState: EditorState,
    private entityRepository: EntityRepository
  ) {

    effect(() => {

      console.log("Leaflet effect", this.mapSync.state());
      if (!this.map) return;

      const state = this.mapSync.state();
      if (state.source === 'leaflet') {
        return;
      }

      const center = this.map.getCenter();

      if (
        Math.abs(center.lat - state.latitude) > 0.0001 ||
        Math.abs(center.lng - state.longitude) > 0.0001 ||
        this.map.getZoom() !== state.zoom
      ) {

        this.syncing = true;

this.map.setView(
    [state.latitude, state.longitude],
    state.zoom,
    {
        animate: false
    }
);

clearTimeout(this.syncTimeout);

this.syncTimeout = setTimeout(() => {

    this.syncing = false;

}, 100);
      }

    });

    effect(() => {

      const entities = this.entityRepository.all();

      if (this.renderer) {

        this.renderer.render(entities);

      }

    });
  }
  @ViewChild('mapContainer', { static: true })
  mapContainer!: ElementRef<HTMLDivElement>;


  private map!: L.Map;
  private renderer!: LeafletEntityRenderer;
  private readonly mapSync = inject(MapSyncService);
  private syncing = false;
  private syncTimeout?: ReturnType<typeof setTimeout>;

  ngAfterViewInit(): void {

    this.initializeMap();


  }

  private initializeMap(): void {

    this.map = L.map(this.mapContainer.nativeElement, {
      center: [20.5937, 78.9629],
      zoom: 5
    });
    this.map.on("moveend", () => {

      if (this.syncing) {
        return;
      }

      const center = this.map.getCenter();

      clearTimeout(this.syncTimeout);

this.syncTimeout = setTimeout(() => {

  this.mapSync.update({

    latitude: center.lat,

    longitude: center.lng,

    zoom: this.map.getZoom(),

    source: 'leaflet'

  });

}, 30);

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


    console.log("Entity added:", entity);

  }
  ngOnDestroy(): void {

    this.map.remove();

  }

}