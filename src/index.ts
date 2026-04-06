/* eslint-disable vue/one-component-per-file */
import {
  Dialog,
  getAllEditor,
  getBackend,
  getFrontend,
  IEventBusMap,
  IProtyle,
  Model,
  Plugin,
} from "siyuan";
import * as Sentry from "@sentry/browser";
import "@/index.scss";
import { createApp, type App } from "vue";
import PluginPanel from "@/PluginPanel.vue";
import { SiyuanEvents } from "@/types/events";
import { getAttributeViewKeys } from "@/api";
import { AttributeView } from "./types/AttributeView";
import { LoggerService } from "./services/LoggerService";
import { AttributeViewService } from "./services/AttributeViewService";
import { getPadding } from "@/libs/siyuan/protyle/ui/initUI";
import { I18N } from "./types/i18n";
import { storageService } from "@/services/StorageService";
import { useLocalSettingStore } from "@/stores/localSettingStore";
import { pinia } from "@/stores";
import { useI18nStore } from "@/stores/i18nStore";
import {
  useConfigStore,
  createConfigFromStorage,
  type PluginConfigDTO,
} from "@/stores/configStore";
import { STORAGE_NAME } from "@/constants";
import PluginConfig from "@/components/PluginConfig.vue";

const PANEL_PARENT_CLASS = "plugin-database-properties-wrapper";
const PANEL_PARENT_CLASS_SELECTOR = "." + PANEL_PARENT_CLASS;

type TEventLoadedProtyle = CustomEvent<IEventBusMap[SiyuanEvents.LOADED_PROTYLE_STATIC]>;
type TEventSwitchProtyle = CustomEvent<IEventBusMap[SiyuanEvents.SWITCH_PROTYLE]>;

export default class DatabasePropertiesPanel extends Plugin {
  customTab: () => Model;
  private logger: LoggerService;
  private panelApps: Map<string, App> = new Map();

  /**
   * Used to disable error reporting on documents when the panel isn't rendered.
   */
  enableErrorReporting = true;

  boundProtyleLoadedListener = this.protyleLoadedListener.bind(this);
  boundProtyleSwitchListener = this.protyleSwitchListener.bind(this);

  async onload() {
    this.logger = new LoggerService("DatabasePropertiesPanel");
    this.data[STORAGE_NAME] = { readonlyText: "Readonly" };

    const i18nStore = useI18nStore(pinia);
    i18nStore.setStrings(this.i18n as I18N);

    if (process.env.NODE_ENV === "development") {
      this.addCommand({
        langKey: "Refresh",
        hotkey: "⇧⌘R",
        callback: () => window.location.reload(),
      });
    }
  }

  async onLayoutReady() {
    await this.loadPluginConfig();

    const configStore = useConfigStore(pinia);
    this.logger.debug(
      `Database Properties Panel Config:
- Version: ${process.env.PLUGIN_VERSION}
- Show DB: ${configStore.showDatabaseAttributes}
- Show Primary: ${configStore.showPrimaryKey}
- Sentry Enabled: ${!!process.env.SENTRY_DSN}
- Show Empty Attributes: ${configStore.showEmptyAttributes}`,
    );

    this.eventBus.on(SiyuanEvents.LOADED_PROTYLE_STATIC, this.boundProtyleLoadedListener);
    this.eventBus.on(SiyuanEvents.LOADED_PROTYLE_DYNAMIC, this.boundProtyleLoadedListener);
    this.eventBus.on(SiyuanEvents.SWITCH_PROTYLE, this.boundProtyleSwitchListener);

    // Listen for transactions to detect AV updates and trigger panel refresh
    this.eventBus.on(
      SiyuanEvents.WS_MAIN,
      (
        event: CustomEvent<{
          cmd?: string;
          data?: {
            doOperations?: {
              action?: string;
              rowID?: string;
              avID?: string;
              keyID?: string;
            }[];
          }[];
        }>,
      ) => {
        const data = event.detail;
        if (data?.cmd === "transactions" && data?.data) {
          // Check if any transaction contains an AV cell update
          for (const tx of data.data) {
            if (tx.doOperations) {
              for (const op of tx.doOperations) {
                if (op.action === "updateAttrViewCell" && op.rowID) {
                  this.logger.debug("AV cell updated, dispatching refresh for rowID:", op.rowID);
                  // Dispatch custom event that panels can listen to
                  window.dispatchEvent(
                    new CustomEvent("dpp-av-data-changed", {
                      detail: {
                        rowID: op.rowID,
                        avID: op.avID,
                        keyID: op.keyID,
                      },
                    }),
                  );
                }
              }
            }
          }
        }
      },
    );
  }

