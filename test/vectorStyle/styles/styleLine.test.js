import LineStyle from "../../../src/vectorStyle/styles/styleLine";
import {Style} from "ol/style.js";

describe("styleLine", () => {
    const feature = {
            geometryName: "geom",
            id: "DE.HH.UP_GESUNDHEIT_KRANKENHAEUSER_2"
        },
        style = {
            type: "icon",
            clusterType: "icon",
            legendValue: "Krankenhaus",
            imageName: "krankenhaus.png"
        },
        isClustered = false,
        styleLineClass = new LineStyle(feature, style, isClustered);

    describe("initialize", function () {
        it("returns an instance of openlayers style", () => {
            expect(typeof styleLineClass.initialize).toBe("function");
        });
    });

    describe("createStyle", function () {
        it("returns an instance of openlayers style", () => {
            const createdStyle = styleLineClass.createStyle();

            styleLineClass.setStyle(createdStyle);
            expect(styleLineClass.getStyle()).toBeInstanceOf(Style);
        });
    });
});
