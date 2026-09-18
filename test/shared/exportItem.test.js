import Feature from "ol/Feature.js";
import {Point, LineString, Polygon, Circle} from "ol/geom.js";
import {GeoJSON} from "ol/format.js";
import proj4 from "proj4";
import {register} from "ol/proj/proj4.js";
import exportItem, {setCsvAttributes} from "../../src/shared/exportItem";

// Register projection used in tests
proj4.defs("EPSG:25832", "+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
register(proj4);

describe("src/shared/exportItem.js", () => {
    describe("transform", () => {
        it("transforms line coordinates from source projection to EPSG:4326", () => {
            const coords = [[565874, 5934140], [566000, 5934200]],
                result = exportItem.transform("EPSG:25832", coords, false);

            expect(result).toHaveLength(2);
            result.forEach(point => {
                expect(point).toHaveLength(2);
                expect(typeof point[0]).toBe("number");
                expect(typeof point[1]).toBe("number");
            });
        });

        it("transforms polygon coordinates from source projection to EPSG:4326", () => {
            const coords = [[[565874, 5934140], [566000, 5934200], [566100, 5934100], [565874, 5934140]]],
                result = exportItem.transform("EPSG:25832", coords, true);

            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(1);
            expect(result[0]).toHaveLength(4);
        });

        it("handles single-ring polygon correctly", () => {
            const coords = [[[565874, 5934140], [566000, 5934200], [566100, 5934100], [565874, 5934140]]],
                result = exportItem.transform("EPSG:25832", coords, true);

            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(1);
            expect(result[0]).toHaveLength(4);
            result[0].forEach(point => {
                expect(point).toHaveLength(2);
                expect(typeof point[0]).toBe("number");
                expect(typeof point[1]).toBe("number");
            });
        });

        it("returns wrapped array for polygon, flat array for line", () => {
            const lineCoords = [[565874, 5934140], [566000, 5934200]],
                polyCoords = [[[565874, 5934140], [566000, 5934200], [566100, 5934100], [565874, 5934140]]],
                lineResult = exportItem.transform("EPSG:25832", lineCoords, false),
                polyResult = exportItem.transform("EPSG:25832", polyCoords, true);

            // Line result is a flat array of points
            expect(Array.isArray(lineResult[0])).toBe(true);
            expect(typeof lineResult[0][0]).toBe("number");

            // Polygon result is wrapped in an extra array
            expect(Array.isArray(polyResult[0])).toBe(true);
            expect(Array.isArray(polyResult[0][0])).toBe(true);
        });
    });

    describe("transformCoordinates", () => {
        it("transforms a Point geometry", () => {
            const geometry = new Point([565874, 5934140]),
                result = exportItem.transformCoordinates(geometry, "EPSG:25832");

            expect(result).toHaveLength(2);
            expect(typeof result[0]).toBe("number");
            expect(typeof result[1]).toBe("number");
        });

        it("transforms a LineString geometry", () => {
            const geometry = new LineString([[565874, 5934140], [566000, 5934200]]),
                result = exportItem.transformCoordinates(geometry, "EPSG:25832");

            expect(result).toHaveLength(2);
            result.forEach(point => {
                expect(point).toHaveLength(2);
            });
        });

        it("transforms a Polygon geometry", () => {
            const geometry = new Polygon([[[565874, 5934140], [566000, 5934200], [566100, 5934100], [565874, 5934140]]]),
                result = exportItem.transformCoordinates(geometry, "EPSG:25832");

            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(1);
        });

        it("returns an empty array for unsupported geometry types", () => {
            const geometry = {
                getCoordinates: () => [[[[[0, 0]]]]],
                getType: () => "MultiPolygon"
            };

            expect(exportItem.transformCoordinates(geometry, "EPSG:25832")).toEqual([]);
        });
    });

    describe("convertFeatures", () => {
        it("converts features to GeoJSON string", async () => {
            const feature = new Feature({geometry: new Point([565874, 5934140])}),
                format = new GeoJSON(),
                result = await exportItem.convertFeatures([feature], format, "EPSG:25832");

            expect(typeof result).toBe("string");
            const parsed = JSON.parse(result);

            expect(parsed.type).toBe("FeatureCollection");
            expect(parsed.features).toHaveLength(1);
            expect(parsed.features[0].geometry.type).toBe("Point");
        });

        it("converts multiple features", async () => {
            const features = [
                    new Feature({geometry: new Point([565874, 5934140])}),
                    new Feature({geometry: new LineString([[565874, 5934140], [566000, 5934200]])})
                ],
                format = new GeoJSON(),
                result = await exportItem.convertFeatures(features, format, "EPSG:25832"),
                parsed = JSON.parse(result);

            expect(parsed.features).toHaveLength(2);
        });

        it("removes trailing zero from 3D point coordinates", async () => {
            const feature = new Feature({geometry: new Point([565874, 5934140, 0])}),
                format = new GeoJSON(),
                result = await exportItem.convertFeatures([feature], format, "EPSG:25832"),
                parsed = JSON.parse(result);

            expect(parsed.features[0].geometry.coordinates).toHaveLength(2);
        });

        it("returns an empty FeatureCollection string for empty array", async () => {
            const format = new GeoJSON(),
                result = await exportItem.convertFeatures([], format, "EPSG:25832"),
                parsed = JSON.parse(result);

            expect(parsed.features).toHaveLength(0);
        });
    });

    describe("prepareFeatures", () => {
        it("clones features without modifying the originals", () => {
            const original = new Feature({geometry: new Point([565874, 5934140])}),
                result = exportItem.prepareFeatures([original], "EPSG:25832");

            expect(result).toHaveLength(1);
            expect(result[0]).not.toBe(original);
        });

        it("converts Circle geometries to Polygons and sets masterportal_attributes", () => {
            const circle = new Feature({geometry: new Circle([565874, 5934140], 100)}),
                result = exportItem.prepareFeatures([circle], "EPSG:25832");

            expect(result[0].getGeometry().getType()).toBe("Polygon");
            expect(result[0].get("masterportal_attributes")).toBeDefined();
            expect(result[0].get("masterportal_attributes").isGeoCircle).toBe(true);
            expect(result[0].get("masterportal_attributes").geoCircleCenter).toBeDefined();
            expect(typeof result[0].get("masterportal_attributes").geoCircleRadius).toBe("number");
        });

        it("does not modify non-Circle features", () => {
            const feature = new Feature({geometry: new Point([565874, 5934140])}),
                result = exportItem.prepareFeatures([feature], "EPSG:25832");

            expect(result[0].getGeometry().getType()).toBe("Point");
            expect(result[0].get("masterportal_attributes")).toBeUndefined();
        });

        it("preserves existing masterportal_attributes on Circle features", () => {
            const circle = new Feature({geometry: new Circle([565874, 5934140], 100)});

            circle.set("masterportal_attributes", {existingKey: "existingValue"});
            const result = exportItem.prepareFeatures([circle], "EPSG:25832");

            expect(result[0].get("masterportal_attributes").existingKey).toBe("existingValue");
            expect(result[0].get("masterportal_attributes").isGeoCircle).toBe(true);
        });
    });

    describe("setCsvAttributes", () => {
        it("returns false if features is not an array", () => {
            expect(setCsvAttributes(undefined)).toBe(false);
            expect(setCsvAttributes(null)).toBe(false);
            expect(setCsvAttributes("string")).toBe(false);
            expect(setCsvAttributes({})).toBe(false);
            expect(setCsvAttributes(123)).toBe(false);
        });

        it("sets WKT geometry and EPSG code on csv_attributes", () => {
            const feature = new Feature({geometry: new Point([565874, 5934140])}),
                result = setCsvAttributes([feature], "EPSG:25832");

            expect(result).toHaveLength(1);
            expect(result[0].get("csv_attributes")).toBeDefined();
            expect(result[0].get("csv_attributes").geometry).toContain("POINT");
            expect(result[0].get("csv_attributes").epsg).toBe("EPSG:25832");
        });

        it("converts Circle geometries to Polygon WKT", () => {
            const feature = new Feature({geometry: new Circle([565874, 5934140], 100)}),
                result = setCsvAttributes([feature], "EPSG:25832");

            expect(result[0].get("csv_attributes").geometry).toContain("POLYGON");
        });

        it("copies non-reserved properties to csv_attributes", () => {
            const feature = new Feature({
                geometry: new Point([565874, 5934140]),
                name: "test feature",
                category: "example"
            });

            setCsvAttributes([feature], "EPSG:25832");
            expect(feature.get("csv_attributes").name).toBe("test feature");
            expect(feature.get("csv_attributes").category).toBe("example");
        });

        it("does not copy reserved properties to csv_attributes", () => {
            const feature = new Feature({geometry: new Point([565874, 5934140])});

            feature.set("masterportal_attributes", {some: "data"});
            setCsvAttributes([feature], "EPSG:25832");

            expect(feature.get("csv_attributes").masterportal_attributes).toBeUndefined();
            expect(feature.get("csv_attributes").geometry).toContain("POINT");
        });

        it("skips non-Feature items in the array", () => {
            const feature = new Feature({geometry: new Point([565874, 5934140])}),
                result = setCsvAttributes([feature, "not a feature", null], "EPSG:25832");

            expect(result).toHaveLength(3);
            expect(result[0].get("csv_attributes")).toBeDefined();
        });

        it("returns the features array on success", () => {
            const features = [new Feature({geometry: new Point([565874, 5934140])})],
                result = setCsvAttributes(features, "EPSG:25832");

            expect(result).toBe(features);
        });
    });
});
