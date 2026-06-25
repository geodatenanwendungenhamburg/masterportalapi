import Feature from "ol/Feature.js";
import Point from "ol/geom/Point.js";
import Circle from "ol/geom/Circle.js";

import exportItem, {setCsvAttributes} from "../../src/shared/exportItem";

describe("src/shared/exportItem.js", () => {
    describe("setCsvAttributes", () => {
        it("returns false for non-array input", () => {
            expect(setCsvAttributes(null, "EPSG:25832")).toBe(false);
            expect(setCsvAttributes({}, "EPSG:25832")).toBe(false);
        });

        it("adds csv_attributes with geometry and epsg", () => {
            const features = [
                    new Feature({
                        geometry: new Point([123, 456]),
                        name: "featureOne"
                    })
                ],
                result = setCsvAttributes(features, "EPSG:25832");

            expect(result[0].get("csv_attributes")).toBeDefined();
            expect(result[0].get("csv_attributes").geometry).toBe("POINT(123 456)");
            expect(result[0].get("csv_attributes").epsg).toBe("EPSG:25832");
            expect(result[0].get("csv_attributes").name).toBe("featureOne");
        });
    });

    describe("prepareFeatures", () => {
        it("converts circles to polygons and stores circle metadata", () => {
            const sourceFeature = new Feature({
                    geometry: new Circle([565826.38, 5934174.4], 100),
                    masterportal_attributes: {}
                }),
                map = {
                    getView: () => ({
                        getProjection: () => ({
                            getCode: () => "EPSG:25832"
                        })
                    })
                },
                result = exportItem.prepareFeatures([sourceFeature], map),
                preparedFeature = result[0],
                preparedAttributes = preparedFeature.get("masterportal_attributes");

            expect(preparedFeature.getGeometry().getType()).toBe("Polygon");
            expect(preparedAttributes.isGeoCircle).toBe(true);
            expect(preparedAttributes.geoCircleCenter).toContain(",");
            expect(preparedAttributes.geoCircleRadius).toBeGreaterThan(0);
            expect(sourceFeature.getGeometry().getType()).toBe("Circle");
        });
    });
});