  private async loadPluginConfig() {
    const configStore = useConfigStore(pinia);
    try {
      configStore.setLoading(true);

      const storageConfigObject = (await this.loadData(STORAGE_NAME)) as PluginConfigDTO;

      let settings: PluginConfigDTO;
      if (
        storageConfigObject &&
        typeof storageConfigObject === "object" &&
        Object.keys(storageConfigObject).length > 0
      ) {
        settings = createConfigFromStorage(storageConfigObject);
      } else {
        settings = createConfigFromStorage({});
      }

      configStore.setFromConfigDTO(settings);
      configStore.setLoading(false);
      this.logger.debug("Plugin config initialized", settings);
    } catch (error) {
      this.logger.error("Failed to load settings:", error);
      configStore.setFromConfigDTO(createConfigFromStorage({}));
      configStore.setLoading(false);
    }
  }

  async onunload() {
    this.eventBus.off(SiyuanEvents.LOADED_PROTYLE_STATIC, this.boundProtyleLoadedListener);
    this.eventBus.off(SiyuanEvents.LOADED_PROTYLE_DYNAMIC, this.boundProtyleLoadedListener);
    this.eventBus.off(SiyuanEvents.SWITCH_PROTYLE, this.boundProtyleSwitchListener);

    this.panelApps.forEach((app) => app.unmount());
    this.panelApps.clear();

    AttributeViewService.cleanup();

    const allPanels = document.querySelectorAll(PANEL_PARENT_CLASS_SELECTOR);
    allPanels.forEach((panel) => panel.remove());
  }

  public openSetting(): void {
    let settingsApp: App | null = null;
    const dialog = new Dialog({
      title: this.t.settingTitle,
      content: `<div id="dppSettings" style="height: 100%;"></div>`,
      width: "800px",
      destroyCallback: () => {
        if (settingsApp) {
          try {
            settingsApp.unmount();
          } catch (error) {
            this.logger.debug("Failed to unmount settings:", error);
          }
        }
      },
    });
    settingsApp = createApp(PluginConfig, { plugin: this });
    settingsApp.use(pinia);
    settingsApp.mount(dialog.element.querySelector("#dppSettings"));
  }

  private protyleSwitchListener(event: TEventSwitchProtyle) {
    this.logger.addBreadcrumb(event.detail.protyle.block.id, "------ Protyle Switch -----");
    this.renderPanel(event.detail.protyle);
  }

  private protyleLoadedListener(event: TEventLoadedProtyle) {
    this.logger.addBreadcrumb(event.detail.protyle.block.id, "------ Protyle Loaded -----");
    this.renderPanel(event.detail.protyle);
  }

  private getProtyleTopNode(nodeId: string, protyleElement: HTMLElement) {
    const titleNode = protyleElement.querySelector(`div[data-node-id="${nodeId}"].protyle-title`);

    if (!titleNode) {
      this.logger.debug("No title node found, hide panel", { nodeId });
      return false;
    }

    const protyleAttrElement = titleNode.querySelector("div.protyle-attr");
    if (!protyleAttrElement || !protyleAttrElement.firstChild) {
      this.logger.debug("No protyle-attr element found, hide panel", {
        nodeId,
      });
      return false;
    }

    const titleInput = titleNode.querySelector(".protyle-title__input");
    if (titleInput && titleInput?.textContent) {
      LoggerService.registerDocumentId(nodeId, titleInput?.textContent);
    }

    const protyleTop = titleNode.closest(".protyle-top");
    if (!protyleTop) {
      this.logger.debug("No .protyle-top ancestor found, hide panel", {
        nodeId,
      });
    }
    return protyleTop;
  }

