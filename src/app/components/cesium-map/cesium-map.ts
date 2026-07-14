import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject,
  effect
} from '@angular/core';

import * as Cesium from 'cesium';

import { MapSyncService } from '../../core/services/MapSync';


Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNzFhZjQzZC0xNGNmLTQyNDAtOTFlMC1jMmEyMDQwOTExNDAiLCJpZCI6NDQyMjYxLCJzdWIiOiJIYXJzaW1hcjA4IiwiaXNzIjoiaHR0cHM6Ly9hcGkuY2VzaXVtLmNvbSIsImF1ZCI6Im1pc3Npb24iLCJpYXQiOjE3ODQwMDU4MjB9.NzxkVB0Hlz8uYySEa5PaSg7bycWumdeeUXiaJgk57XY';
@Component({
  selector: 'app-cesium-map',
  standalone: true,
  imports: [],
  templateUrl: './cesium-map.html',
  styleUrl: './cesium-map.css'
})
export class CesiumMap implements AfterViewInit, OnDestroy {

constructor() {

  effect(() => {

      console.log("Cesium effect", this.mapSync.state());

    if (!this.viewer) return;

    const state = this.mapSync.state();
    if (state.source === 'cesium') {
  return;
}

    const current = this.viewer.camera.positionCartographic;

    const lat = Cesium.Math.toDegrees(current.latitude);
    const lon = Cesium.Math.toDegrees(current.longitude);

    if (

      Math.abs(lat - state.latitude) > 0.0001 ||

      Math.abs(lon - state.longitude) > 0.0001

    ) {
         this.syncing = true;

this.viewer.camera.setView({

  destination: Cesium.Cartesian3.fromDegrees(
    state.longitude,
    state.latitude,
    this.mapSync.leafletZoomToHeight(state.zoom)
  )

});

clearTimeout(this.syncTimeout);

this.syncTimeout = setTimeout(() => {

  this.syncing = false;

}, 100);
    }

  });

}
   
@ViewChild('cesiumContainer', { static: true })
cesiumContainer!: ElementRef<HTMLDivElement>;

  private viewer!: Cesium.Viewer;
  private readonly mapSync = inject(MapSyncService);
   private syncing = false;
   private syncTimeout?: ReturnType<typeof setTimeout>;

ngAfterViewInit(): void {
  this.viewer = new Cesium.Viewer(
    this.cesiumContainer.nativeElement,
    {
      terrain: Cesium.Terrain.fromWorldTerrain()
    }
  );

  this.viewer.camera.changed.addEventListener(() => {

    if (this.syncing) {
    return;
}
    console.log("Cesium moved");

    const cartographic = Cesium.Cartographic.fromCartesian(
      this.viewer.camera.position
    );

      clearTimeout(this.syncTimeout);

this.syncTimeout = setTimeout(() => {

  this.mapSync.update({

    latitude: Cesium.Math.toDegrees(cartographic.latitude),

    longitude: Cesium.Math.toDegrees(cartographic.longitude),

    zoom: this.mapSync.heightToLeafletZoom(
      this.viewer.camera.positionCartographic.height
    ),

    source: 'cesium'

  });

}, 30);

  });

}

ngOnDestroy(): void {

  this.viewer.destroy();

}

}