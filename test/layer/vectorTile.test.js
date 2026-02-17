import OpenLayersVectorTileLayer from "ol/layer/VectorTile";
import OpenLayersVectorTileSource from "ol/source/VectorTile";
import OpenLayersTileGrid from "ol/tilegrid/TileGrid";


import {Feature} from "ol";
import Polygon from "ol/geom/Polygon";

import * as vectorTile from "../../src/layer/vectorTile";
import crs from "../../src/crs";
import defaults from "../../src/defaults";

jest.mock("../../src/rawLayerList.js", () => {
    const original = jest.requireActual("../../src/rawLayerList.js");

    original.initializeLayerList = jest.fn();
    return original;
});

jest.mock("../../src/renderer/webgl.js", () => {
    const original = jest.requireActual("../../src/renderer/webgl.js");

    return {
        ...original,
        afterLoading: jest.fn()
    };
});


describe("vectorTile.js", function () {

    beforeAll(() => crs.registerProjections());

    const rawLayer = {
            name: "VT Test",
            id: "VT_01",
            url: "https://example.org"
        },
        tileGridParams = {
            extent: [0, 0, 1, 1],
            tileSize: 512,
            minZoom: 0
        },

        vtStyle = {
            "version": 8,
            "sources": {
                "test": {
                    "type": "vector"
                }
            },
            "layers": [
                {
                    "type": "fill",
                    "source": "test",
                    "source-layer": "Background",
                    "paint": {"fill-color": "rgb(255,253,238)", "fill-opacity": 1}
                }
            ]
        },

        feature = new Feature({
            geometry: new Polygon([[0, 0], [0, 1], [1, 1], [0, 0]]),
            layer: "Background"
        });

    describe("createTileGrid", function () {
        it("creates a ol/tilegrid/TileGrid with default values for not required parameters", function () {
            const tileGrid = vectorTile.createTileGrid(tileGridParams);

            expect(tileGrid).toBeInstanceOf(OpenLayersTileGrid);
            expect(tileGrid.getExtent()).toEqual(tileGridParams.extent);
            expect(tileGrid.getResolutions()).toEqual(defaults.options.map(x => x.resolution));
            expect(tileGrid.getTileSize()).toEqual(new Array(2).fill(tileGridParams.tileSize));
            expect(tileGrid.getMinZoom()).toBe(tileGrid.minZoom);
            expect(tileGrid.getOrigin()).toEqual([tileGridParams.extent[0], tileGridParams.extent[3]]);
        });
    });

    describe("createLayerSource", function () {
        it("creates a layerSource", function () {
            const tileGrid = vectorTile.createTileGrid(tileGridParams),
                sourceParams = {
                    tileGrid: tileGrid,
                    tileSize: tileGrid.getTileSize(),
                    zDirection: 1,
                    minZoom: 0,
                    maxZoom: 22
                },
                source = vectorTile.createLayerSource("https://foo.example.org", sourceParams);

            expect(source).toBeInstanceOf(OpenLayersVectorTileSource);
            expect(typeof source.getTileLoadFunction()).toEqual("function");
        });
    });

    describe("createLayer", function () {
        it("creates a vector Tile Layer", function () {
            const layer = vectorTile.createLayer(rawLayer);

            expect(layer).toBeInstanceOf(OpenLayersVectorTileLayer);
            expect(layer.getSource()).toBeInstanceOf(OpenLayersVectorTileSource);
            expect(layer.get("name")).toEqual("VT Test");
            expect(layer.get("id")).toEqual("VT_01");
        });

        it("creates a vector Tile Layer with webgl renderer", function () {
            const layer = vectorTile.createLayer(rawLayer, {layerParams: {renderer: "webgl"}});

            expect(layer.constructor.name).toEqual("LocalWebGLLayer");
            expect(layer.getSource()).toBeInstanceOf(OpenLayersVectorTileSource);
        });

        it("should log an error when required param is missing", function () {
            const spyConsole = jest.spyOn(console, "error").mockImplementation(() => ""),
                layer = vectorTile.createLayer({
                    name: "VT Test",
                    id: "VT_01"
                });

            expect(layer).toBeUndefined();
            expect(console.error).toHaveBeenCalled();
            expect(spyConsole.mock.calls[0][0]).toContain("Cancelled creation of layer \"VT_01\"(VT Test) because of missing required parameters");
            spyConsole.mockRestore();
        });

        it("should apply default values for all not required ones", function () {
            const defaultValues = { // defaults defined in services.json.md
                    zDirection: 1,
                    epsg: "EPSG:25832", // default value from config.json.md/MapView. Should be the default CRS
                    extent: [ // If not set, the portal's coordinate reference system's extent is used
                        // Note: this should be the extent of the projection but is the extent of EPSG:3857
                        //       this is because in masterportalAPI is no definition of the extent of the
                        //       default projection which is EPSG:25832
                        -20015077.371242613,
                        -20015077.371242613,
                        20015077.371242613,
                        20015077.371242613
                    ],
                    origin: [ // if not set, the portal's coordinate reference system's top-left corner is used.
                        // Note: this should be the top left corner of the projection extent but is top left
                        //       corner of extent of EPSG:3857 this is because in masterportalAPI is no
                        //       definition of the extent of the default projection which is EPSG:25832
                        -20015077.371242613,
                        20015077.371242613
                    ],
                    resolutions: [ // If not used, the portal's resolutions are used. (Missing default resolution definition? used default resolutions from masterportal-api)
                        66.14579761460263,
                        26.458319045841044,
                        15.874991427504629,
                        10.583327618336419,
                        5.2916638091682096,
                        2.6458319045841048,
                        1.3229159522920524,
                        0.6614579761460262,
                        0.2645831904584105,
                        0.1322915952292052
                    ],
                    tileSize: 512
                },
                layer = vectorTile.createLayer(rawLayer),
                source = layer.getSource(),
                tileGrid = source.getTileGrid();

            expect(layer.getExtent()).toEqual(defaultValues.extent);

            expect(source.getProjection().getCode()).toEqual(defaultValues.epsg);

            expect(tileGrid.getExtent()).toEqual(defaultValues.extent);
            expect(tileGrid.getOrigin()).toEqual(defaultValues.origin);
            expect(tileGrid.getResolutions()).toEqual(defaultValues.resolutions);
            expect(tileGrid.getTileSize()).toEqual(new Array(2).fill(defaultValues.tileSize));
        });
    });

    describe("setStyle", function () {
        it("should apply a given style", function () {
            const layer = vectorTile.createLayer(rawLayer);

            let featureStyle = null;

            vectorTile.setStyle(layer, vtStyle);

            expect(typeof layer.getStyle()).toBe("function");

            featureStyle = layer.getStyle()(feature, 1.3229159522920524);

            expect(featureStyle[0].getFill().getColor()).toBe("rgba(255,253,238,1)");
        });
    });
    describe("setStyle with layer-parameter", function () {
        it("should apply a given style", async function () {

            global.fetch = jest.fn(() => {
            // Style JSON
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        "version": 8,
                        "layers": [
                            {
                                "id": "SiedlungF_Industrie_und_Gewerbe",
                                "type": "fill",
                                "source": "smarttiles_de",
                                "minzoom": 14,
                                "maxzoom": 22,
                                "source-layer": "Siedlungsflaeche",
                                "filter": ["in", "klasse", "Abfallbehandlungsanlage", "Ausstellung, Messe", "Beherbergung", "Deponie (oberirdisch)", "Deponie (untertägig)", "Entsorgung", "Förderanlage", "Gärtnerei", "Handel", "Handel und Dienstleistung", "Heizwerk", "Industrie und Gewerbe", "Kläranlage, Klärwerk", "Kraftwerk", "Raffinerie", "Umspannstation", "Versorgungsanlage", "Wasserwerk", "Werft", "Forschung und Entwicklung", "Funk- und Fernmeldeanlage", "Gaswerk", "Lagerfläche", "Logistik und Transport", "Maschinenbau", "Tankstelle", "Technik, Elektrik, Elektronik", "Vergnügung", "Freie Berufe und weitere Dienstleistungen", "Bank, Kredit", "Versicherung", "Restauration", "Handwerk", "Produktion", "Betriebliche Sozialeinrichtung", "Grundstoff", "Nahrungs-, Futter-, Genussmittel", "Textil, Bekleidung, Lederwaren", "Holz-, Naturfaser-, Verpackungsprodukte", "Print-, Audio-, Videoprodukte", "Mineralölverarbeitung, Kokerei", "Chemie-, Pharma-, Kunststoffprodukte", "Mineralische Bau- und Werkstoffe", "Metallerzeugung und -verarbeitung", "Fahrzeugbau", "Möbel und sonstige Konsumgüter", "Landwirtschaftliche Betriebsfläche", "Landwirtschaftliche Betriebsfläche für Tierhaltung", "Landwirtschaftliche Betriebsfläche für pflanzliche Produktion", "Landwirtschaftliche Betriebsfläche für Tierhaltung und pflanzliche Produktion"],
                                "layout": {
                                    "visibility": "visible"
                                },
                                "paint": {
                                    "fill-color": "rgb(214,210,219)",
                                    "fill-opacity": 1
                                }
                            }
                        ],
                        "sources": {
                            "smarttiles_de": {
                                "type": "vector",
                                "attribution": "&copy; 2025 basemap.de / BKG",
                                // Direkt tiles angeben statt url!
                                "tiles": [
                                    "https://test.geoportal-hamburg.de/vt/esri/tiles/{z}/{x}/{y}.pbf"
                                ],
                                "minzoom": 0,
                                "maxzoom": 22
                            }
                        }
                    })
                });
            });
            rawLayer.layers = "SiedlungF_Siedlung_Industrie";
            rawLayer.vtStyles = [
                {
                    id: "VectorTile_STYLE",
                    name: "Test",
                    url: "https://test.geoportal-hamburg.de/vt/esri/resources/styles/root.json",
                    defaultStyle: true
                }
            ];

            const layer = vectorTile.createLayer(rawLayer);

            let featureStyle = null;


            expect(typeof layer.getStyle()).toBe("function");

            featureStyle = layer.getStyle()(feature, 1.3229159522920524);

            expect(featureStyle[0].getFill().getColor()).toBe("rgba(255,255,255,0.4)");
        });
    });
});
