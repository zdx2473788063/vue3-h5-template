import {
    defineConfig,
    presetAttributify,
    presetTypography,
    presetUno,
    transformerDirectives,
    transformerVariantGroup
} from "unocss";

export default defineConfig({
    shortcuts: [],
    presets: [
        presetUno(), // 默认wind预设
        presetAttributify(), // class拆分属性预设
        presetTypography() // 排版预设
    ],
    transformers: [
        transformerVariantGroup(), // windi CSS的变体组功能
        transformerDirectives() //  @apply @screen theme()转换器
    ],
    rules: [
        ['text-bold', {'font-family': "'bold',serif"}]
    ]
});
