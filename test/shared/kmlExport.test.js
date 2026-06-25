import Feature from "ol/Feature.js";
import Point from "ol/geom/Point.js";
import Circle from "ol/geom/Circle.js";

import kmlExport from "../../src/shared/kmlExport";

describe("src/shared/kmlExport.js", () => {
    describe("setKmlAttributes", () => {
        it("returns false for non-array input", () => {
            expect(kmlExport.setKmlAttributes(null)).toBe(false);
            expect(kmlExport.setKmlAttributes("text")).toBe(false);
        });

        it("creates attributes and copies masterportal attributes to root", () => {
            const features = [
                    new Feature({
                        geometry: new Point([1, 2]),
                        name: "nameOne",
                        masterportal_attributes: {
                            isGeoCircle: true
                        }
                    })
                ],
                result = kmlExport.setKmlAttributes(features);

            expect(result[0].get("attributes")).toBeDefined();
            expect(result[0].get("attributes").name).toBe("nameOne");
            expect(result[0].get("isGeoCircle")).toBe(true);
        });
    });

    describe("getKMLWithCustomAttributes", () => {
        it("returns null if no feature contains attributes", () => {
            const feature = new Feature({geometry: new Point([1, 2])}),
                format = {
                    writeFeatures: () => "<kml><Document><Placemark /></Document></kml>"
                };

            expect(kmlExport.getKMLWithCustomAttributes([feature], format)).toBeNull();
        });

        it("renames Data tag names for custom attributes", () => {
            const feature = new Feature({geometry: new Point([1, 2])}),
                format = {
                    writeFeatures: () => "<kml><Document><Placemark><ExtendedData><Data name='foo'><value>1</value></Data></ExtendedData></Placemark></Document></kml>"
                };

            feature.set("attributes", {foo: "1"});

            const result = kmlExport.getKMLWithCustomAttributes([feature], format),
                dataNode = result.querySelector("Placemark ExtendedData Data");

            expect(dataNode.getAttribute("name")).toBe("custom-attribute____foo");
        });

        it("does not throw if placemark has no ExtendedData", () => {
            const feature = new Feature({geometry: new Point([1, 2])}),
                format = {
                    writeFeatures: () => "<kml><Document><Placemark><name>test</name></Placemark></Document></kml>"
                };

            feature.set("attributes", {foo: "1"});

            expect(() => kmlExport.getKMLWithCustomAttributes([feature], format)).not.toThrow();
        });
    });

    describe("transformGeometries", () => {
        it("transforms circle features to polygons and sets geo circle metadata", () => {
            const sourceFeature = new Feature({
                    geometry: new Circle([565826.38, 5934174.4], 100),
                    masterportal_attributes: {}
                }),
                result = kmlExport.transformGeometries([sourceFeature]),
                transformed = result[0],
                attributes = transformed.get("masterportal_attributes");

            expect(transformed.getGeometry().getType()).toBe("Polygon");
            expect(attributes.isGeoCircle).toBe(true);
            expect(attributes.geoCircleCenter).toContain(",");
            expect(attributes.geoCircleRadius).toBeGreaterThan(0);
        });
    });
});
