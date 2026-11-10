import assert from 'node:assert/strict';
import test from 'node:test';

import defaultConfig, { PostCSSConfigBuilder, createPostcssConfig } from '@tomaschochola/tooling-postcss';

test('createPostcssConfig is a function', () => {
    assert.equal(typeof createPostcssConfig, 'function');
    assert.equal(Object.getPrototypeOf(createPostcssConfig), Function.prototype);
});

test('default export is a function', () => {
    assert.equal(typeof defaultConfig, 'function');
    assert.equal(Object.getPrototypeOf(defaultConfig), Function.prototype);
});

test('PostCSSConfigBuilder is a class constructor', () => {
    assert.equal(typeof PostCSSConfigBuilder, 'function');

    const builder = new PostCSSConfigBuilder();

    assert.ok(builder instanceof PostCSSConfigBuilder);
});
