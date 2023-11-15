import getGeometryTypeFromService from "../../../src/vectorStyle/lib/getGeometryTypeFromService";
const fs = require("fs");
/* eslint-disable no-sync */

describe("getGeometryTypeFromService", function () {
    describe("getSubelementsFromXML and getTypeAttributesFromSubelements", function () {
        it("desribeFeatureType response opengis schema contains Point", function () {
            let attributes = null;
            const data = fs.readFileSync("test/vectorStyle/lib/resources/describeFeatureType_opengis_point.xml", "utf8"),
                featureType = "bike_und_ride",
                xml = new window.DOMParser().parseFromString(data, "text/xml"),
                subElements = getGeometryTypeFromService.getSubelementsFromXML(xml, featureType);

            expect(subElements.length).toEqual(11);

            attributes = getGeometryTypeFromService.getTypeAttributesFromSubelements(subElements);
            expect(attributes.length).toEqual(1);
            expect(attributes[0]).toEqual("Point");
        });

        it("desribeFeatureType response opengis schema contains 'Geometry'", function () {
            let attributes = null;
            const data = fs.readFileSync("test/vectorStyle/lib/resources/describeFeatureType_opengis_geometry.xml", "utf8"),
                featureType = "hamburgconvention",
                xml = new window.DOMParser().parseFromString(data, "text/xml"),
                subElements = getGeometryTypeFromService.getSubelementsFromXML(xml, featureType);

            expect(subElements.length).toEqual(56);

            attributes = getGeometryTypeFromService.getTypeAttributesFromSubelements(subElements);
            expect(attributes.length).toEqual(3);
            expect(attributes[0]).toEqual("Point");
            expect(attributes[1]).toEqual("Polygon");
            expect(attributes[2]).toEqual("LineString");
        });

        it("desribeFeatureType response opengis schema with namespace contains 'Geometry'", function () {
            let attributes = null;
            const data = fs.readFileSync("test/vectorStyle/lib/resources/describeFeatureType_xsd_opengis_geometry.xml", "utf8"),
                featureType = "s_parkraumbewirt",
                xml = new window.DOMParser().parseFromString(data, "text/xml"),
                subElements = getGeometryTypeFromService.getSubelementsFromXML(xml, featureType);

            expect(subElements.length).toEqual(6);

            attributes = getGeometryTypeFromService.getTypeAttributesFromSubelements(subElements);
            expect(attributes.length).toEqual(3);
            expect(attributes[0]).toEqual("Point");
            expect(attributes[1]).toEqual("Polygon");
            expect(attributes[2]).toEqual("LineString");
        });

        it("desribeFeatureType response opengis schema with namespace contains 'Geometry' use styleGeometryType", function () {
            let attributes = null;
            const data = fs.readFileSync("test/vectorStyle/lib/resources/describeFeatureType_xsd_opengis_geometry.xml", "utf8"),
                featureType = "s_parkraumbewirt",
                styleGeometryType = "Point",
                xml = new window.DOMParser().parseFromString(data, "text/xml"),
                subElements = getGeometryTypeFromService.getSubelementsFromXML(xml, featureType);

            expect(subElements.length).toEqual(6);

            attributes = getGeometryTypeFromService.getTypeAttributesFromSubelements(subElements, styleGeometryType);
            expect(attributes.length).toEqual(1);
            expect(attributes[0]).toEqual("Point");
        });

        it("desribeFeatureType response opengis schema contains 'MultiPolygon'", function () {
            let attributes = null;
            const data = fs.readFileSync("test/vectorStyle/lib/resources/describeFeatureType_opengis_multi.xml", "utf8"),
                featureType = "umring",
                xml = new window.DOMParser().parseFromString(data, "text/xml"),
                subElements = getGeometryTypeFromService.getSubelementsFromXML(xml, featureType);

            expect(subElements.length).toEqual(1);

            attributes = getGeometryTypeFromService.getTypeAttributesFromSubelements(subElements);
            expect(attributes.length).toEqual(1);
            expect(attributes[0]).toEqual("MultiPolygon");
        });

        it("desribeFeatureType response opengis schema contains 'MultiLineString'", function () {
            let attributes = null;
            const data = fs.readFileSync("test/vectorStyle/lib/resources/describeFeatureType_opengis_multi.xml", "utf8"),
                featureType = "strecken",
                xml = new window.DOMParser().parseFromString(data, "text/xml"),
                subElements = getGeometryTypeFromService.getSubelementsFromXML(xml, featureType);

            expect(subElements.length).toEqual(3);

            attributes = getGeometryTypeFromService.getTypeAttributesFromSubelements(subElements);
            expect(attributes.length).toEqual(1);
            expect(attributes[0]).toEqual("MultiLineString");
        });

        it("desribeFeatureType response opengis schema contains 'Polygon'", function () {
            let attributes = null;
            const data = fs.readFileSync("test/vectorStyle/lib/resources/describeFeatureType_opengis_polygon.xml", "utf8"),
                featureType = "nr_f_biosphaerenreservat",
                xml = new window.DOMParser().parseFromString(data, "text/xml"),
                subElements = getGeometryTypeFromService.getSubelementsFromXML(xml, featureType);

            expect(subElements.length).toEqual(9);

            attributes = getGeometryTypeFromService.getTypeAttributesFromSubelements(subElements);
            expect(attributes.length).toEqual(1);
            expect(attributes[0]).toEqual("Polygon");
        });

        it("desribeFeatureType response geoserver schema contains 'Point'", function () {
            let attributes = null;
            const data = fs.readFileSync("test/vectorStyle/lib/resources/describeFeatureType_geoserver.xml", "utf8"),
                featureType = "nextbike_floating_berlin",
                xml = new window.DOMParser().parseFromString(data, "text/xml"),
                subElements = getGeometryTypeFromService.getSubelementsFromXML(xml, featureType);

            expect(subElements.length).toEqual(4);

            attributes = getGeometryTypeFromService.getTypeAttributesFromSubelements(subElements);
            expect(attributes.length).toEqual(1);
            expect(attributes[0]).toEqual("Point");
        });

        it("desribeFeatureType response geoserver schema contains 'Point', nextbike_stations_berlin", function () {
            let attributes = null;
            const data = fs.readFileSync("test/vectorStyle/lib/resources/describeFeatureType_geoserver.xml", "utf8"),
                featureType = "nextbike_stations_berlin",
                xml = new window.DOMParser().parseFromString(data, "text/xml"),
                subElements = getGeometryTypeFromService.getSubelementsFromXML(xml, featureType);

            expect(subElements.length).toEqual(8);

            attributes = getGeometryTypeFromService.getTypeAttributesFromSubelements(subElements);
            expect(attributes.length).toEqual(1);
            expect(attributes[0]).toEqual("Point");
        });
    });

});


