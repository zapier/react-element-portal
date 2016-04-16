import pkg from './package.json';
import fs from 'fs';
import shell from 'shelljs';

const devDependencies = [
  'babel-cli',
  'babel-core',
  'babel-eslint',
  'babel-preset-es2015',
  'babel-preset-react',
  'babel-preset-stage-2',
  'react-redux'
].reduce((deps, name) => {
  deps[name] = pkg.devDependencies[name];
  return deps;
}, {});

const reduxPkg = {
  ...pkg,
  name: 'react-redux-element-portal',
  description: `${pkg.description} (with Redux Provider)`,
  scripts: {
    prebuild: 'rm -rf lib && mkdir -p lib',
    build: 'babel src --out-dir lib',
    prepublish: 'npm run build'
  },
  peerDependencies: {
    ...pkg.peerDependencies,
    'react-redux': '>=4.0.0'
  },
  ava: undefined,
  dependencies: {
    'react-element-portal': pkg.version
  },
  devDependencies
};

fs.writeFileSync('./react-redux-element-portal/package.json', JSON.stringify(reduxPkg, null, 2));

const cwd = process.cwd();

shell.cd('react-redux-element-portal');
shell.exec('npm install', () => {
  shell.cd(cwd);
});
