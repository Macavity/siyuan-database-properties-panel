import {
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
import PluginPanel from "@/PluginPanel.svelte";
import { SettingUtils } from "./libs/setting-utils";
import { SiyuanEvents } from "@/types/events";
import { getAttributeViewKeys } from "@/api";
import { AttributeView } from "./types/AttributeView";
import { LoggerService } from "./services/LoggerService";
import { getPadding } from "@/libs/siyuan/protyle/ui/initUI";
import { I18N } from "./types/i18n";
import { storageService } from "@/services/StorageService";
import { settingsStore } from "@/stores/localSettingStore";
import { mount } from "svelte";
import { i18nStore } from "@/stores/i18nStore";
import { configStore } from "@/stores/configStore";

const STORAGE_NAME = "menu-config";

const PANEL_PARENT_CLASS = "plugin-database-properties-wrapper";
const PANEL_PARENT_CLASS_SELECTOR = "." + PANEL_PARENT_CLASS;

type TEventLoadedProtyle = CustomEvent<
  IEventBusMap[SiyuanEvents.LOADED_PROTYLE_STATIC]
>;
type TEventSwitchProtyle = CustomEvent<
  IEventBusMap[SiyuanEvents.SWITCH_PROTYLE]
>;

enum DatabasePropertiesPanelConfig {
  ShowPrimaryKey = "showPrimaryKey",
  ShowDatabaseAttributes = "showDatabaseAttributes",
  AllowErrorReporting = "allowErrorReporting",
  ShowEmptyAttributes = "showEmptyAttributes",
}

export default class DatabasePropertiesPanel extends Plugin {
  customTab: () => Model;
  private settingUtils: SettingUtils;
  private logger: LoggerService;

  /**
   * Used to disable error reporting on documents when the panel isn't rendered.
   */
  enableErrorReporting = true;

  boundProtyleLoadedListener = this.protyleLoadedListener.bind(this);
  boundProtyleSwitchListener = this.protyleSwitchListener.bind(this);

  async onload() {
    this.logger = new LoggerService("DatabasePropertiesPanel");
    this.data[STORAGE_NAME] = { readonlyText: "Readonly" };

    i18nStore.set(this.i18n as I18N);
    this.initSettings();
    this.updateStoreFromSettingUtils();
    this.initSlashCommand();

    if (process.env.NODE_ENV === "development") {
      //   this.addTopBar({
      //     icon: "iconRefresh",
      //     title: "Refresh",
      //     position: "right",
      //     callback: () => window.location.reload(),
      //   });
      this.addCommand({
        langKey: "Refresh",
        hotkey: "⇧⌘R",
        callback: () => window.location.reload(),
      });
    }
  }

  private updateStoreFromSettingUtils() {
    configStore.set({
      showPrimaryKey: this.settingUtils.get(
        DatabasePropertiesPanelConfig.ShowPrimaryKey,
      ),
      showEmptyAttributes: this.settingUtils.get(
        DatabasePropertiesPanelConfig.ShowEmptyAttributes,
      ),
      showDatabaseAttributes: this.settingUtils.get(
        DatabasePropertiesPanelConfig.ShowDatabaseAttributes,
      ),
      allowErrorReporting: this.settingUtils.get(
        DatabasePropertiesPanelConfig.AllowErrorReporting,
      ),
    });
  }

  private changeCheckboxSetting(key: string): () => void {
    return () => {
      const value = !this.settingUtils.get(key);
      this.settingUtils.set(key, value);

      this.updateStoreFromSettingUtils();
    };
  }

  initSettings() {
    this.settingUtils = new SettingUtils({
      plugin: this,
      name: STORAGE_NAME,
      callback: this.updateStoreFromSettingUtils.bind(this),
    });

    this.settingUtils.addItem({
      key: DatabasePropertiesPanelConfig.ShowDatabaseAttributes,
      value: true,
      type: "checkbox",
      title: this.i18n.configShowDatabasePropertiesTitle,
      description: this.i18n.configShowDatabasePropertiesDesc,
      action: {
        callback: () => {
          this.changeCheckboxSetting(
            DatabasePropertiesPanelConfig.ShowDatabaseAttributes,
          );
        },
      },
    });

    this.settingUtils.addItem({
      key: DatabasePropertiesPanelConfig.ShowPrimaryKey,
      value: false,
      type: "checkbox",
      title: this.i18n.configShowPrimaryKeyTitle,
      description: this.i18n.configShowPrimaryKeyDesc,
      action: {
        callback: () => {
          this.changeCheckboxSetting(
            DatabasePropertiesPanelConfig.ShowPrimaryKey,
          );
        },
      },
    });

    this.settingUtils.addItem({
      key: DatabasePropertiesPanelConfig.ShowEmptyAttributes,
      value: false,
      type: "checkbox",
      title: this.i18n.configShowEmptyPropertiesTitle,
      description: this.i18n.configShowEmptyPropertiesDesc,
      action: {
        callback: () => {
          this.changeCheckboxSetting(
            DatabasePropertiesPanelConfig.ShowEmptyAttributes,
          );
        },
      },
    });

    this.settingUtils.addItem({
      key: DatabasePropertiesPanelConfig.AllowErrorReporting,
      value: false,
      type: "checkbox",
      title: this.i18n.configAllowErrorReportingTitle,
      description: this.i18n.configAllowErrorReportingDesc,
      action: {
        callback: () => {
          this.changeCheckboxSetting(
            DatabasePropertiesPanelConfig.AllowErrorReporting,
          );
        },
      },
    });

    try {
      this.settingUtils.load();
    } catch (error) {
      console.error(
        "Error loading settings storage, probably empty config json:",
        error,
      );
    }
  }

  initSlashCommand() {
    /**
     * TODO Add Widget which adds panel manually if it is globally disabled.
     */
    // this.protyleSlash = [{
    //     filter: ["insert emoji 😊", "插入表情 😊", "crbqwx"],
    //     html: `<div class="b3-list-item__first"><span class="b3-list-item__text">${this.i18n.insertEmoji}</span><span class="b3-list-item__meta">😊</span></div>`,
    //     id: "insertEmoji",
    //     callback(protyle: Protyle) {
    //         protyle.insert("😊");
    //     }
    // }];
    //
    // this.protyleOptions = {
    //     toolbar: ["block-ref",
    //         "a",
    //         "|",
    //         "text",
    //         "strong",
    //         "em",
    //         "u",
    //         "s",
    //         "mark",
    //         "sup",
    //         "sub",
    //         "clear",
    //         "|",
    //         "code",
    //         "kbd",
    //         "tag",
    //         "inline-math",
    //         "inline-memo",
    //         "|",
    //         {
    //             name: "insert-smail-emoji",
    //             icon: "iconEmoji",
    //             hotkey: "⇧⌘I",
    //             tipPosition: "n",
    //             tip: this.i18n.insertEmoji,
    //             click(protyle: Protyle) {
    //                 protyle.insert("😊");
    //             }
    //         }],
    // };
  }

  async onLayoutReady() {
    await this.loadData(STORAGE_NAME);
    await this.settingUtils.load();
    // Logger.debug(`frontend: ${getFrontend()}; backend: ${getBackend()}`);

    this.logger.debug(
      `Database Properties Panel Config:
- Version: ${process.env.PLUGIN_VERSION}
- Show DB: ${this.settingUtils.get(DatabasePropertiesPanelConfig.ShowDatabaseAttributes)}
- Show Primary: ${this.settingUtils.get(DatabasePropertiesPanelConfig.ShowPrimaryKey)}
- Allow Error Reporting: ${this.settingUtils.get(DatabasePropertiesPanelConfig.AllowErrorReporting)}
- Show Empty Attributes: ${this.settingUtils.get(DatabasePropertiesPanelConfig.ShowEmptyAttributes)}`,
    );

    this.eventBus.on(
      SiyuanEvents.LOADED_PROTYLE_STATIC,
      this.boundProtyleLoadedListener,
    );
    this.eventBus.on(
      SiyuanEvents.SWITCH_PROTYLE,
      this.boundProtyleSwitchListener,
    );
  }

  async onunload() {
    this.eventBus.off(
      SiyuanEvents.LOADED_PROTYLE_STATIC,
      this.boundProtyleLoadedListener,
    );
    this.eventBus.off(
      SiyuanEvents.SWITCH_PROTYLE,
      this.boundProtyleSwitchListener,
    );
    document.querySelector(PANEL_PARENT_CLASS_SELECTOR)?.remove();
  }

  private protyleSwitchListener(event: TEventSwitchProtyle) {
    // Logger.debug("plugin switch protyle");
    this.renderPanel(event.detail.protyle);
  }

  private protyleLoadedListener(event: TEventLoadedProtyle) {
    // Logger.debug("plugin loaded protyle");

    this.renderPanel(event.detail.protyle);
  }

  private getProtyleTopNode(nodeId) {
    const titleNode = document.querySelector(
      `div[data-node-id="${nodeId}"].protyle-title`,
    );

    if (!titleNode) {
      this.logger.debug("No title node found", { nodeId });
      return false;
    }

    const protyleAttrElement = titleNode.querySelector("div.protyle-attr");
    if (!protyleAttrElement || !protyleAttrElement.firstChild) {
      this.logger.debug("No protyle-attr element found", { nodeId });
      return false;
    }

    const titleInput = titleNode.querySelector(".protyle-title__input");
    if (titleInput && titleInput?.textContent) {
      LoggerService.registerDocumentId(nodeId, titleInput?.textContent);
    }

    return titleNode.closest(".protyle-top");
  }

  private async renderPanel(openProtyle: IProtyle) {
    if (!openProtyle.block.rootID) {
      return;
    }

    const blockId = openProtyle.block.rootID;

    const showDatabaseAttributes = this.settingUtils.get<boolean>(
      DatabasePropertiesPanelConfig.ShowDatabaseAttributes,
    );

    // Logger.debug({ openProtyle });

    const topNode = this.getProtyleTopNode(blockId);
    if (!topNode) {
      this.enableErrorReporting = false;
      this.logger.debug("=> database panel hidden");
      return;
    }

    const editor = getAllEditor().find(
      (editor) => editor.protyle.id === openProtyle.id,
    );
    if (!editor) {
      this.enableErrorReporting = false;
      this.logger.error("=> editor not found");
      return;
    }

    const settings = await storageService.fetchSettings(blockId);
    settingsStore.setFromDTO(settings);
    this.updateStoreFromSettingUtils();

    let avData = [] as AttributeView[];
    let supportsEditing = false;

    if (typeof editor?.renderAVAttribute !== "undefined") {
      supportsEditing = true;
    }

    if (!showDatabaseAttributes) {
      this.enableErrorReporting = false;
      return;
    }

    avData = await getAttributeViewKeys(blockId);

    avData.forEach((av) => {
      LoggerService.registerDocumentId(av.avID, av.avName);
    });

    const panelWrapper = document.querySelector(PANEL_PARENT_CLASS_SELECTOR);
    if (panelWrapper) {
      panelWrapper.remove();
    }

    this.initErrorReporting(avData, supportsEditing);

    const tabDiv = document.createElement(`div`);
    tabDiv.className = PANEL_PARENT_CLASS;
    const padding = getPadding(openProtyle);
    tabDiv.style.padding = `0 ${padding.right}px 0 ${padding.left}px`;

    mount(PluginPanel, {
      target: tabDiv,
      props: {
        blockId,
        protyle: editor,
        allowEditing: supportsEditing,
        i18n: this.i18n as I18N,
        avData,
      },
    });

    topNode.after(tabDiv);
  }

  private initErrorReporting(
    avData: AttributeView[],
    supportsEditing: boolean,
  ) {
    const allowErrorReporting = this.settingUtils.get<boolean>(
      DatabasePropertiesPanelConfig.AllowErrorReporting,
    );

    if (allowErrorReporting && process.env.SENTRY_DSN) {
      this.enableErrorReporting = true;
      Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV || "development",
        maxBreadcrumbs: 50,
        debug: false,
        release: process.env.PLUGIN_VERSION,
        ignoreErrors: [],
        beforeSend(event) {
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
                    frame.filename &&
                    frame.filename.includes("siyuan-database-properties-panel"),
                );

                if (!isPluginError) {
                  return null;
                }

                const firstFrame = frames[0];
                if (firstFrame && firstFrame.filename) {
                  const pluginsWithKnownIssues = [
                    "plugin:custom-block",
                    "quickRefactor",
                  ];

                  for (const plugin of pluginsWithKnownIssues) {
                    if (firstFrame.filename.includes(plugin)) {
                      this.logger.info(
                        "Silenced Error because of other plugins",
                        event,
                      );
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
        showDatabaseAttributes: this.settingUtils.get(
          DatabasePropertiesPanelConfig.ShowDatabaseAttributes,
        ),
        showPrimaryKey: this.settingUtils.get(
          DatabasePropertiesPanelConfig.ShowPrimaryKey,
        ),
        showEmptyAttributes: this.settingUtils.get(
          DatabasePropertiesPanelConfig.ShowEmptyAttributes,
        ),
      });

      Sentry.setContext("AttributeView", { avData });
      const frontend = getFrontend();
      const backend = getBackend();

      Sentry.setTag(
        "kernelVersion",
        window.siyuan.config?.system?.kernelVersion,
      );

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
