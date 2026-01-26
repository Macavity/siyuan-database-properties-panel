<script lang="ts">
    import { Plugin } from "siyuan";
    import { configStore } from "@/stores/configStore";
    import { i18nStore } from "@/stores/i18nStore";
    import { STORAGE_NAME } from "@/constants";
    import { LoggerService } from "@/services/LoggerService";
    import {
        DatabaseColumnSettingsService,
        type DatabaseInfo,
        type ColumnInfo as ServiceColumnInfo
    } from "@/services/DatabaseColumnSettingsService";

    // Types
    interface Props {
        plugin: Plugin;
    }

    interface ColumnInfo extends ServiceColumnInfo {
        visible: boolean;
    }

    // Props and services
    let { plugin }: Props = $props();
    const logger = new LoggerService("DatabaseColumnSettings");
    const service = new DatabaseColumnSettingsService();

    // State
    let databases: DatabaseInfo[] = $state([]);
    let selectedDatabaseId = $state("");
    let columns: ColumnInfo[] = $state([]);
    let loadingDatabases = $state(true);
    let loadingColumns = $state(false);

    // Derived state
    const selectedDatabase = $derived(
        databases.find(db => db.id === selectedDatabaseId)
    );
    const isPrimaryKeyHiddenGlobally = $derived(!$configStore.showPrimaryKey);

    // Main data loading functions
    async function loadDatabases() {
        loadingDatabases = true;
        databases = [];
        selectedDatabaseId = "";
        columns = [];

        try {
            databases = await service.loadDatabases();
        } catch (error) {
            logger.error("Failed to load databases", error);
        } finally {
            loadingDatabases = false;
        }
    }

    async function loadColumns(avId: string) {
        if (!avId) {
            columns = [];
            return;
        }

        loadingColumns = true;
        try {
            const serviceColumns = await service.loadColumns(avId);
            const visibility = configStore.getColumnVisibility(avId);
            columns = serviceColumns.map((col) => ({
                ...col,
                visible: visibility[col.id] !== false,
            }));
        } catch (error) {
            logger.error("Failed to load columns", error);
            columns = [];
        } finally {
            loadingColumns = false;
        }
    }

    async function toggleColumn(columnId: string, visible: boolean) {
        configStore.setColumnVisibility(selectedDatabaseId, columnId, visible);

        columns = columns.map((col) =>
            col.id === columnId ? { ...col, visible } : col
        );

        try {
            await plugin.saveData(STORAGE_NAME, configStore.getSettingsObject());
        } catch (error) {
            logger.error("Failed to save column visibility settings", error);
        }
    }

    // Effects
    $effect(() => {
        loadDatabases();
    });

    // React to database selection changes
    let previousDatabaseId = "";
    $effect(() => {
        if (selectedDatabaseId !== previousDatabaseId) {
            previousDatabaseId = selectedDatabaseId;
            loadColumns(selectedDatabaseId);
        }
    });
</script>

<div class="database-column-settings">
    <div class="database-selector b3-label">
        <div class="database-selector-row">
            <select
                class="b3-select fn__flex-1"
                bind:value={selectedDatabaseId}
                disabled={loadingDatabases}
            >
                {#if loadingDatabases}
                    <option value="">{$i18nStore.columnVisibilityLoading}</option>
                {:else if databases.length === 0}
                    <option value="">{$i18nStore.columnVisibilityNoDatabases}</option>
                {:else}
                    <option value="">{$i18nStore.columnVisibilitySelectDatabase}</option>
                    {#each databases as db (db.id)}
                        <option value={db.id}>{db.isOrphaned ? "⚠️ " : ""}{db.name}</option>
                    {/each}
                {/if}
            </select>
            <button
                class="b3-button b3-button--outline"
                onclick={() => loadDatabases()}
                disabled={loadingDatabases}
                title={$i18nStore.columnVisibilityRefresh}
            >
                <svg class="b3-button__icon"><use xlink:href="#iconRefresh"></use></svg>
            </button>
        </div>
    </div>

    {#if !loadingDatabases && databases.length === 0}
        <div class="no-databases-message b3-label">
            {$i18nStore.columnVisibilityNoDatabases}
        </div>
    {/if}

    {#if selectedDatabase?.isOrphaned}
        <div class="orphaned-warning b3-label">
            <svg class="orphaned-warning__icon"><use xlink:href="#iconWarning"></use></svg>
            <span>{$i18nStore.columnVisibilityOrphanedWarning}</span>
        </div>
    {/if}

    {#if selectedDatabaseId}
        <div class="column-list">
            {#if loadingColumns}
                <div class="column-loading b3-label">{$i18nStore.columnVisibilityLoading}</div>
            {:else if columns.length === 0}
                <div class="column-empty b3-label">{$i18nStore.columnVisibilityNoColumns}</div>
            {:else}
                {#each columns as column (column.id)}
                    <div class="column-item b3-label">
                        <div class="column-row">
                            <span class="column-name">{column.name}</span>
                            <span class="column-type">({column.type})</span>
                            {#if column.type === "block" && isPrimaryKeyHiddenGlobally}
                                <span class="column-hidden-hint">{$i18nStore.columnVisibilityHiddenByGlobalSetting}</span>
                            {/if}
                            <button
                                class="column-visibility-toggle"
                                onclick={() => toggleColumn(column.id, !column.visible)}
                                title={column.visible ? $i18nStore.hideEmptyAttributesToggle : $i18nStore.showEmptyAttributesToggle}
                            >
                                <svg><use xlink:href={column.visible ? "#iconEye" : "#iconEyeoff"}></use></svg>
                            </button>
                        </div>
                    </div>
                {/each}
            {/if}
        </div>
    {/if}
</div>

<style lang="scss">
    .database-column-settings {
        padding: 8px 0;
        max-height: 80vh;
        overflow-y: auto;
    }

    .database-selector {
        margin-bottom: 16px;
    }

    .database-selector-row {
        display: flex;
        gap: 8px;
        align-items: center;
    }

    .column-list {
        display: flex;
        flex-direction: column;
    }

    .column-item {
        padding: 8px 0;
        border-bottom: 1px solid var(--b3-theme-surface-lighter);

        &:last-child {
            border-bottom: none;
        }
    }

    .column-row {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .column-name {
        flex: 1;
    }

    .column-type {
        color: var(--b3-theme-on-surface-light);
        font-size: 12px;
    }

    .column-hidden-hint {
        color: var(--b3-card-warning-color);
        font-size: 12px;
        font-style: italic;
    }

    .column-visibility-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        padding: 0;
        border: none;
        background: transparent;
        border-radius: 4px;
        cursor: pointer;
        color: var(--b3-theme-on-surface);

        &:hover {
            background: var(--b3-theme-background-light);
        }

        svg {
            width: 16px;
            height: 16px;
        }
    }

    .column-loading,
    .column-empty,
    .no-databases-message {
        color: var(--b3-theme-on-surface-light);
        padding: 16px;
        text-align: center;
    }

    .orphaned-warning {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px;
        margin-bottom: 16px;
        background: var(--b3-card-warning-background);
        border-radius: 4px;
        color: var(--b3-card-warning-color);
        font-size: 13px;
    }

    .orphaned-warning__icon {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
    }
</style>
