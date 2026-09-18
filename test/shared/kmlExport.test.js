import Feature from "ol/Feature.js";
import {Point, LineString, Polygon} from "ol/geom.js";
import {KML} from "ol/format.js";
import proj4 from "proj4";
import {register} from "ol/proj/proj4.js";
import kmlExport from "../../src/shared/kmlExport";

// Register projection used in tests
proj4.defs("EPSG:25832", "+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
register(proj4);

describe("src/shared/kmlExport.js", () => {
    describe("transformCoordinates", () => {
        it("transforms a Point geometry", () => {
            const geometry = new Point([565874, 5934140]),
                result = kmlExport.transformCoordinates(geometry, "EPSG:25832");

            expect(result).toHaveLength(2);
            expect(typeof result[0]).toBe("number");
            expect(typeof result[1]).toBe("number");
        });

        it("transforms a LineString geometry", () => {
            const geometry = new LineString([[565874, 5934140], [566000, 5934200]]),
                result = kmlExport.transformCoordinates(geometry, "EPSG:25832");

            expect(result).toHaveLength(2);
            result.forEach(point => {
                expect(point).toHaveLength(2);
                expect(typeof point[0]).toBe("number");
                expect(typeof point[1]).toBe("number");
            });
        });

        it("transforms a Polygon geometry", () => {
            const geometry = new Polygon([[[565874, 5934140], [566000, 5934200], [566100, 5934100], [565874, 5934140]]]),
                result = kmlExport.transformCoordinates(geometry, "EPSG:25832");

            expect(Array.isArray(result)).toBe(true);
            expect(result).toHaveLength(1);
            expect(result[0].length).toBeGreaterThanOrEqual(4);
        });

        it("returns coordinates unchanged for MultiPolygon", () => {
            const coords = [[[[0, 0], [1, 0], [1, 1], [0, 0]]]],
                geometry = {
                    getCoordinates: () => coords,
                    getType: () => "MultiPolygon"
                },
                result = kmlExport.transformCoordinates(geometry);

            expect(result).toEqual(coords);
        });

        it("returns an empty array for unsupported geometry types", () => {
            const geometry = {
                getCoordinates: () => [],
                getType: () => "GeometryCollection"
            };

            expect(kmlExport.transformCoordinates(geometry)).toEqual([]);
        });
    });

    describe("convertFeatures", () => {
        it("converts Point features to a KML string", () => {
            const feature = new Feature({geometry: new Point([565874, 5934140])}),
                format = new KML({extractStyles: true}),
                result = kmlExport.convertFeatures([feature], format, "EPSG:25832");

            expect(typeof result).toBe("string");
            expect(result).toContain("Point");
            expect(result).toContain("coordinates");
        });

        it("converts LineString features to a KML string", () => {
            const feature = new Feature({geometry: new LineString([[565874, 5934140], [566000, 5934200]])}),
                format = new KML({extractStyles: true}),
                result = kmlExport.convertFeatures([feature], format, "EPSG:25832");

            expect(typeof result).toBe("string");
            expect(result).toContain("LineString");
        });

        it("converts multiple features to KML", () => {
            const features = [
                    new Feature({geometry: new Point([565874, 5934140])}),
                    new Feature({geometry: new LineString([[565874, 5934140], [566000, 5934200]])})
                ],
                format = new KML({extractStyles: true}),
                result = kmlExport.convertFeatures(features, format, "EPSG:25832");

            expect(result).toContain("Point");
            expect(result).toContain("LineString");
        });

        it("removes trailing zero from 3D point coordinates", () => {
            const feature = new Feature({geometry: new Point([565874, 5934140, 0])}),
                format = new KML({extractStyles: true}),
                result = kmlExport.convertFeatures([feature], format, "EPSG:25832"),
                // KML coordinates are lon,lat,alt - check it doesn't contain a trailing ,0
                coordMatch = result.match(/<coordinates>([\s\S]*?)<\/coordinates>/);

            expect(coordMatch).not.toBeNull();
            // The coordinate should have been transformed and not have trailing 0
            const coordParts = coordMatch[1].trim().split(",");

            expect(coordParts).toHaveLength(2);
        });
    });

    describe("getKMLWithCustomAttributes", () => {
        it("returns null if features is not an array", () => {
            const format = new KML({extractStyles: true});

            expect(kmlExport.getKMLWithCustomAttributes(undefined, format)).toBeNull();
            expect(kmlExport.getKMLWithCustomAttributes(null, format)).toBeNull();
            expect(kmlExport.getKMLWithCustomAttributes("string", format)).toBeNull();
        });

        it("returns null if format is not an object", () => {
            const features = [new Feature({geometry: new Point([10, 53])})];

            expect(kmlExport.getKMLWithCustomAttributes(features, null)).toBeNull();
            expect(kmlExport.getKMLWithCustomAttributes(features, undefined)).toBeNull();
        });

        it("returns null if no features have attributes", () => {
            const feature = new Feature({geometry: new Point([10, 53])}),
                format = new KML({extractStyles: true});

            expect(kmlExport.getKMLWithCustomAttributes([feature], format)).toBeNull();
        });

        it("returns a KML document when features have attributes", () => {
            const feature = new Feature({geometry: new Point([10, 53]), category: "test"});

            feature.set("attributes", {category: "test"});
            const format = new KML({extractStyles: true}),
                result = kmlExport.getKMLWithCustomAttributes([feature], format);

            expect(result).not.toBeNull();
            expect(result.getElementsByTagName("Placemark").length).toBe(1);
        });
    });

    describe("setKmlAttributes", () => {
        it("returns false if features is not an array", () => {
            expect(kmlExport.setKmlAttributes(undefined)).toBe(false);
            expect(kmlExport.setKmlAttributes(null)).toBe(false);
            expect(kmlExport.setKmlAttributes("string")).toBe(false);
            expect(kmlExport.setKmlAttributes({})).toBe(false);
            expect(kmlExport.setKmlAttributes(123)).toBe(false);
        });

        it("sets attributes property on features that don't already have it", () => {
            const feature = new Feature({
                geometry: new Point([565874, 5934140]),
                name: "testFeature",
                category: "example"
            });

            kmlExport.setKmlAttributes([feature]);

            expect(feature.get("attributes")).toBeDefined();
            expect(feature.get("attributes").name).toBe("testFeature");
            expect(feature.get("attributes").category).toBe("example");
        });

        it("does not overwrite existing attributes property", () => {
            const feature = new Feature({geometry: new Point([565874, 5934140])});

            feature.set("attributes", {existing: "value"});
            kmlExport.setKmlAttributes([feature]);

            expect(feature.get("attributes").existing).toBe("value");
        });

        it("does not include reserved properties in attributes", () => {
            const feature = new Feature({geometry: new Point([565874, 5934140])});

            feature.set("masterportal_attributes", {mpKey: "mpValue"});
            kmlExport.setKmlAttributes([feature]);

            expect(feature.get("attributes").masterportal_attributes).toBeUndefined();
            expect(feature.get("attributes").geometry).toBeUndefined();
        });

        it("promotes masterportal_attributes keys to feature-level properties", () => {
            const feature = new Feature({geometry: new Point([565874, 5934140])});

            feature.set("masterportal_attributes", {isGeoCircle: true, geoCircleRadius: 50});
            kmlExport.setKmlAttributes([feature]);

            expect(feature.get("isGeoCircle")).toBe(true);
            expect(feature.get("geoCircleRadius")).toBe(50);
        });

        it("returns the features array on success", () => {
            const features = [new Feature({geometry: new Point([565874, 5934140])})],
                result = kmlExport.setKmlAttributes(features);

            expect(result).toBe(features);
        });

        it("skips non-Feature items in the array", () => {
            const feature = new Feature({geometry: new Point([565874, 5934140]), name: "valid"}),
                result = kmlExport.setKmlAttributes([feature, "not a feature", null]);

            expect(result).toHaveLength(3);
            expect(feature.get("attributes").name).toBe("valid");
        });
    });

    describe("convertFeaturesToKml", () => {
        it("returns a KML string for LineString features", () => {
            const feature = new Feature({geometry: new LineString([[565874, 5934140], [566000, 5934200]])});

            return kmlExport.convertFeaturesToKml([feature], "EPSG:25832").then(result => {
                expect(typeof result).toBe("string");
                expect(result).toContain("LineString");
            });
        });

        it("returns a KML string for Polygon features", () => {
            const feature = new Feature({geometry: new Polygon([[[565874, 5934140], [566000, 5934200], [566100, 5934100], [565874, 5934140]]])});

            return kmlExport.convertFeaturesToKml([feature], "EPSG:25832").then(result => {
                expect(typeof result).toBe("string");
                expect(result).toContain("Polygon");
            });
        });

        it("handles features without style functions gracefully", () => {
            const feature = new Feature({geometry: new LineString([[565874, 5934140], [566000, 5934200]])});

            return kmlExport.convertFeaturesToKml([feature], "EPSG:25832").then(result => {
                expect(typeof result).toBe("string");
                expect(result).toContain("kml");
            });
        });
    });
});
