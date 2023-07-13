import CircleStyle from "../../../src/vectorStyle/styles/styleCircle";
import {Style} from "ol/style.js";

describe("styleCircle", () => {
    const feature = {
            geometryName: "geom",
            id: "DE.HH.UP_GESUNDHEIT_KRANKENHAEUSER_2"
        },
        style = {
            type: "icon",
            legendValue: "Krankenhaus",
            imageName: "krankenhaus.png"
        },
        isClustered = false,
        styleCircleClass = new CircleStyle(feature, style, isClustered);

    describe("initialize", function () {
        it("returns an instance of openlayers style", () => {
            expect(typeof styleCircleClass.initialize).toBe("function");
        });
    });

    describe("createStyle", function () {
        it("returns an instance of openlayers style", () => {
            const createdStyle = styleCircleClass.createStyle();

            styleCircleClass.setStyle(createdStyle);
            expect(styleCircleClass.getStyle()).toBeInstanceOf(Style);
        });
    });
});
