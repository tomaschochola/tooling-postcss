import postcssPresetEnv from 'postcss-preset-env';

import defaults from './defaults.js';

export default function createPostcssConfig({ presetEnv = {} } = {}) {
    return {
        plugins: [
            postcssPresetEnv({
                ...defaults,
                ...presetEnv,
            }),
        ],
    };
}
