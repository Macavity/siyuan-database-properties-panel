import { Plugin, IEventBusMap, Model, getBackend, getFrontend } from "siyuan";
import * as Sentry from "@sentry/browser";
import "@/index.scss";

import PluginPanel from "@/PluginPanel.svelte";

import { SettingUtils } from "./libs/setting-utils";
import { SiyuanEvents } from "@/types/events";
import { getAttributeViewKeys } from "@/api";
import { AttributeView } from "./types/AttributeView";
import { Logger } from "./libs/logger";
import { IProtyle } from "siyuan";
import { getPadding } from "@/libs/siyuan/protyle/ui/initUI";
import { I18N } from "./types/i18n";
import { getAllEditor } from "siyuan";

const STORAGE_NAME = "menu-config";

const PANEL_PARENT_CLASS = "plugin-database-properties-wrapper";
const PANEL_PARENT_CLASS_SELECTOR = "." + PANEL_PARENT_CLASS;

type TEventLoadedProtyle = CustomEvent<IEventBusMap[SiyuanEvents.LOADED_PROTYLE_STATIC]>;
type TEventSwitchProtyle = CustomEvent<IEventBusMap[SiyuanEvents.SWITCH_PROTYLE]>;

enum DatabasePropertiesPanelConfig {
  ShowPrimaryKey = "showPrimaryKey",
  ShowDatabaseAttributes = "showDatabaseAttributes",
  AllowErrorReporting = "allowErrorReporting",
  ShowEmptyAttributes = "showEmptyAttributes",
  AllowEditing = "allowEditing",
}

export default class DatabasePropertiesPanel extends Plugin {
  customTab: () => Model;
  private settingUtils: SettingUtils;
  boundProtyleLoadedListener = this.protyleLoadedListener.bind(this);
  boundProtyleSwitchListener = this.protyleSwitchListener.bind(this);

  async onload() {
    this.data[STORAGE_NAME] = { readonlyText: "Readonly" };

    this.initSettings();
    this.initSlashCommand();
  }

  private changeCheckboxSetting(key: string): () => void {
    return () => {
      const value = !this.settingUtils.get(key);
      this.settingUtils.set(key, value);
    };
  }

