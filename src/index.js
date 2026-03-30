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

export const selectors = {
  srcEcmaScript: ['./src/**/*.{tsx,mts,ts,cts,jsx,mjs,js,cjs}'],
};

export class Postcss {
  config;

  constructor() {
    this.config = {
      plugins: [],
    };
  }

  get NODE_ENV() {
    return process.env.NODE_ENV;
  }

  replace(config) {
    this.config = { ...config };

    return this;
  }

  env(options = {}) {
    return this.replace({
      ...this.config,
      plugins: [
        ...this.config.plugins,
        ['postcss-preset-env', { ...options }],
      ],
    });
  }

  build() {
    return { ...this.config };
  }
}
