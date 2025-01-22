<script lang="ts">
    import { type IAVCellValue } from "@/types/siyuan.types";
    import dayjs from "dayjs";

    interface Props {
        value: IAVCellValue;
    }

    let { value }: Props = $props();

    const content = dayjs(value[value.type].content).format(value[value.type].isNotTime ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm");
</script>

<span class="av__celltext" data-value="{JSON.stringify(value[value.type])}">
    {#if value[value.type]}
        {#if value[value.type].isNotEmpty}
            {content}
            {#if value[value.type].hasEndDate && value[value.type].isNotEmpty2}
                <svg class="av__cellicon"><use xlink:href="#iconForward"></use></svg>
                {dayjs(value[value.type].content2).format(value[value.type].isNotTime ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm")}
            {/if}
        {/if}

    {/if}
</span>