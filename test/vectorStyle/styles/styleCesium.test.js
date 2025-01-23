import CesiumStyle from "../../../src/vectorStyle/styles/styleCesium";
import StyleClass from "../../../src/vectorStyle/styles/style";

describe("styleCesium", () => {
    const expectedStyle = ["((${attributes.Dachform} === 'Flachdach'))", "rgba(50, 154, 26, 0.8)"];
    let rule,
        styleCesiumClass;

    beforeEach(() => {
        rule = {
            conditions: {
                "attributes.Dachform": "Flachdach"
            },
            style: {
                type: "cesium",
                color: "rgba(50, 154, 26, 0.8)"
            }
        };

    });

    describe("initialize", function () {
        it("shall call 3 functions for initialization", () => {
            const setConditionsSpy = jest.spyOn(CesiumStyle.prototype, "setConditions"),
                overwriteStylingSpy = jest.spyOn(StyleClass.prototype, "overwriteStyling"),
                setStyleSpy = jest.spyOn(StyleClass.prototype, "setStyle");

            styleCesiumClass = new CesiumStyle();
            styleCesiumClass.initialize(rule);
            expect(setConditionsSpy).toHaveBeenCalledTimes(1);
            expect(overwriteStylingSpy).toHaveBeenCalledTimes(1);
            expect(setStyleSpy).toHaveBeenCalledTimes(1);
        });
    });


    describe("createStyle", function () {
        it("shall call createCondition and create expected style", () => {
            const createConditionSpy = jest.spyOn(CesiumStyle.prototype, "createCondition"),
                createdStyle = styleCesiumClass.createStyle();

            styleCesiumClass = new CesiumStyle();
            expect(createConditionSpy).toHaveBeenCalledTimes(1);
            expect(createConditionSpy).toHaveBeenCalledWith(rule.conditions, expectedStyle);
            expect(createdStyle).toEqual(expectedStyle);
        });
    });

    describe("createCondition", function () {
        it("createCondition with conditions and no style", () => {
            let condition = null;

            styleCesiumClass = new CesiumStyle();
            styleCesiumClass.initialize(rule);
            condition = styleCesiumClass.createCondition(rule.conditions);

            expect(condition).toEqual(expectedStyle);
        });

        it("createCondition with no conditions and no style", () => {
            let condition = null;

            styleCesiumClass = new CesiumStyle();
            delete rule.conditions;
            styleCesiumClass.initialize(rule);
            condition = styleCesiumClass.createCondition(undefined);

            expect(condition).toEqual(["true", "rgba(50, 154, 26, 0.8)"]);
        });


        it("createCondition no conditions but with style", () => {
            let condition = null;
            const style = {
                color: "rgba(150, 154, 26, 0.8)"
            };

            styleCesiumClass = new CesiumStyle();
            delete rule.conditions;
            styleCesiumClass.initialize(rule);
            condition = styleCesiumClass.createCondition(undefined, style);

            expect(condition).toEqual(["true", "rgba(150, 154, 26, 0.8)"]);
        });
    });

    describe("createCesiumConditionForRule", function () {
        it("createCesiumConditionForRule with an equals condition", () => {
            let condition = null;

            styleCesiumClass = new CesiumStyle();
            styleCesiumClass.initialize(rule);
            condition = styleCesiumClass.createCesiumConditionForRule([["attributes.Dachform", "Flachdach"]]);

            expect(condition).toEqual("((${attributes.Dachform} === 'Flachdach'))");
        });

        it("createCesiumConditionForRule with 2 equals conditions", () => {
            let condition = null;

            styleCesiumClass = new CesiumStyle();
            styleCesiumClass.initialize(rule);
            condition = styleCesiumClass.createCesiumConditionForRule([["attributes.Dachform", "Flachdach"], ["foo", "bar"]]);

            expect(condition).toEqual("((${attributes.Dachform} === 'Flachdach') && (${foo} === 'bar'))");
        });

        it("createCesiumConditionForRule with a >, <= condition", () => {
            let condition = null;

            styleCesiumClass = new CesiumStyle();
            styleCesiumClass.initialize(rule);
            condition = styleCesiumClass.createCesiumConditionForRule([["attributes.height", [10, 20]]]);

            expect(condition).toEqual("((${attributes.height} > 10 && ${attributes.height} <= 20))");
        });


    });
});