  private async renderPanel(openProtyle: IProtyle) {
    if (!openProtyle.block.rootID) {
      this.logger.debug("=> no rootID on protyle, skip rendering");
      return;
    }

    const blockId = openProtyle.block.rootID;
    const protyleId = openProtyle.id;
    const protyleElement = openProtyle.element;
    const configStore = useConfigStore(pinia);

    // Hide or show existing panels in this protyle based on whether they match the current block.
    // We hide instead of removing so panels survive search preview switches where SiYuan
    // doesn't fire protyle events when navigating back to a previously loaded result.
    const existingPanelsInProtyle = protyleElement.querySelectorAll(PANEL_PARENT_CLASS_SELECTOR);
    let hasMatchingPanel = false;
    existingPanelsInProtyle.forEach((panel) => {
      const panelBlockId = panel.getAttribute("data-block-id");
      if (panelBlockId === blockId) {
        (panel as HTMLElement).style.display = "";
        hasMatchingPanel = true;
      } else {
        (panel as HTMLElement).style.display = "none";
        this.logger.debug("🙈 Hiding stale panel in protyle", {
          panelBlockId,
          currentBlockId: blockId,
        });
      }
    });

    // If a matching panel already exists, no need to re-create it
    if (hasMatchingPanel) {
      this.logger.debug("=> existing panel found for blockId, reusing", { blockId });
      return;
    }

    // Now check if we should render a panel (needs DB properties)
    const topNode = this.getProtyleTopNode(blockId, protyleElement);
    if (!topNode) {
      this.enableErrorReporting = false;
      this.logger.debug("=> no top node, hide panel");
      return;
    }

    const editor = getAllEditor().find((editor) => editor.protyle.id === protyleId);
    if (!editor) {
      this.enableErrorReporting = false;
      this.logger.error("=> editor not found");
      return;
    }

    const localSettingStore = useLocalSettingStore(pinia);
    const settings = await storageService.fetchSettings(blockId);
    localSettingStore.setFromDTO(settings);

    let avData = [] as AttributeView[];
    let supportsEditing = false;

    if (typeof editor?.renderAVAttribute !== "undefined") {
      supportsEditing = true;
    }

    if (configStore.hideInSpacedRepetition) {
      const dialog = topNode.closest(".b3-dialog__container");
      if (dialog) {
        const isRiffCard = Array.from(
          dialog.querySelectorAll(".block__logo use, .block__logoicon use"),
        ).some(
          (use) => (use.getAttribute("xlink:href") || use.getAttribute("href")) === "#iconRiffCard",
        );
        if (isRiffCard) {
          this.logger.addBreadcrumb(blockId, "Hidden: inside spaced repetition dialog");
          return;
        }
      }
    }

    if (!configStore.showDatabaseAttributes) {
      this.enableErrorReporting = false;
      this.logger.debug("=> showDatabaseAttributes is false, hide panel");
      return;
    }

    try {
      avData = await getAttributeViewKeys(blockId);
    } catch (error) {
      this.logger.error("=> getAttributeViewKeys failed for blockId", blockId, error);
      return;
    }

    if (!avData || avData.length === 0) {
      this.enableErrorReporting = false;
      this.logger.debug("=> no database attributes found, hide panel", {
        blockId,
      });
      return;
    }

    avData.forEach((av) => {
      LoggerService.registerDocumentId(av.avID, av.avName);
    });

    // Remove all panels in this protyle (including hidden stale ones) before creating a new one
    const existingPanels = protyleElement.querySelectorAll(PANEL_PARENT_CLASS_SELECTOR);
    existingPanels.forEach((panel) => {
      this.logger.debug("🧼 Removing panel before re-render", {
        panelBlockId: panel.getAttribute("data-block-id"),
        blockId,
      });
      const panelProtyleId = panel.getAttribute("data-protyle-id");
      if (panelProtyleId && this.panelApps.has(panelProtyleId)) {
        this.panelApps.get(panelProtyleId)!.unmount();
        this.panelApps.delete(panelProtyleId);
      }
      panel.remove();
    });

    this.initErrorReporting(avData, supportsEditing);

    const tabDiv = document.createElement(`div`);
    tabDiv.className = PANEL_PARENT_CLASS;
    tabDiv.setAttribute("data-block-id", blockId);
    tabDiv.setAttribute("data-protyle-id", protyleId);
    tabDiv.setAttribute("data-testid", "database-properties-panel");
    const padding = getPadding(openProtyle);
    tabDiv.style.padding = `0 ${padding.right}px 0 ${padding.left}px`;

    this.logger.addBreadcrumb(blockId, "Rendering panel");

    const app = createApp(PluginPanel, {
      blockId,
      protyle: editor,
      allowEditing: supportsEditing,
      i18n: this.i18n as I18N,
      avData,
    });
    app.use(pinia);
    app.mount(tabDiv);
    this.panelApps.set(protyleId, app);

    topNode.after(tabDiv);
  }

