import Tileset from "../../src/layer/tileset";

describe("tileset.js", function () {
    const consoleWarn = console.warn;
    let attr, map, cesium3DTilesetSpy;

    beforeEach(() => {
        global.Cesium = {};
        global.Cesium.Cesium3DTileset = {};
        global.Cesium.Cesium3DTileset.fromUrl = jest.fn();
        global.Cesium.Cesium3DTileStyle = jest.fn(color => color);
        attr = {
            id: "4002",
            name: "Gebäude LoD2",
            url: "https://geoportal-hamburg.de/gdi3d/datasource-data/LoD2",
            typ: "TileSet3D",
            cesium3DTilesetOptions: {
                maximumScreenSpaceError: 6
            }
        };
        map = {
            getCesiumScene: () => {
                return {
                    primitives: {
                        contains: jest.fn(),
                        add: jest.fn(),
                        remove: jest.fn()
                    }
                };
            }
        };
        cesium3DTilesetSpy = jest.spyOn(global.Cesium.Cesium3DTileset, "fromUrl").mockImplementation(() => {
            return Promise.resolve({});
        });
        console.warn = jest.fn();
    });

    afterEach(() => {
        global.Cesium = null;
        jest.clearAllMocks();
        console.warn = consoleWarn;
    });

    async function checkAttributes (layer, attrs) {
        const tileset = await layer.tileset;

        expect(layer.get("name")).toEqual(attrs.name);
        expect(layer.get("typ")).toEqual(attrs.typ);
        expect(layer.get("id")).toEqual(attrs.id);
        expect(tileset.layerReferenceId).toEqual(attrs.id);
    }

    describe("createLayer", function () {
        it("creates tileset layer without map", function () {
            const layer = new Tileset(attr);

            expect(layer.tileSet).toEqual(undefined);
            expect(layer.tileset.show).toEqual(undefined);
            expect(cesium3DTilesetSpy).toHaveBeenCalledTimes(1);
            checkAttributes(layer, attr);
        });
        it("creates 2 tileset layers  with map and checks attributes", function () {
            const attr2 = {
                    id: "4003",
                    name: "name",
                    url: "https://url",
                    typ: "TileSet3D"
                },
                layer = new Tileset(attr, map),
                layer2 = new Tileset(attr2, map);

            checkAttributes(layer, attr);
            checkAttributes(layer2, attr2);
            expect(cesium3DTilesetSpy).toHaveBeenCalledTimes(2);
        });
    });
    describe("setOpacity", function () {
        it("calls setOpacity sets opacity to terrain style", function (done) {
            const layer = new Tileset(attr, map);

            layer.setOpacity(0.5);

            layer.tileset.then(function (tileset) {
                if (tileset) {
                    expect(tileset.style).toEqual({color: "rgba(255, 255, 255, 0.5)"});
                    done();
                }
            });
        });
    });
    describe("setVisible", function () {
        it("calls setVisible without map shall not fail", function (done) {
            const layer = new Tileset(attr, map);

            expect(layer.tileset.show).toEqual(undefined);
            layer.setVisible(true);

            layer.tileset.then(function (tileset) {
                if (tileset) {
                    checkAttributes(layer, attr);
                    expect(layer.tileset.show).toEqual(undefined);
                    expect(cesium3DTilesetSpy).toHaveBeenCalledTimes(1);
                    done();
                }
            });
        });
        it("sets the tileset layer visible", function (done) {
            const layer = new Tileset(attr, map);

            layer.setVisible(true, map);

            layer.tileset.then(function (tileset) {
                if (tileset) {
                    checkAttributes(layer, attr);
                    expect(tileset.show).toEqual(true);
                    expect(cesium3DTilesetSpy).toHaveBeenCalledTimes(1);
                    done();
                }
            });
        });
        it("sets the tileset layer not visible", function (done) {
            const layer = new Tileset(attr, map);

            layer.setVisible(false, map);

            layer.tileset.then(function (tileset) {
                if (tileset) {
                    checkAttributes(layer, attr);
                    expect(tileset.show).toEqual(false);
                    expect(cesium3DTilesetSpy).toHaveBeenCalledTimes(1);
                    done();
                }
            });
        });
    });
    describe("get", function () {
        it("calls get for attributes", function () {
            const layer = new Tileset(attr, map);

            checkAttributes(layer, attr);
            expect(layer.get(null)).toEqual(undefined);
            expect(layer.get(undefined)).toEqual(undefined);
            expect(layer.get("")).toEqual(undefined);
        });
    });
});
