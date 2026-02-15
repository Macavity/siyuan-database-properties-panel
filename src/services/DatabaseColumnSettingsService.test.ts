import { describe, it, expect, vi, beforeEach } from "vitest";
import { DatabaseColumnSettingsService } from "./DatabaseColumnSettingsService";
import * as api from "@/api";

// Mock the API and logger
vi.mock("@/api");
vi.mock("./LoggerService");

describe("DatabaseColumnSettingsService", () => {
    let service: DatabaseColumnSettingsService;

    beforeEach(() => {
        vi.clearAllMocks();
        service = new DatabaseColumnSettingsService();
    });

    describe("extractAvIdFromMarkdown", () => {
        it("extracts AV ID from HTML markdown", () => {
            const markdown = '<div data-type="NodeAttributeView" data-av-id="test-av-123" data-av-type="table"></div>';
            const result = service.extractAvIdFromMarkdown(markdown);
            expect(result).toBe("test-av-123");
        });

        it("returns null when no AV ID found", () => {
            const markdown = '<div data-type="NodeAttributeView"></div>';
            const result = service.extractAvIdFromMarkdown(markdown);
            expect(result).toBeNull();
        });

        it("returns null for empty string", () => {
            const result = service.extractAvIdFromMarkdown("");
            expect(result).toBeNull();
        });
    });

    describe("fetchPlacedAvIds", () => {
        it("returns set of placed AV IDs", async () => {
            const mockBlocks = [
                { markdown: '<div data-av-id="av-1"></div>' },
                { markdown: '<div data-av-id="av-2"></div>' },
            ];
            vi.mocked(api.sql).mockResolvedValue(mockBlocks);

            const result = await service.fetchPlacedAvIds(10);

            expect(result.size).toBe(2);
            expect(result.has("av-1")).toBe(true);
            expect(result.has("av-2")).toBe(true);
        });

        it("handles empty result", async () => {
            vi.mocked(api.sql).mockResolvedValue([]);

            const result = await service.fetchPlacedAvIds(10);

            expect(result.size).toBe(0);
        });

        it("handles API errors gracefully", async () => {
            vi.mocked(api.sql).mockRejectedValue(new Error("SQL error"));

            const result = await service.fetchPlacedAvIds(10);

            expect(result.size).toBe(0);
        });

        it("skips blocks without markdown", async () => {
            const mockBlocks = [
                { markdown: '<div data-av-id="av-1"></div>' },
                {},
                { markdown: null },
            ];
            vi.mocked(api.sql).mockResolvedValue(mockBlocks);

            const result = await service.fetchPlacedAvIds(10);

            expect(result.size).toBe(1);
            expect(result.has("av-1")).toBe(true);
        });
    });

    describe("fetchDatabaseInfo", () => {
        it("returns database info with orphaned status", async () => {
            const mockAvData = {
                id: "av-1",
                name: "Test Database",
                isMirror: false,
                view: { id: "view-1", name: "View", columns: [] },
            };
            vi.mocked(api.renderAttributeView).mockResolvedValue(mockAvData);

            const placedIds = new Set(["av-2"]);
            const result = await service.fetchDatabaseInfo("av-1", placedIds);

            expect(result).toEqual({
                id: "av-1",
                name: "Test Database",
                isOrphaned: true,
            });
        });

        it("marks database as not orphaned when in placed set", async () => {
            const mockAvData = {
                id: "av-1",
                name: "Test Database",
                isMirror: false,
                view: { id: "view-1", name: "View", columns: [] },
            };
            vi.mocked(api.renderAttributeView).mockResolvedValue(mockAvData);

            const placedIds = new Set(["av-1"]);
            const result = await service.fetchDatabaseInfo("av-1", placedIds);

            expect(result?.isOrphaned).toBe(false);
        });

        it("uses AV ID as name when name is missing", async () => {
            const mockAvData = {
                id: "av-1",
                name: "",
                isMirror: false,
                view: { id: "view-1", name: "View", columns: [] },
            };
            vi.mocked(api.renderAttributeView).mockResolvedValue(mockAvData);

            const result = await service.fetchDatabaseInfo("av-1", new Set());

            expect(result?.name).toBe("av-1");
        });

        it("returns null when API call fails", async () => {
            vi.mocked(api.renderAttributeView).mockRejectedValue(new Error("API error"));

            const result = await service.fetchDatabaseInfo("av-1", new Set());

            expect(result).toBeNull();
        });
    });

    describe("sortDatabases", () => {
        it("sorts active databases before orphaned", () => {
            const databases = [
                { id: "1", name: "Orphaned", isOrphaned: true },
                { id: "2", name: "Active", isOrphaned: false },
            ];

            const result = service.sortDatabases(databases);

            expect(result[0].id).toBe("2");
            expect(result[1].id).toBe("1");
        });

        it("sorts alphabetically within same orphaned status", () => {
            const databases = [
                { id: "1", name: "Zebra", isOrphaned: false },
                { id: "2", name: "Apple", isOrphaned: false },
                { id: "3", name: "Beta", isOrphaned: false },
            ];

            const result = service.sortDatabases(databases);

            expect(result[0].name).toBe("Apple");
            expect(result[1].name).toBe("Beta");
            expect(result[2].name).toBe("Zebra");
        });

        it("handles empty array", () => {
            const result = service.sortDatabases([]);
            expect(result).toEqual([]);
        });
    });

    describe("loadDatabases", () => {
        it("loads and returns sorted databases", async () => {
            const mockDirEntries = [
                { isDir: false, isSymlink: false, name: "av-1.json" },
                { isDir: false, isSymlink: false, name: "av-2.json" },
            ];
            const mockAvData = {
                id: "av-1",
                name: "Database",
                isMirror: false,
                view: { id: "view-1", name: "View", columns: [] },
            };

            vi.mocked(api.readDir).mockResolvedValue(mockDirEntries);
            vi.mocked(api.sql).mockResolvedValue([]);
            vi.mocked(api.renderAttributeView).mockResolvedValue(mockAvData);

            const result = await service.loadDatabases();

            expect(result.length).toBe(2);
            expect(api.readDir).toHaveBeenCalled();
        });

        it("filters out directories and non-json files", async () => {
            const mockDirEntries = [
                { isDir: true, isSymlink: false, name: "folder" },
                { isDir: false, isSymlink: false, name: "file.txt" },
                { isDir: false, isSymlink: false, name: "av-1.json" },
            ];
            const mockAvData = {
                id: "av-1",
                name: "Database",
                isMirror: false,
                view: { id: "view-1", name: "View", columns: [] },
            };

            vi.mocked(api.readDir).mockResolvedValue(mockDirEntries);
            vi.mocked(api.sql).mockResolvedValue([]);
            vi.mocked(api.renderAttributeView).mockResolvedValue(mockAvData);

            const result = await service.loadDatabases();

            expect(result.length).toBe(1);
        });

        it("returns empty array on error", async () => {
            vi.mocked(api.readDir).mockRejectedValue(new Error("Read error"));

            const result = await service.loadDatabases();

            expect(result).toEqual([]);
        });
    });

    describe("loadColumns", () => {
        it("loads and returns columns", async () => {
            const mockAvData = {
                id: "av-1",
                name: "Database",
                isMirror: false,
                view: {
                    id: "view-1",
                    name: "View",
                    columns: [
                        { id: "col-1", name: "Column 1", type: "text", icon: "", hidden: false, wrap: false, pin: false, width: "100px" },
                        { id: "col-2", name: "Column 2", type: "number", icon: "", hidden: false, wrap: false, pin: false, width: "100px" },
                    ],
                },
            };

            vi.mocked(api.renderAttributeView).mockResolvedValue(mockAvData);

            const result = await service.loadColumns("av-1");

            expect(result.length).toBe(2);
            expect(result[0]).toEqual({ id: "col-1", name: "Column 1", type: "text" });
        });

        it("returns empty array for empty avId", async () => {
            const result = await service.loadColumns("");
            expect(result).toEqual([]);
        });

        it("returns empty array when no columns", async () => {
            const mockAvData = {
                id: "av-1",
                name: "Database",
                isMirror: false,
                view: {
                    id: "view-1",
                    name: "View",
                    columns: [],
                },
            };

            vi.mocked(api.renderAttributeView).mockResolvedValue(mockAvData);

            const result = await service.loadColumns("av-1");

            expect(result).toEqual([]);
        });

        it("returns empty array on error", async () => {
            vi.mocked(api.renderAttributeView).mockRejectedValue(new Error("API error"));

            const result = await service.loadColumns("av-1");

            expect(result).toEqual([]);
        });

        it("loads columns from fields for kanban/card views", async () => {
            const mockAvData = {
                id: "av-1",
                name: "Kanban Database",
                isMirror: false,
                view: {
                    id: "view-1",
                    name: "Kanban View",
                    fields: [
                        { id: "field-1", name: "Primary Key", type: "block", icon: "", hidden: false, wrap: false, pin: false, width: "" },
                        { id: "field-2", name: "Status", type: "select", icon: "", hidden: false, wrap: false, pin: false, width: "" },
                    ],
                },
            };

            vi.mocked(api.renderAttributeView).mockResolvedValue(mockAvData);

            const result = await service.loadColumns("av-1");

            expect(result.length).toBe(2);
            expect(result[0]).toEqual({ id: "field-1", name: "Primary Key", type: "block" });
            expect(result[1]).toEqual({ id: "field-2", name: "Status", type: "select" });
        });

        it("prefers columns over fields when both are present", async () => {
            const mockAvData = {
                id: "av-1",
                name: "Database",
                isMirror: false,
                view: {
                    id: "view-1",
                    name: "View",
                    columns: [
                        { id: "col-1", name: "Column 1", type: "text", icon: "", hidden: false, wrap: false, pin: false, width: "100px" },
                    ],
                    fields: [
                        { id: "field-1", name: "Field 1", type: "text", icon: "", hidden: false, wrap: false, pin: false, width: "" },
                    ],
                },
            };

            vi.mocked(api.renderAttributeView).mockResolvedValue(mockAvData);

            const result = await service.loadColumns("av-1");

            expect(result.length).toBe(1);
            expect(result[0]).toEqual({ id: "col-1", name: "Column 1", type: "text" });
        });
    });
});
