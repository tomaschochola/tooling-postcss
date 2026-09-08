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

test('preset options must be plain objects', () => {
    for (const options of [null, [], 'invalid', new Date(0)]) {
        assert.throws(() => new PostCSSConfigBuilder().addPresetEnvPlugin(options), {
            message: 'options must be a plain object.',
            name: 'TypeError',
        });
    }

    const options = Object.create(null);
    options.stage = false;

    assert.equal(new PostCSSConfigBuilder().addPresetEnvPlugin(options).toConfig().plugins.length, 1);
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

test('default pipeline preserves portable CSS and applies required vendor prefixes', async () => {
    const portableCss = '.item { &:hover { color: oklch(from red l c h); } }';
    const portable = await processCss(new PostCSSConfigBuilder().addPresetEnvPlugin(), portableCss);
    const legacy = await processCss(new PostCSSConfigBuilder().addPresetEnvPlugin({ browsers: 'ie 11' }), '.item { user-select: none; }');

    assert.equal(portable.css, portableCss);
    assert.match(legacy.css, /-ms-user-select/u);
    assert.equal(portable.warnings().length, 0);
    assert.equal(legacy.warnings().length, 0);
});

test('stable future CSS transformations require explicit opt-in', async () => {
    const options = { stage: 2 };
    const builder = new PostCSSConfigBuilder().addPresetEnvPlugin(options);
    options.stage = false;

    const result = await processCss(builder, '.item { &:hover { color: red; } }');

    assert.match(result.css, /\.item:hover/u);
    assert.equal(result.warnings().length, 0);
});

test('client-side polyfill transformations remain disabled by default', async () => {
    const css = '.item:has(.child) { color: red; }';
    const result = await processCss(new PostCSSConfigBuilder().addPresetEnvPlugin({ browsers: 'ie 11', stage: 2 }), css);

    assert.equal(result.css, css);
    assert.equal(result.warnings().length, 0);
});

test('copy template resolves to a safe executable PostCSS configuration', async () => {
    const { default: config } = await import('../templates/browser_bundler.js');
    const css = '.item { &:hover { color: red; } }';
    const result = await postcss(config.plugins).process(css, { from: undefined });

    assert.equal(config.plugins.length, 1);
    assert.equal(result.css, css);
    assert.equal(result.warnings().length, 0);
});
