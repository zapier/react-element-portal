import shell from 'shelljs';

const cwd = process.cwd();

shell.cd('react-redux-element-portal');
shell.exec('npm publish', () => {
  shell.cd(cwd);
});
