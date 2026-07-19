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
import { CesiumEntityRenderer } from "./CesiumEntityRenderer";
import { EntityRepository } from "../../core/services/EntityRepository";
import { EditorState } from '../../core/state/EditorState';
import { EntityFactory } from '../../core/factories/EntityFactory';
import { Position } from '../../core/models/Position';
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


    effect(() => {

      const entities = this.entityRepository.all();

      if (this.renderer) {

        this.renderer.render(entities);

      }

    });

  }

  @ViewChild('cesiumContainer', { static: true })
  cesiumContainer!: ElementRef<HTMLDivElement>;

  private viewer!: Cesium.Viewer;
  private readonly mapSync = inject(MapSyncService);
  private renderer!: CesiumEntityRenderer;
 
  private readonly entityRepository = inject(EntityRepository);
   private readonly editorState = inject(EditorState);
   private hoveredEntity?: Cesium.Entity;

  private syncing = false;
  private syncTimeout?: ReturnType<typeof setTimeout>;

  ngAfterViewInit(): void {

  this.viewer = new Cesium.Viewer(
    this.cesiumContainer.nativeElement,
    {
      terrain: Cesium.Terrain.fromWorldTerrain()
    }
  );


  this.renderer = new CesiumEntityRenderer(this.viewer);

  this.renderer.render(this.entityRepository.all());


  const handler = new Cesium.ScreenSpaceEventHandler(
    this.viewer.scene.canvas
);

handler.setInputAction(

    this.handleLeftClick.bind(this),

    Cesium.ScreenSpaceEventType.LEFT_CLICK

);
handler.setInputAction(

    this.handleMouseMove.bind(this),

    Cesium.ScreenSpaceEventType.MOUSE_MOVE

);



  this.viewer.camera.changed.addEventListener(() => {

    // camera sync code

  });

}




private placeEntity(
    click: Cesium.ScreenSpaceEventHandler.PositionedEvent
): void {

    const asset = this.editorState.selectedAsset();

    if (!asset) {

        console.log("No asset selected.");

        return;

    }

    const cartesian = this.viewer.scene.pickPosition(
        click.position
    );

    if (!cartesian) {
        return;
    }

    const cartographic =
        Cesium.Cartographic.fromCartesian(cartesian);

    const position = new Position(

        Cesium.Math.toDegrees(cartographic.latitude),

        Cesium.Math.toDegrees(cartographic.longitude),

        cartographic.height

    );

    const entity = EntityFactory.create(

        asset,

        position,

        this.editorState.selectedTeam()

    );

    this.entityRepository.add(entity);

    console.log("Entity added:", entity);
    this.editorState.selectedAsset.set(null);

}

private handleLeftClick(
    click: Cesium.ScreenSpaceEventHandler.PositionedEvent
): void {

    if (this.editorState.placementMode()) {

        this.placeEntity(click);

    } else {

        this.selectEntity(click);

    }

}

private selectEntity(
    click: Cesium.ScreenSpaceEventHandler.PositionedEvent
): void {

    const picked = this.viewer.scene.pick(click.position);

   if (!Cesium.defined(picked)) {

    this.editorState.selectedEntity.set(null);

    return;

}

    const pickedEntity = (picked as any).id;

    if (!pickedEntity) {
        return;
    }

    const entity = this.entityRepository
        .all()
        .find(e => e.id === pickedEntity.id);

    if (!entity) {
        return;
    }

    this.editorState.selectedEntity.set(entity);

}


private handleMouseMove(
    movement: Cesium.ScreenSpaceEventHandler.MotionEvent
): void {

    // Hide the previous label
    if (this.hoveredEntity?.label) {

        this.hoveredEntity.label.show =
    new Cesium.ConstantProperty(false);

    }

    this.hoveredEntity = undefined;

    // Find what the mouse is currently over
    const picked = this.viewer.scene.pick(
        movement.endPosition
    );

    if (!Cesium.defined(picked)) {

        return;

    }

    const entity = (picked as any).id as Cesium.Entity;

    if (!entity?.label) {

        return;

    }

    // Show this entity's label
    entity.label.show =
    new Cesium.ConstantProperty(true);

    this.hoveredEntity = entity;

}
public resize(): void {

    this.viewer.resize();

}
  ngOnDestroy(): void {

    this.viewer.destroy();

  }

}