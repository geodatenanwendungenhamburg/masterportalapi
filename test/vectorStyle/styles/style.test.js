import StyleClass from "../../../src/vectorStyle/styles/style";

describe("StyleClass", () => {
    describe("createLegendLabel", () => {
        it("returns legendValue with highest precedence", () => {
            const style = new StyleClass(),
                label = style.createLegendLabel({
                    conditions: {
                        properties: {
                            category: "Rule Label"
                        }
                    }
                },
                {
                    attributes: {
                        legendValue: 123
                    }
                });

            expect(label).toBe("123");
        });

        it("creates label from properties configured as array of objects", () => {
            const style = new StyleClass(),
                label = style.createLegendLabel({
                    conditions: {
                        properties: [
                            {
                                key: "category",
                                value: "A"
                            },
                            {
                                key: "category",
                                value: "B"
                            }
                        ]
                    }
                },
                {
                    attributes: {}
                });

            expect(label).toBe("A, B");
        });

        it("appends valid sequence to created label", () => {
            const style = new StyleClass(),
                label = style.createLegendLabel({
                    conditions: {
                        properties: {
                            category: "A"
                        },
                        sequence: [10, 20]
                    }
                },
                {
                    attributes: {}
                });

            expect(label).toBe("A (10-20)");
        });

        it("returns null if no legendValue and no rule conditions exist", () => {
            const style = new StyleClass(),
                label = style.createLegendLabel(undefined, {attributes: {}});

            expect(label).toBeNull();
        });
    });
});
