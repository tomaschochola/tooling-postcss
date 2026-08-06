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

const pluginFactory = ([factory]) => factory;

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
    const plugin = [postcssPresetEnv, { ...options }];
    const existingIndex = this.#config.plugins.findIndex((item) => pluginFactory(item) === postcssPresetEnv);

    return this.#replaceConfig({
      ...this.#config,
      plugins: existingIndex === -1 ? [...this.#config.plugins, plugin] : this.#config.plugins.map((item, index) => (index === existingIndex ? plugin : item)),
    });
  }

  toConfig() {
    return {
      ...this.#config,
      plugins: this.#config.plugins.map(([factory, options]) => factory({ ...options })),
    };
  }
}
