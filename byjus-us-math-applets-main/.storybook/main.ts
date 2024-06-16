import { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from 'vite';
const config: StorybookConfig = {
  stories: ['../src/**/*.docs.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions', '@storybook/addon-coverage', '@storybook/addon-mdx-gfm'],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  typescript: {
    skipBabel: true,
    check: false
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      define: {
        'process.env.NODE_DEBUG': false
      },
      build: {
        ...config.build,
        sourcemap: false,
        minify: false,
        target: ['es2020']
      }
    });
  },
  docs: {
    autodocs: true
  }
};
export default config;