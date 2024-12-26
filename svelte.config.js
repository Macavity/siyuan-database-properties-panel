/*
 * Copyright (c) 2024 by frostime. All Rights Reserved.
 * @Author       : frostime
 * @Date         : 2023-05-19 19:49:13
 * @FilePath     : /svelte.config.js
 * @LastEditTime : 2024-04-19 19:01:55
 * @Description  : 
 */
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"

const NoWarns = new Set([
    "a11y-click-events-have-key-events",
    "a11y-no-static-element-interactions",
    "a11y-no-noninteractive-element-interactions"
]);

export default {
    // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
    // for more information about preprocessors
    preprocess: vitePreprocess(),
    onwarn: (warning, handler) => {
        // suppress warnings on `vite dev` and `vite build`; but even without this, things still work
        if (NoWarns.has(warning.code)) return;
        if (warning.code.startsWith('a11y-')) return
        if (warning.code === 'missing-exports-condition') return
        if (warning.code === 'a11y-no-static-element-interactions') return
        if (warning.code === 'svelte-ignore a11y-autofocus') return
        if (warning.code.startsWith('css-unused-selector')) return
        handler(warning);
    }
}