  initSettings() {
    this.settingUtils = new SettingUtils({
      plugin: this,
      name: STORAGE_NAME,
    });

    this.settingUtils.addItem({
      key: DatabasePropertiesPanelConfig.ShowDatabaseAttributes,
      value: true,
      type: "checkbox",
      title: this.i18n.configShowDatabasePropertiesTitle,
      description: this.i18n.configShowDatabasePropertiesDesc,
      action: {
        callback: () => {
          this.changeCheckboxSetting(DatabasePropertiesPanelConfig.ShowDatabaseAttributes);
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
          this.changeCheckboxSetting(DatabasePropertiesPanelConfig.ShowPrimaryKey);
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
          this.changeCheckboxSetting(DatabasePropertiesPanelConfig.ShowEmptyAttributes);
        },
      },
    });

    this.settingUtils.addItem({
      key: DatabasePropertiesPanelConfig.AllowEditing,
      value: false,
      type: "checkbox",
      title: this.i18n.configAllowEditingTitle,
      description: this.i18n.configAllowEditingDesc,
      action: {
        callback: () => {
          this.changeCheckboxSetting(DatabasePropertiesPanelConfig.AllowEditing);
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
          this.changeCheckboxSetting(DatabasePropertiesPanelConfig.AllowErrorReporting);
        },
      },
    });

    try {
      this.settingUtils.load();
    } catch (error) {
      console.error("Error loading settings storage, probably empty config json:", error);
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
    Logger.debug(`frontend: ${getFrontend()}; backend: ${getBackend()}`);

    Logger.info(
      `Database Properties Panel Config:
- Version: ${process.env.PLUGIN_VERSION}
- Show DB: ${this.settingUtils.get(DatabasePropertiesPanelConfig.ShowDatabaseAttributes)}
- Show Primary: ${this.settingUtils.get(DatabasePropertiesPanelConfig.ShowPrimaryKey)}
- Allow Error Reporting: ${this.settingUtils.get(DatabasePropertiesPanelConfig.AllowErrorReporting)}
- Show Empty Attributes: ${this.settingUtils.get(DatabasePropertiesPanelConfig.ShowEmptyAttributes)}`
    );

    this.eventBus.on(SiyuanEvents.LOADED_PROTYLE_STATIC, this.boundProtyleLoadedListener);
    this.eventBus.on(SiyuanEvents.SWITCH_PROTYLE, this.boundProtyleSwitchListener);
  }

  async onunload() {
    this.eventBus.off(SiyuanEvents.LOADED_PROTYLE_STATIC, this.boundProtyleLoadedListener);
    this.eventBus.off(SiyuanEvents.SWITCH_PROTYLE, this.boundProtyleSwitchListener);
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
    const titleNode = document.querySelector(`div[data-node-id="${nodeId}"].protyle-title`);

    if (!titleNode) {
      Logger.debug("No title node found", { nodeId });
      return false;
    }

    const protyleAttrElement = titleNode.querySelector("div.protyle-attr");
    if (!protyleAttrElement || !protyleAttrElement.firstChild) {
      Logger.debug("No protyle-attr element found", { nodeId });
      return false;
    }

    const topNode = titleNode.closest(".protyle-top");

    return topNode;
  }

  private async renderPanel(openProtyle: IProtyle) {
    if (!openProtyle.block.rootID) {
      return;
    }

    const blockId = openProtyle.block.rootID;
    const showDatabaseAttributes = this.settingUtils.get<boolean>(
      DatabasePropertiesPanelConfig.ShowDatabaseAttributes
    );

    // Logger.debug({ openProtyle });

    const topNode = this.getProtyleTopNode(blockId);
    if (!topNode) {
      Logger.debug("=> database panel hidden");
      return;
    }

    const editor = getAllEditor().find((editor) => editor.protyle.id === openProtyle.id);
    if (!editor) {
      Logger.error("=> editor not found");
      return;
    }

    let avData = [] as AttributeView[];
    let allowEditing = false;

    if (typeof editor?.renderAVAttribute !== "undefined") {
      allowEditing = this.settingUtils.get<boolean>(DatabasePropertiesPanelConfig.AllowEditing);
    }

    if (showDatabaseAttributes) {
      avData = await getAttributeViewKeys(blockId);
    }

    const panelWrapper = document.querySelector(PANEL_PARENT_CLASS_SELECTOR);
    if (panelWrapper) {
      panelWrapper.remove();
    }

    this.initErrorReporting(avData);

    const tabDiv = document.createElement(`div`);
    tabDiv.className = PANEL_PARENT_CLASS;
    const padding = getPadding(openProtyle);
    tabDiv.style.padding = `0 ${padding.right}px 0 ${padding.left}px`;

    new PluginPanel({
      target: tabDiv,
      props: {
        blockId,
        protyle: editor,
        showPrimaryKey: this.settingUtils.get<boolean>(
          DatabasePropertiesPanelConfig.ShowPrimaryKey
        ),
        showEmptyAttributes: this.settingUtils.get<boolean>(
          DatabasePropertiesPanelConfig.ShowEmptyAttributes
        ),
        allowEditing,
        i18n: this.i18n as I18N,
        avData,
      },
    });

    topNode.after(tabDiv);
  }

  private initErrorReporting(avData: AttributeView[]) {
    const allowErrorReporting = this.settingUtils.get<boolean>(
      DatabasePropertiesPanelConfig.AllowErrorReporting
    );

    if (allowErrorReporting && process.env.SENTRY_DSN) {
      Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV || "development",
        maxBreadcrumbs: 50,
        debug: false,
        release: process.env.PLUGIN_VERSION,
        beforeSend(event) {
          if (event.exception) {
            const exception = event.exception.values[0];
            if (exception.stacktrace) {
              const frames = exception.stacktrace.frames;
              if (frames) {
                const isPluginError = frames.some(
                  (frame) =>
                    frame.filename && frame.filename.includes("siyuan-database-properties-panel")
                );

                if (!isPluginError) {
                  return null;
                }
              }
            }
          }
          return event;
        },
      });
      if (window.siyuan.user?.userId) {
        Sentry.setUser({
          id: window.siyuan.user.userId,
        });
      }

      Sentry.setContext("Config", {
        showDatabaseAttributes: this.settingUtils.get(
          DatabasePropertiesPanelConfig.ShowDatabaseAttributes
        ),
        showPrimaryKey: this.settingUtils.get(DatabasePropertiesPanelConfig.ShowPrimaryKey),
        showEmptyAttributes: this.settingUtils.get(
          DatabasePropertiesPanelConfig.ShowEmptyAttributes
        ),
      });

      Sentry.setContext("AttributeView", avData);

      const frontend = getFrontend();
      const backend = getBackend();

      Sentry.setContext("SiYuan", {
        frontend,
        backend,
        kernelVersion: window.siyuan.config?.system?.kernelVersion,
      });
    }
  }

  uninstall() {
    Logger.log("uninstall");
  }
}
