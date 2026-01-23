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
import {get} from "svelte/store";
import * as Sentry from "@sentry/browser";
import "@/index.scss";
import PluginPanel from "@/PluginPanel.svelte";
import {SiyuanEvents} from "@/types/events";
import {getAttributeViewKeys} from "@/api";
import {AttributeView} from "./types/AttributeView";
import {LoggerService} from "./services/LoggerService";
import {getPadding} from "@/libs/siyuan/protyle/ui/initUI";
import {I18N} from "./types/i18n";
import {storageService} from "@/services/StorageService";
import {settingsStore} from "@/stores/localSettingStore";
import {mount, unmount} from "svelte";
import {i18nStore} from "@/stores/i18nStore";
import {configStore, createConfigFromStorage, isErrorReportingAllowed, PluginConfigDTO} from "@/stores/configStore";
import {STORAGE_NAME} from "@/constants";
import PluginConfig from "@/components/PluginConfig.svelte";

const PANEL_PARENT_CLASS = "plugin-database-properties-wrapper";
const PANEL_PARENT_CLASS_SELECTOR = "." + PANEL_PARENT_CLASS;

type TEventLoadedProtyle = CustomEvent<
    IEventBusMap[SiyuanEvents.LOADED_PROTYLE_STATIC]
>;
type TEventSwitchProtyle = CustomEvent<
    IEventBusMap[SiyuanEvents.SWITCH_PROTYLE]
>;

export default class DatabasePropertiesPanel extends Plugin {
    customTab: () => Model;
    private logger: LoggerService;

    /**
     * Used to disable error reporting on documents when the panel isn't rendered.
     */
    enableErrorReporting = true;

    boundProtyleLoadedListener = this.protyleLoadedListener.bind(this);
    boundProtyleSwitchListener = this.protyleSwitchListener.bind(this);

    async onload() {
        this.logger = new LoggerService("DatabasePropertiesPanel");
        this.data[STORAGE_NAME] = {readonlyText: "Readonly"};

        i18nStore.set(this.i18n as I18N);

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

        const config = get(configStore);
        this.logger.debug(
            `Database Properties Panel Config:
- Version: ${process.env.PLUGIN_VERSION}
- Show DB: ${config.showDatabaseAttributes}
- Show Primary: ${config.showPrimaryKey}
- Allow Error Reporting: ${config.allowErrorReporting}
- Show Empty Attributes: ${config.showEmptyAttributes}`
        );

        this.eventBus.on(
            SiyuanEvents.LOADED_PROTYLE_STATIC,
            this.boundProtyleLoadedListener
        );
        this.eventBus.on(
            SiyuanEvents.SWITCH_PROTYLE,
            this.boundProtyleSwitchListener
        );

        // Listen for transactions to detect AV updates and trigger panel refresh
        this.eventBus.on(SiyuanEvents.WS_MAIN, (event: CustomEvent<{
            cmd?: string;
            data?: { doOperations?: { action?: string; rowID?: string; avID?: string; keyID?: string }[] }[]
        }>) => {
            const data = event.detail;
            if (data?.cmd === "transactions" && data?.data) {
                // Check if any transaction contains an AV cell update
                for (const tx of data.data) {
                    if (tx.doOperations) {
                        for (const op of tx.doOperations) {
                            if (op.action === "updateAttrViewCell" && op.rowID) {
                                this.logger.debug("AV cell updated, dispatching refresh for rowID:", op.rowID);
                                // Dispatch custom event that panels can listen to
                                window.dispatchEvent(new CustomEvent("dpp-av-data-changed", {
                                    detail: {rowID: op.rowID, avID: op.avID, keyID: op.keyID}
                                }));
                            }
                        }
                    }
                }
            }
        });
        return;
    }

