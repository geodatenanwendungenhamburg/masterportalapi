import {isObject, getProjections, transformPoint} from "../../src/shared/utils";

describe("src/shared/utils.js", () => {
    describe("isObject", () => {
        it("returns true only for plain objects", () => {
            expect(isObject({a: 1})).toBe(true);
            expect(isObject([])).toBe(false);
            expect(isObject(null)).toBe(false);
            expect(isObject("text")).toBe(false);
        });
    });

    describe("getProjections", () => {
        it("returns source and destination projections", () => {
            const result = getProjections("EPSG:25832", "EPSG:4326", "32");

            expect(result).toHaveProperty("sourceProj");
            expect(result).toHaveProperty("destProj");
        });
    });

    describe("transformPoint", () => {
        it("returns a transformed lon-lat coordinate pair", () => {
            const sourcePoint = [565826.38, 5934174.4],
                transformed = transformPoint("EPSG:25832", sourcePoint);

            expect(Array.isArray(transformed)).toBe(true);
            expect(transformed).toHaveLength(2);
            expect(Number.isFinite(transformed[0])).toBe(true);
            expect(Number.isFinite(transformed[1])).toBe(true);
            expect(transformed[0]).not.toBe(sourcePoint[0]);
            expect(transformed[1]).not.toBe(sourcePoint[1]);
        });
    });
});
