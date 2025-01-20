<script lang="ts">
    import Icon from "@/components/ui/Icon.svelte";
    import type {SiYuanIcon} from "@/types/SiyuanIcon";
    import {createEventDispatcher, onMount} from "svelte";

    export let tabs: {
        key: string;
        name: string;
        dataType?: string;
        icon?: SiYuanIcon;
        focus?: boolean;
    }[];
    export let focus: string;
    const dispatch = createEventDispatcher();

    onMount(() => {
        console.log("LayoutTabBar", tabs);
    });

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
                 on:click={() => activateTab(tab.key)}
                 on:keydown={() => activateTab(tab.key)}
                 tabindex={index}
            >
                <span class="fn__flex-1"></span>
                {#if tab.icon}
                    <Icon icon={tab.icon}/>
                {/if}

                <span class="item__text">
                    {tab.name}
                </span>

                <span class="fn__flex-1"></span>
            </div>
        {/each}
    </div>
</div>
