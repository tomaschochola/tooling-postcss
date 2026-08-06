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

import assert from 'node:assert/strict';
import test from 'node:test';
import postcss from 'postcss';
import { PostCSSConfigBuilder } from '../src/index.js';

const processCss = async (builder, css) => postcss(builder.toConfig().plugins).process(css, { from: undefined });

test('empty builder exposes an empty plugin pipeline', () => {
  assert.deepEqual(new PostCSSConfigBuilder().toConfig(), { plugins: [] });
});

test('repeated preset additions update options without duplicating the plugin', async () => {
  const builder = new PostCSSConfigBuilder().addPresetEnvPlugin({ browsers: 'ie 11' }).addPresetEnvPlugin({ browsers: 'chrome 136' });

  const config = builder.toConfig();
  const freshConfig = builder.toConfig();

  assert.equal(config.plugins.length, 1);
  assert.equal(config.plugins[0].postcssPlugin, 'postcss-preset-env');
  assert.notEqual(config.plugins[0], freshConfig.plugins[0]);

  const result = await postcss(config.plugins).process('.item { user-select: none; }', { from: undefined });

  assert.equal(result.css, '.item { user-select: none; }');
});

test('preset options control transformations through the complete PostCSS pipeline', async () => {
  const modern = await processCss(new PostCSSConfigBuilder().addPresetEnvPlugin({ browsers: 'chrome 136' }), '.item { user-select: none; }');

  const legacy = await processCss(new PostCSSConfigBuilder().addPresetEnvPlugin({ browsers: 'ie 11' }), '.item { user-select: none; }');

  assert.doesNotMatch(modern.css, /-ms-user-select/u);
  assert.match(legacy.css, /-ms-user-select/u);
});

test('copy template resolves to an executable PostCSS configuration', async () => {
  const { default: config } = await import('../templates/recommended.js?test=recommended');
  const result = await postcss(config.plugins).process('.item { &:hover { color: red; } }', { from: undefined });

  assert.equal(config.plugins.length, 1);
  assert.match(result.css, /\.item:hover/u);
});
