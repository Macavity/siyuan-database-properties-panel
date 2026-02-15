import { readDir, renderAttributeView, sql } from "@/api";
import { LoggerService } from "./LoggerService";

const AV_STORAGE_PATH = "/data/storage/av/";
const AV_ID_REGEX = /data-av-id="([^"]+)"/;

export interface DatabaseInfo {
    id: string;
    name: string;
    isOrphaned: boolean;
}

export interface ColumnInfo {
    id: string;
    name: string;
    type: string;
}

interface AvBlock {
    markdown?: string;
}

export class DatabaseColumnSettingsService {
    private logger: LoggerService;

    constructor() {
        this.logger = new LoggerService("DatabaseColumnSettingsService");
    }

    /**
     * Extract AV ID from markdown HTML containing data-av-id attribute
     */
    extractAvIdFromMarkdown(markdown: string): string | null {
        const match = markdown.match(AV_ID_REGEX);
        return match?.[1] ?? null;
    }

    /**
     * Query database for placed AV blocks and return set of their IDs
     */
    async fetchPlacedAvIds(limit: number): Promise<Set<string>> {
        const placedAvIds = new Set<string>();

        try {
            // Cast to number and validate to prevent SQL injection
            // Ensure it's a positive integer
            limit = Math.min(Math.max(1, Number(limit)), 1000);

            const blocks = await sql(`SELECT * FROM blocks WHERE type='av' LIMIT ${limit}`) as AvBlock[];

            if (!blocks || !Array.isArray(blocks)) {
                return placedAvIds;
            }

            for (const block of blocks) {
                if (block.markdown) {
                    const avId = this.extractAvIdFromMarkdown(block.markdown);
                    if (avId) {
                        placedAvIds.add(avId);
                    }
                }
            }
        } catch (error) {
            this.logger.error("Failed to fetch placed AV IDs", error);
        }

        return placedAvIds;
    }

    /**
     * Fetch database information for a single AV
     */
    async fetchDatabaseInfo(avId: string, placedAvIds: Set<string>): Promise<DatabaseInfo | null> {
        try {
            const avData = await renderAttributeView(avId);
            if (avData) {
                return {
                    id: avId,
                    name: avData.name || avId,
                    isOrphaned: !placedAvIds.has(avId),
                };
            }
        } catch (e) {
            this.logger.debug(`Failed to load AV ${avId}`, e);
        }
        return null;
    }

    /**
     * Sort databases: active first, then orphaned; alphabetically within each group
     */
    sortDatabases(databases: DatabaseInfo[]): DatabaseInfo[] {
        return databases.sort((a, b) => {
            if (a.isOrphaned !== b.isOrphaned) {
                return a.isOrphaned ? 1 : -1;
            }
            return a.name.localeCompare(b.name);
        });
    }

    /**
     * Load all databases from storage
     */
    async loadDatabases(): Promise<DatabaseInfo[]> {
        try {
            const dirEntries = await readDir(AV_STORAGE_PATH);

            if (!dirEntries || !Array.isArray(dirEntries)) {
                this.logger.debug("No valid directory entries returned");
                return [];
            }

            const jsonFiles = dirEntries.filter(e => !e.isDir && e.name.endsWith(".json"));
            const placedAvIds = await this.fetchPlacedAvIds(jsonFiles.length);
            // this.logger.debug("Placed AV IDs", [...placedAvIds]);

            const databases: DatabaseInfo[] = [];
            for (const entry of jsonFiles) {
                const avId = entry.name.replace(".json", "");
                const dbInfo = await this.fetchDatabaseInfo(avId, placedAvIds);
                if (dbInfo) {
                    databases.push(dbInfo);
                }
            }

            const sorted = this.sortDatabases(databases);
            // this.logger.debug(`Loaded ${sorted.length} databases`);
            return sorted;
        } catch (error) {
            this.logger.error("Failed to load databases", error);
            return [];
        }
    }

    /**
     * Load columns for a specific database
     */
    async loadColumns(avId: string): Promise<ColumnInfo[]> {
        if (!avId) {
            return [];
        }

        try {
            const avData = await renderAttributeView(avId);
            const entries = avData?.view?.columns ?? avData?.view?.fields;
            if (entries) {
                return entries.map((col) => ({
                    id: col.id,
                    name: col.name,
                    type: col.type,
                }));
            }
            return [];
        } catch (error) {
            this.logger.error("Failed to load columns", error);
            return [];
        }
    }
}
