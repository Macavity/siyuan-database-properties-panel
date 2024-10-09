import {
    Plugin,
    getFrontend,
    getBackend,
    IModel,
    IEventBusMap
} from "siyuan";
import "@/index.scss";

import PluginPanel from "@/plugin-panel.svelte";

import { SettingUtils } from "./libs/setting-utils";
import { SiyuanEvents } from "@/types/events";

const STORAGE_NAME = "menu-config";

const PANEL_PARENT_CLASS = "plugin-database-properties-wrapper"
const PANEL_PARENT_CLASS_SELECTOR = "."+PANEL_PARENT_CLASS;

type TEventLoadedProtyle = CustomEvent<IEventBusMap['loaded-protyle-static']>;

enum DatabasePropertiesPanelConfig {
    ShowPrimaryKey = "showPrimaryKey",
    ShowDatabaseAttributes = "showDatabaseAttributes",
}

export default class DatabasePropertiesPanel extends Plugin {

    customTab: () => IModel;
    private settingUtils: SettingUtils;
    boundProtyleLoadedListener = this.protyleLoadedListener.bind(this);

    async onload() {
        this.data[STORAGE_NAME] = { readonlyText: "Readonly" };
        console.log("onload");

        // const frontEnd = getFrontend();
        // this.isMobile = frontEnd === "mobile" || frontEnd === "browser-mobile";

        this.initSettings()
        this.initSlashCommand()
    }

    initSettings(){
        this.settingUtils = new SettingUtils({
            plugin: this, name: STORAGE_NAME
        });

        this.settingUtils.addItem({
            key: DatabasePropertiesPanelConfig.ShowPrimaryKey,
            value: false,
            type: "checkbox",
            title: this.i18n.configShowPrimaryKeyTitle,
            description: this.i18n.configShowPrimaryKeyDesc,
            action: {
                callback: () => {
                    // Return data and save it in real time
                    const value = !this.settingUtils.get(DatabasePropertiesPanelConfig.ShowPrimaryKey);
                    this.settingUtils.set(DatabasePropertiesPanelConfig.ShowPrimaryKey, value);
                }
            }
        });

        this.settingUtils.addItem({
            key: DatabasePropertiesPanelConfig.ShowDatabaseAttributes,
            value: true,
            type: "checkbox",
            title: this.i18n.configShowDatabasePropertiesTitle,
            description: this.i18n.configShowDatabasePropertiesDesc,
            action: {
                callback: () => {
                    // Return data and save it in real time
                    const value = !this.settingUtils.get(DatabasePropertiesPanelConfig.ShowDatabaseAttributes);
                    this.settingUtils.set(DatabasePropertiesPanelConfig.ShowDatabaseAttributes, value);
                }
            }
        });

        try {
            this.settingUtils.load();
        } catch (error) {
            console.error("Error loading settings storage, probably empty config json:", error);
        }
    }

    initSlashCommand(){
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
        console.log("onLayoutReady");
        await this.loadData(STORAGE_NAME);
        await this.settingUtils.load();
        console.log(`frontend: ${getFrontend()}; backend: ${getBackend()}`);

        console.log(
            `Database Properties Panel Config:
- Show Primary: ${this.settingUtils.get(DatabasePropertiesPanelConfig.ShowPrimaryKey)}
- Show DB: ${this.settingUtils.get(DatabasePropertiesPanelConfig.ShowDatabaseAttributes)}`
        );

        this.eventBus.on(SiyuanEvents.LOADED_PROTYLE_STATIC, this.boundProtyleLoadedListener);
    }

    async onunload() {
        console.log("onunload");
        this.eventBus.off(SiyuanEvents.LOADED_PROTYLE_STATIC, this.boundProtyleLoadedListener);
        document.querySelector(PANEL_PARENT_CLASS_SELECTOR)?.remove();
    }

    private protyleLoadedListener(event: TEventLoadedProtyle) {
        const openProtyle = event.detail.protyle;

        if(!openProtyle.block.id){
            return;
        }
        const blockId = openProtyle.block.id;
        console.log({ openProtyle })

        const parentNode = document.querySelector(
            `div[data-node-id="${blockId}"].protyle-title`
        );

        if(!parentNode){
            console.log('No parent node found');
            return;
        }

        const protyleAttrElement = parentNode.querySelector("div.protyle-attr");
        const panelWrapper = parentNode.querySelector(PANEL_PARENT_CLASS_SELECTOR);

        if(!protyleAttrElement || !protyleAttrElement.firstChild){
            console.log("No protyle-attr element found -> database panel hidden");
            return;
        }

        if(panelWrapper){
            // panel is already present.
            console.log('panel already present');
            return;
        }

        const tabDiv = document.createElement(`div`);
        tabDiv.className = PANEL_PARENT_CLASS;
        new PluginPanel({
            target: tabDiv,
            props: {
                showDatabaseAttributes: this.settingUtils.get<boolean>(DatabasePropertiesPanelConfig.ShowDatabaseAttributes),
                showPrimaryKey: this.settingUtils.get<boolean>(DatabasePropertiesPanelConfig.ShowPrimaryKey),
                // showBuiltInAttributes: this.settingUtils.get(DatabasePropertiesPanelConfig.ShowBuiltInAttributes),
                i18n: this.i18n,
                blockId,
            }
        });
        protyleAttrElement.after(tabDiv);
    }

    uninstall() {
        console.log("uninstall");
    }
}
