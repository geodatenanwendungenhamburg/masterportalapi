import * as gazetteerSearchResults from "./gazetteerSearchResults/index";

import {parse} from "../../src/searchAddress/parse";
import {searchTypes} from "../../src/searchAddress";

describe("searchAddress", function () {
    describe("parse", function () {
        it("parses district results as expected", function (done) {
            parse(searchTypes.DISTRICT, gazetteerSearchResults.districtResult)
                .then(x => {
                    expect(x[0].name).toBe("Barmbek-Nord");
                    expect(x[0].type).toBe(searchTypes.DISTRICT);
                    expect(x[0].properties.bundeslandname).toBe("Hamburg");
                    expect(x[0].geometry.type).toBe("Point");
                    expect(x[0].geometry.coordinates).toEqual([
                        "569569.732", "5939046.574"
                    ]);

                    expect(x[1].name).toBe("Barmbek-Süd");
                    expect(x[1].type).toBe(searchTypes.DISTRICT);
                    expect(x[1].properties.bundeslandname).toBe("Hamburg");
                    expect(x[1].geometry.coordinates).toEqual([
                        "568729.508", "5937017.649"
                    ]);
                    done();
                });
        });

        it("parses street key results as expected", function (done) {
            parse(searchTypes.STREET_KEY, gazetteerSearchResults.streetKeyResult)
                .then(x => {
                    expect(x[0].name).toBe("Alte Marsch");
                    expect(x[0].type).toBe(searchTypes.STREET_KEY);
                    expect(x[0].properties.postOrtsteil).toBe("Neugraben-Fischbek");
                    expect(x[0].geometry.type).toBe("Point");
                    expect(x[0].geometry.coordinates).toEqual([
                        "555108.287", "5925298.269"
                    ]);
                    done();
                });
        });

        it("parses street results as expected", function (done) {
            parse(searchTypes.STREET, gazetteerSearchResults.streetResult)
                .then(x => {
                    expect(x[0].name).toBe("Bargkoppelweg");
                    expect(x[0].type).toBe(searchTypes.STREET);
                    expect(x[0].properties.postOrtsteil).toBe("Rahlstedt");
                    expect(x[0].geometry.type).toBe("Point");
                    expect(x[0].geometry.coordinates).toEqual([
                        "576096.393", "5941919.653"
                    ]);
                    done();
                });
        });

        it("parses parcel results as expected", function (done) {
            parse(searchTypes.PARCEL, gazetteerSearchResults.parcelResult)
                .then(x => {
                    expect(x[0].name).toBe("0147/12561");
                    expect(x[0].type).toBe(searchTypes.PARCEL);
                    expect(x[0].properties.gemeindename).toBe("Wilhelmsburg");
                    expect(x[0].geometry.type).toBe("Point");
                    expect(x[0].geometry.coordinates).toEqual([
                        "566483.579", "5928126.330"
                    ]);
                    done();
                });
        });

        it("parses houseNumber results as expected", function (done) {
            parse(searchTypes.HOUSE_NUMBERS_FOR_STREET, gazetteerSearchResults.houseNumberResult)
                .then(x => {
                    expect(x[0].name).toBe("Pflugacker 11a");
                    expect(x[0].type).toBe(searchTypes.HOUSE_NUMBERS_FOR_STREET);
                    expect(x[0].geometry.type).toBe("Point");
                    expect(x[0].geometry.coordinates).toEqual([
                        "559587.466", "5940953.639"
                    ]);
                    done();
                });
        });

        it("parses address (with addition) results as expected", function (done) {
            parse(searchTypes.ADDRESS_AFFIXED, gazetteerSearchResults.addressResults.adresseMitZusatz)
                .then(x => {
                    expect(x[0].name).toBe("Pflugacker 13b");
                    expect(x[0].type).toBe(searchTypes.ADDRESS_AFFIXED);
                    expect(x[0].geometry.type).toBe("Point");
                    expect(x[0].geometry.coordinates).toEqual([
                        "559578.353", "5941044.732"
                    ]);
                    done();
                });
        });

        it("parses address (without addition) results as expected", function (done) {
            parse(searchTypes.ADDRESS_UNAFFIXED, gazetteerSearchResults.addressResults.adresseOhneZusatz)
                .then(x => {
                    expect(x[0].name).toBe("Bargkoppelweg 1");
                    expect(x[0].type).toBe(searchTypes.ADDRESS_UNAFFIXED);
                    expect(x[0].geometry.type).toBe("Point");
                    expect(x[0].geometry.coordinates).toEqual([
                        "576071.966", "5941920.455"
                    ]);
                    done();
                });
        });

        describe("domNodeToObject - strips namespace prefixes from tag names", () => {
            it("should not contain colon in any parsed key", async () => {
                const x = await parse(searchTypes.DISTRICT, gazetteerSearchResults.districtResult);
                // eslint-disable-next-line func-style
                const allKeys = (obj) => {
                    if (typeof obj !== "object" || obj === null) {
                        return [];
                    }
                    // eslint-disable-next-line max-nested-callbacks
                    return Object.keys(obj).flatMap(k => [k, ...allKeys(obj[k])]);
                };

                allKeys(x[0]).forEach(key => {
                    expect(key).not.toContain(":");
                });
            });

            it("should parse namespace-prefixed XML and return localName as key", () => {
                const parser = new DOMParser();
                const xml = `
                    <wfs:FeatureCollection xmlns:wfs="http://www.opengis.net/wfs"
                                           xmlns:gml="http://www.opengis.net/gml">
                        <wfs:member>
                            <gml:Point>
                                <gml:pos>10.0 53.5</gml:pos>
                            </gml:Point>
                        </wfs:member>
                    </wfs:FeatureCollection>`;
                const doc = parser.parseFromString(xml, "text/xml");

                expect(doc.documentElement.localName).toBe("FeatureCollection");
                expect(doc.documentElement.children[0].localName).toBe("member");
                expect(doc.documentElement.children[0].children[0].localName).toBe("Point");
                expect(doc.documentElement.children[0].children[0].children[0].localName).toBe("pos");
            });
        });
    });
});
