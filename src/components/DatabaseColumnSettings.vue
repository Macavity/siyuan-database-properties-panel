<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import type { Plugin } from "siyuan";
import { useConfigStore } from "@/stores/configStore";
import { useI18nStore } from "@/stores/i18nStore";
import { STORAGE_NAME } from "@/constants";
import { LoggerService } from "@/services/LoggerService";
import {
  DatabaseColumnSettingsService,
  type DatabaseInfo,
  type ColumnInfo as ServiceColumnInfo,
} from "@/services/DatabaseColumnSettingsService";

interface ColumnInfo extends ServiceColumnInfo {
  visible: boolean;
}

const props = defineProps<{
  plugin: Plugin;
}>();

const logger = new LoggerService("DatabaseColumnSettings");
const service = new DatabaseColumnSettingsService();

const configStore = useConfigStore();
const i18nStore = useI18nStore();

// State
const databases = ref<DatabaseInfo[]>([]);
const selectedDatabaseId = ref("");
const columns = ref<ColumnInfo[]>([]);
const loadingDatabases = ref(true);
const loadingColumns = ref(false);
const showOrphanedDatabases = ref(false);

// Derived state
const filteredDatabases = computed(() =>
  showOrphanedDatabases.value ? databases.value : databases.value.filter((db) => !db.isOrphaned)
);
const selectedDatabase = computed(() =>
  databases.value.find((db) => db.id === selectedDatabaseId.value)
);
const isPrimaryKeyHiddenGlobally = computed(() => !configStore.showPrimaryKey);

// Main data loading functions
async function loadDatabases() {
  loadingDatabases.value = true;
  databases.value = [];
  selectedDatabaseId.value = "";
  columns.value = [];

  try {
    databases.value = await service.loadDatabases();
  } catch (error) {
    logger.error("Failed to load databases", error);
  } finally {
    loadingDatabases.value = false;
  }
}

async function loadColumns(avId: string) {
  if (!avId) {
    columns.value = [];
    return;
  }

  loadingColumns.value = true;
  try {
    const serviceColumns = await service.loadColumns(avId);
    const visibility = configStore.getColumnVisibility(avId);
    columns.value = serviceColumns.map((col) => ({
      ...col,
      visible: visibility[col.id] !== false,
    }));
  } catch (error) {
    logger.error("Failed to load columns", error);
    columns.value = [];
  } finally {
    loadingColumns.value = false;
  }
}

async function toggleColumn(columnId: string, visible: boolean) {
  configStore.setColumnVisibility(selectedDatabaseId.value, columnId, visible);

  columns.value = columns.value.map((col) =>
    col.id === columnId ? { ...col, visible } : col
  );

  try {
    await props.plugin.saveData(STORAGE_NAME, configStore.getSettingsObject());
  } catch (error) {
    logger.error("Failed to save column visibility settings", error);
  }
}

// Load databases on mount
onMounted(() => {
  loadDatabases();
});

// React to database selection changes
watch(selectedDatabaseId, (newVal) => {
  loadColumns(newVal);
});

// Clear selected database if it's orphaned and toggle is off
watch(showOrphanedDatabases, (newVal) => {
  if (!newVal && selectedDatabase.value?.isOrphaned) {
    selectedDatabaseId.value = "";
  }
});
</script>

<template>
  <div class="database-column-settings">
    <div class="database-selector b3-label">
      <div class="show-orphaned-toggle-row">
        <label>
          <input type="checkbox" class="b3-switch" v-model="showOrphanedDatabases" />
          Show orphaned databases
        </label>
      </div>
      <div class="database-selector-row">
        <select
          class="b3-select fn__flex-1"
          v-model="selectedDatabaseId"
          :disabled="loadingDatabases"
        >
          <option v-if="loadingDatabases" value="">{{ i18nStore.strings.columnVisibilityLoading }}</option>
          <template v-else-if="filteredDatabases.length === 0">
            <option value="">{{ i18nStore.strings.columnVisibilityNoDatabases }}</option>
          </template>
          <template v-else>
            <option value="">{{ i18nStore.strings.columnVisibilitySelectDatabase }}</option>
            <option v-for="db in filteredDatabases" :key="db.id" :value="db.id">
              {{ db.isOrphaned ? "⚠️ " : "" }}{{ db.name }}
            </option>
          </template>
        </select>
        <button
          class="b3-button b3-button--outline"
          @click="loadDatabases()"
          :disabled="loadingDatabases"
          :title="i18nStore.strings.columnVisibilityRefresh"
        >
          <svg class="b3-button__icon"><use xlink:href="#iconRefresh"></use></svg>
        </button>
      </div>
    </div>

    <div
      v-if="!loadingDatabases && filteredDatabases.length === 0"
      class="no-databases-message b3-label"
    >
      {{ i18nStore.strings.columnVisibilityNoDatabases }}
    </div>

    <div v-if="selectedDatabase?.isOrphaned" class="orphaned-warning b3-label">
      <svg class="orphaned-warning__icon"><use xlink:href="#iconWarning"></use></svg>
      <span>{{ i18nStore.strings.columnVisibilityOrphanedWarning }}</span>
    </div>

    <div v-if="selectedDatabaseId" class="column-list">
      <div v-if="loadingColumns" class="column-loading b3-label">
        {{ i18nStore.strings.columnVisibilityLoading }}
      </div>
      <div v-else-if="columns.length === 0" class="column-empty b3-label">
        {{ i18nStore.strings.columnVisibilityNoColumns }}
      </div>
      <template v-else>
        <div v-for="column in columns" :key="column.id" class="column-item b3-label">
          <div class="column-row">
            <span class="column-name">{{ column.name }}</span>
            <span class="column-type">({{ column.type }})</span>
            <span
              v-if="column.type === 'block' && isPrimaryKeyHiddenGlobally"
              class="column-hidden-hint"
            >
              {{ i18nStore.strings.columnVisibilityHiddenByGlobalSetting }}
            </span>
            <button
              class="column-visibility-toggle"
              @click="toggleColumn(column.id, !column.visible)"
              :title="column.visible ? i18nStore.strings.hideEmptyAttributesToggle : i18nStore.strings.showEmptyAttributesToggle"
            >
              <svg><use :xlink:href="column.visible ? '#iconEye' : '#iconEyeoff'"></use></svg>
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.database-column-settings {
  padding: 8px 0;
  max-height: 80vh;
  overflow-y: auto;
}

.database-selector {
  margin-bottom: 16px;
}

.show-orphaned-toggle-row {
  margin-bottom: 12px;
  display: flex;
  align-items: center;

  label {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
  }
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