  private get t(): I18N {
    return this.i18n as unknown as I18N;
  }

  private initErrorReporting(avData: AttributeView[], supportsEditing: boolean) {
    const configStore = useConfigStore(pinia);

    // Only enable Sentry if SENTRY_DSN was set at build time
    // This ensures only developer builds have error reporting
    if (process.env.SENTRY_DSN) {
      this.enableErrorReporting = true;
      Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV || "development",
        maxBreadcrumbs: 50,
        debug: false,
        release: process.env.PLUGIN_VERSION,
        ignoreErrors: [],
        beforeSend: (event) => {
          if (this.enableErrorReporting === false) {
            return null;
          }

          if (event.exception) {
            const exception = event.exception.values[0];

            event.extra = {
              ...event.extra,
              recentLogs: LoggerService.getLogs(),
            };

            if (exception.stacktrace) {
              const frames = exception.stacktrace.frames;
              if (frames) {
                const isPluginError = frames.some(
                  (frame) =>
                    frame.filename && frame.filename.includes("siyuan-database-properties-panel"),
                );

                if (!isPluginError) {
                  return null;
                }

                const firstFrame = frames[0];
                if (firstFrame && firstFrame.filename) {
                  const pluginsWithKnownIssues = ["plugin:custom-block", "quickRefactor"];

                  for (const plugin of pluginsWithKnownIssues) {
                    if (firstFrame.filename.includes(plugin)) {
                      this.logger.info("Silenced Error because of other plugins", event);
                      return null;
                    }
                  }
                }

                return event;
              }
            }
          }
          this.logger.info("Silenced Error", event.exception);

          return null;
        },
      });
      if (window.siyuan.user?.userId) {
        Sentry.setUser({
          id: window.siyuan.user.userId,
        });
      }

      Sentry.setContext("Config", {
        showDatabaseAttributes: configStore.showDatabaseAttributes,
        showPrimaryKey: configStore.showPrimaryKey,
        showEmptyAttributes: configStore.showEmptyAttributes,
      });

      Sentry.setContext("AttributeView", { avData });
      const frontend = getFrontend();
      const backend = getBackend();

      Sentry.setTag("kernelVersion", window.siyuan.config?.system?.kernelVersion);

      Sentry.setTag("supportsEditing", supportsEditing);

      Sentry.setContext("SiYuan", {
        frontend,
        backend,
      });
    }
  }

  uninstall() {
    this.logger.info("uninstall");
  }
}
