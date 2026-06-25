import sharedUtils from "../../src/shared/utils";

describe("src/shared/utils.js", () => {
    describe("isObject", () => {
        it("returns true only for plain objects", () => {
            expect(sharedUtils.isObject({a: 1})).toBe(true);
            expect(sharedUtils.isObject([])).toBe(false);
            expect(sharedUtils.isObject(null)).toBe(false);
            expect(sharedUtils.isObject("text")).toBe(false);
        });
    });

    describe("allCompareEqual", () => {
        it("returns true when both arrays have equal rgb values", () => {
            expect(sharedUtils.allCompareEqual([1, 2, 3], [1, 2, 3])).toBe(true);
        });

        it("returns false for differing values or invalid input", () => {
            expect(sharedUtils.allCompareEqual([1, 2, 3], [1, 2, 4])).toBe(false);
            expect(sharedUtils.allCompareEqual([1, 2], [1, 2])).toBe(false);
            expect(sharedUtils.allCompareEqual("a", [1, 2, 3])).toBe(false);
        });
    });

    describe("getProjections", () => {
        it("returns source and destination projections", () => {
            const result = sharedUtils.getProjections("EPSG:25832", "EPSG:4326", "32");

            expect(result).toHaveProperty("sourceProj");
            expect(result).toHaveProperty("destProj");
        });
    });

    describe("transformPoint", () => {
        it("returns a transformed lon-lat coordinate pair", () => {
            const sourcePoint = [565826.38, 5934174.4],
                transformed = sharedUtils.transformPoint("EPSG:25832", sourcePoint);

            expect(Array.isArray(transformed)).toBe(true);
            expect(transformed).toHaveLength(2);
            expect(Number.isFinite(transformed[0])).toBe(true);
            expect(Number.isFinite(transformed[1])).toBe(true);
            expect(transformed[0]).not.toBe(sourcePoint[0]);
            expect(transformed[1]).not.toBe(sourcePoint[1]);
        });
    });
});
