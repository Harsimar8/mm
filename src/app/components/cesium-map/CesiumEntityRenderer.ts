import * as Cesium from "cesium";
import { Entity } from "../../core/models/Entity";
import { EntityIconFactory } from "../../core/factories/EntityIconFactory";


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
    text:
`Name: ${entity.definition.name}
Type: ${entity.definition.entityType}
Role: ${entity.definition.role}
Team: ${entity.team}`,

    show: false,

    font: "11px Arial",

    fillColor: Cesium.Color.BLACK,

    showBackground: true,
    backgroundColor: Cesium.Color.fromCssColorString("#ffffff").withAlpha(0.95),

    outlineColor: Cesium.Color.GRAY,
    outlineWidth: 1,
    style: Cesium.LabelStyle.FILL_AND_OUTLINE,

    pixelOffset: new Cesium.Cartesian2(0, -32),

    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,

    disableDepthTestDistance: Number.POSITIVE_INFINITY
}
            });

        }

    }

}