import * as Cesium from "cesium";
import { Entity } from "../../core/models/Entity";

export class CesiumEntityRenderer {

    constructor(
        private viewer: Cesium.Viewer
    ) {}

    render(entities: Entity[]): void {

        this.viewer.entities.removeAll();

        for (const entity of entities) {

            this.viewer.entities.add({

                id: entity.id,

                position: Cesium.Cartesian3.fromDegrees(

                    entity.position.longitude,

                    entity.position.latitude,

                    entity.position.altitude

                ),

               billboard: {

    image: EntityIconFactory.get(

        entity.definition.entityType

    ),

    width: 32,

    height: 32,

    verticalOrigin: Cesium.VerticalOrigin.BOTTOM

},

                label: {
    text: entity.definition.name,
    font: "16px sans-serif",
    fillColor: Cesium.Color.WHITE,
    outlineColor: Cesium.Color.BLACK,
    outlineWidth: 6,
    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
    pixelOffset: new Cesium.Cartesian2(0, -25),
    scale: 0.8
}

            });

        }

    }

}