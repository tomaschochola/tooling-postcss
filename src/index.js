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

const namedPluginName = (plugin) => (Array.isArray(plugin) ? plugin[0] : plugin);

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
    return this.#replaceConfig({
      ...this.#config,
      plugins: [
        ...this.#config.plugins.filter((plugin) => namedPluginName(plugin) !== 'postcss-preset-env'),
        ['postcss-preset-env', { ...options }],
      ],
    });
  }

  toConfig() {
    return {
      ...this.#config,
      plugins: [...this.#config.plugins],
    };
  }
}
