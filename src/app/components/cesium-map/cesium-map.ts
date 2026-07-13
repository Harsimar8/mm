import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild
} from '@angular/core';
import * as Cesium from 'cesium';

@Component({
  selector: 'app-cesium-map',
  standalone: true,
  imports: [],
  templateUrl: './cesium-map.html',
  styleUrl: './cesium-map.css'
})
export class CesiumMap implements AfterViewInit, OnDestroy {

  @ViewChild('cesiumContainer', { static: true })
  cesiumContainer!: ElementRef<HTMLDivElement>;


    private viewer!: Cesium.Viewer;
  ngAfterViewInit(): void {
this.viewer = new Cesium.Viewer(
  this.cesiumContainer.nativeElement
);
  }

  ngOnDestroy(): void {

  }

}