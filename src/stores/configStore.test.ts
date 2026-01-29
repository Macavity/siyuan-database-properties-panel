import { describe, test, expect, beforeEach } from "vitest";
import { configStore, defaultConfig, createConfigFromStorage } from "./configStore";
import { get } from "svelte/store";

describe("configStore", () => {
    beforeEach(() => {
        // Reset the store to default state
        configStore.setFromConfigDTO(defaultConfig);
    });

    describe("column visibility", () => {
        const avId = "test-av-123";
        const columnId = "test-column-456";

        test("isColumnVisible returns true for columns not in config", () => {
            const isVisible = configStore.isColumnVisible(avId, columnId);
            expect(isVisible).toBe(true);
        });

        test("setColumnVisibility hides column", () => {
            configStore.setColumnVisibility(avId, columnId, false);
            const isVisible = configStore.isColumnVisible(avId, columnId);
            expect(isVisible).toBe(false);
        });

        test("setColumnVisibility shows column by removing entry", () => {
            // First hide the column
            configStore.setColumnVisibility(avId, columnId, false);
            expect(configStore.isColumnVisible(avId, columnId)).toBe(false);

            // Then show it again
            configStore.setColumnVisibility(avId, columnId, true);
            expect(configStore.isColumnVisible(avId, columnId)).toBe(true);

            // Verify the entry was removed from storage
            const config = get(configStore);
            expect(config.columnVisibility[avId]).toBeUndefined();
        });

        test("setColumnVisibility cleans up empty AV entries", () => {
            // Hide and then show a column
            configStore.setColumnVisibility(avId, columnId, false);
            configStore.setColumnVisibility(avId, columnId, true);

            const config = get(configStore);
            expect(config.columnVisibility[avId]).toBeUndefined();
        });

        test("getColumnVisibility returns empty object for AV without config", () => {
            const visibility = configStore.getColumnVisibility(avId);
            expect(visibility).toEqual({});
        });

        test("getColumnVisibility returns config for AV with hidden columns", () => {
            const col1 = "col-1";
            const col2 = "col-2";

            configStore.setColumnVisibility(avId, col1, false);
            configStore.setColumnVisibility(avId, col2, false);

            const visibility = configStore.getColumnVisibility(avId);
            expect(visibility).toEqual({
                [col1]: false,
                [col2]: false,
            });
        });

        test("column visibility is isolated per database", () => {
            const avId1 = "av-1";
            const avId2 = "av-2";
            const columnId = "shared-column";

            configStore.setColumnVisibility(avId1, columnId, false);

            expect(configStore.isColumnVisible(avId1, columnId)).toBe(false);
            expect(configStore.isColumnVisible(avId2, columnId)).toBe(true);
        });

        test("multiple columns can be hidden in same database", () => {
            const col1 = "col-1";
            const col2 = "col-2";
            const col3 = "col-3";

            configStore.setColumnVisibility(avId, col1, false);
            configStore.setColumnVisibility(avId, col2, false);

            expect(configStore.isColumnVisible(avId, col1)).toBe(false);
            expect(configStore.isColumnVisible(avId, col2)).toBe(false);
            expect(configStore.isColumnVisible(avId, col3)).toBe(true);
        });
    });

    describe("createConfigFromStorage", () => {
        test("creates config with defaults for missing properties", () => {
            const partial = {
                showPrimaryKey: true,
            };

            const config = createConfigFromStorage(partial);

            expect(config.showPrimaryKey).toBe(true);
            expect(config.showEmptyAttributes).toBe(defaultConfig.showEmptyAttributes);
            expect(config.columnVisibility).toEqual(defaultConfig.columnVisibility);
        });

        test("preserves column visibility from storage", () => {
            const partial = {
                columnVisibility: {
                    "av-1": {
                        "col-1": false,
                        "col-2": false,
                    },
                },
            };

            const config = createConfigFromStorage(partial);

            expect(config.columnVisibility).toEqual(partial.columnVisibility);
        });
    });

    describe("setSetting", () => {
        test("updates boolean settings", () => {
            configStore.setSetting("showPrimaryKey", true);
            const config = get(configStore);
            expect(config.showPrimaryKey).toBe(true);
        });

        test("updates showEmptyAttributes", () => {
            configStore.setSetting("showEmptyAttributes", true);
            const config = get(configStore);
            expect(config.showEmptyAttributes).toBe(true);
        });
    });

    describe("getSettingsObject", () => {
        test("returns settings without loading flag", () => {
            const avId = "test-av";
            const columnId = "test-col";
            configStore.setColumnVisibility(avId, columnId, false);

            const settings = configStore.getSettingsObject();

            // loading property should not exist on PluginConfigDTO (removed by getSettingsObject)
            expect('loading' in settings).toBe(false);
            expect(settings.columnVisibility).toBeDefined();
            expect(settings.columnVisibility[avId]).toEqual({
                [columnId]: false,
            });
        });
    });
});
