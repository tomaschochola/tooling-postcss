/**
 * @file
 * @author Tomáš Chochola <tomaschochola@tomaschochola.cz>
 * @copyright © 2026 Tomáš Chochola <tomaschochola@tomaschochola.cz>
 *
 * @license CC-BY-ND-4.0
 *
 * @see {@link https://creativecommons.org/licenses/by-nd/4.0/} License
 * @see {@link https://github.com/tomaschochola} GitHub Profile
 * @see {@link https://github.com/sponsors/tomaschochola} GitHub Sponsors
 */

import postcssPresetEnv from 'postcss-preset-env';

const presetEnvDefaults = Object.freeze({
    enableClientSidePolyfills: false,
    minimumVendorImplementations: 2,
    stage: false,
});

const pluginFactory = ([factory]) => factory;

function isPlainObject(value) {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return false;
    }

    const prototype = Object.getPrototypeOf(value);

    return prototype === Object.prototype || prototype === null;
}

function normalizeOptions(options) {
    if (!isPlainObject(options)) {
        throw new TypeError('options must be a plain object.');
    }

    return { ...options };
}

export class PostCSSConfigBuilder {
    #config;

    constructor() {
        this.#config = {
            plugins: [],
        };
    }

    #replaceConfig(config) {
        this.#config = { ...config };

        return this;
    }

    addPresetEnvPlugin(options = {}) {
        const plugin = [
            postcssPresetEnv,
            {
                ...presetEnvDefaults,
                ...normalizeOptions(options),
            },
        ];
        const existingIndex = this.#config.plugins.findIndex((item) => pluginFactory(item) === postcssPresetEnv);
        const plugins = [...this.#config.plugins];

        if (existingIndex === -1) {
            plugins.push(plugin);
        } else {
            plugins[existingIndex] = plugin;
        }

        return this.#replaceConfig({
            ...this.#config,
            plugins,
        });
    }

    toConfig() {
        return {
            ...this.#config,
            plugins: this.#config.plugins.map(([factory, options]) => factory({ ...options })),
        };
    }
}