    private async loadPluginConfig() {
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

            // Override allowErrorReporting based on localStorage or dev mode
            settings.allowErrorReporting = isErrorReportingAllowed();

            configStore.setFromConfigDTO(settings);
            configStore.setLoading(false);
            this.logger.debug("Plugin config initialized", settings);
        } catch (error) {
            this.logger.error("Failed to load settings:", error);
            configStore.setFromConfigDTO({
                ...createConfigFromStorage({}),
                allowErrorReporting: isErrorReportingAllowed(),
            });
            configStore.setLoading(false);
        }
    }

    async onunload() {
        this.eventBus.off(
            SiyuanEvents.LOADED_PROTYLE_STATIC,
            this.boundProtyleLoadedListener
        );
        this.eventBus.off(
            SiyuanEvents.SWITCH_PROTYLE,
            this.boundProtyleSwitchListener
        );

        const allPanels = document.querySelectorAll(PANEL_PARENT_CLASS_SELECTOR);
        allPanels.forEach((panel) => panel.remove());
    }

    public openSetting(): void {
        let settingsComponent: ReturnType<typeof mount> | null = null;
        const dialog = new Dialog({
            title: this.t.settingTitle,
            content: `<div id="dppSettings" style="height: 100%;"></div>`,
            width: "800px",
            destroyCallback: () => {
                if (settingsComponent) {
                    try {
                        unmount(settingsComponent);
                    } catch (error) {
                        this.logger.debug("Failed to unmount settings:", error);
                    }
                }
            },
        });
        settingsComponent = mount(PluginConfig, {
            target: dialog.element.querySelector("#dppSettings"),
            props: {
                plugin: this,
            },
        });
    }

    private protyleSwitchListener(event: TEventSwitchProtyle) {
        this.renderPanel(event.detail.protyle);
    }

    private protyleLoadedListener(event: TEventLoadedProtyle) {
        this.renderPanel(event.detail.protyle);
    }

    private getProtyleTopNode(nodeId) {
        const titleNode = document.querySelector(
            `div[data-node-id="${nodeId}"].protyle-title`
        );

        if (!titleNode) {
            this.logger.debug("No title node found, hide panel", {nodeId});
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

        return titleNode.closest(".protyle-top");
    }

    private async renderPanel(openProtyle: IProtyle) {
        if (!openProtyle.block.rootID) {
            return;
        }

        const blockId = openProtyle.block.rootID;
        const config = get(configStore);

        const topNode = this.getProtyleTopNode(blockId);
        if (!topNode) {
            this.enableErrorReporting = false;
            this.logger.debug("=> no top node, hide panel");
            return;
        }

        const editor = getAllEditor().find(
            (editor) => editor.protyle.id === openProtyle.id
        );
        if (!editor) {
            this.enableErrorReporting = false;
            this.logger.error("=> editor not found");
            return;
        }

        const settings = await storageService.fetchSettings(blockId);
        settingsStore.setFromDTO(settings);

        let avData = [] as AttributeView[];
        let supportsEditing = false;

        if (typeof editor?.renderAVAttribute !== "undefined") {
            supportsEditing = true;
        }

        if (!config.showDatabaseAttributes) {
            this.enableErrorReporting = false;
            this.logger.debug("=> showDatabaseAttributes is false, hide panel");
            return;
        }

        avData = await getAttributeViewKeys(blockId);

        avData.forEach((av) => {
            LoggerService.registerDocumentId(av.avID, av.avName);
        });

        if (avData.length === 0) {
            this.enableErrorReporting = false;
            this.logger.debug("=> no database attributes found, hide panel");
            return;
        }

        // Only remove panels that match the current blockId
        const existingPanels = document.querySelectorAll(
            PANEL_PARENT_CLASS_SELECTOR
        );
        existingPanels.forEach((panel) => {
            if (panel.getAttribute("data-block-id") === blockId) {
                this.logger.debug("renderPanel remove previous panel for blockId", {
                    blockId,
                });
                panel.remove();
            }
        });

        this.initErrorReporting(avData, supportsEditing);

        const tabDiv = document.createElement(`div`);
        tabDiv.className = PANEL_PARENT_CLASS;
        tabDiv.setAttribute("data-block-id", blockId);
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

    private get t(): I18N {
        return this.i18n as unknown as I18N;
    }

    private initErrorReporting(
        avData: AttributeView[],
        supportsEditing: boolean
    ) {
        const config = get(configStore);

        if (config.allowErrorReporting && process.env.SENTRY_DSN) {
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
                                        frame.filename &&
                                        frame.filename.includes("siyuan-database-properties-panel")
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
                                                event
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
                showDatabaseAttributes: config.showDatabaseAttributes,
                showPrimaryKey: config.showPrimaryKey,
                showEmptyAttributes: config.showEmptyAttributes,
            });

            Sentry.setContext("AttributeView", {avData});
            const frontend = getFrontend();
            const backend = getBackend();

            Sentry.setTag(
                "kernelVersion",
                window.siyuan.config?.system?.kernelVersion
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
