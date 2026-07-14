import { Injectable, signal } from '@angular/core';
import { MapViewState } from '../models/MapViewState';


@Injectable({
  providedIn: 'root'
})
export class MapSyncService {

  private readonly viewState = signal<MapViewState>({

    latitude: 20,

    longitude: 78,

    zoom: 5,

    source: 'leaflet'

  });

  readonly state = this.viewState.asReadonly();

  update(view: MapViewState): void {

    this.viewState.set(view);

  }

  leafletZoomToHeight(zoom: number): number {

    return 40075016 / Math.pow(2, zoom);

  }

  heightToLeafletZoom(height: number): number {

    return Math.round(
      Math.log2(40075016 / height)
    );

  }

}