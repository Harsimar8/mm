import * as Cesium from "cesium";
import { Entity } from "../../core/models/Entity";
import { EntityIconFactory } from "../../core/factories/EntityIconFactory";
import { EditorState } from "../../core/state/EditorState";

export class CesiumEntityRenderer {

    constructor(
    private viewer: Cesium.Viewer,
    private editorState: EditorState
) {}

    render(entities: Entity[]): void {

        this.viewer.entities.removeAll();

        for (const entity of entities) {

            const selected =
    this.editorState.selectedEntity()?.id === entity.id;

    console.log(
    entity.definition.name,
    selected
);
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

    width: selected ? 36 : 32,

    height: selected ? 36 : 32,

    scale: selected ? 1.08 : 1.0,

    color: selected
        ? Cesium.Color.fromCssColorString("#FFF8DC")
        : Cesium.Color.WHITE,

    disableDepthTestDistance: Number.POSITIVE_INFINITY,

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