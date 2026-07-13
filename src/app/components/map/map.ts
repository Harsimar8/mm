import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeafletMap } from '../leaflet-map/leaflet-map';
import { CesiumMap } from '../cesium-map/cesium-map';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    CommonModule,
    LeafletMap,
    CesiumMap
  ],
  templateUrl: './map.html',
  styleUrl: './map.css'
})
export class Map {

}