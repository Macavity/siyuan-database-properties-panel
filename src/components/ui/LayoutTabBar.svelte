<script lang="ts">
    import Icon from "@/components/ui/Icon.svelte";
    import type {SiYuanIcon} from "@/types/SiyuanIcon";
    import {createEventDispatcher} from "svelte";

    interface Tab {
        key: string;
        name: string;
        dataType?: string;
        icon?: SiYuanIcon;
        focus?: boolean;
    }

    interface Props {
        tabs: Tab[];
        focus: string;
    }

    let { tabs, focus }: Props = $props();
    const dispatch = createEventDispatcher();

    function activateTab(key: string) {
        dispatch("click", { key });
    }
</script>

<div class="fn__flex-column">
    <div class="layout-tab-bar fn__flex">
        {#each tabs as tab, index (tab.key)}
            <div class="item item--full"
                 class:item--focus={tab.key === focus}
                 data-type={tab.dataType}
                 role="button"
                 onclick={() => activateTab(tab.key)}
                 onkeydown={() => activateTab(tab.key)}
                 tabindex={index}
            >
                <span class="fn__flex-1"></span>
                {#if tab.icon}
                    <Icon class="block__logoicon" icon={tab.icon}/>
                {/if}

                <span class="item__text">
                    {tab.name}
                </span>

                <span class="fn__flex-1"></span>
            </div>
        {/each}
    </div>
</div>
