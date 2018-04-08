const { exec, execSync } = require('child_process');
const os = require('os');
const fs = require('fs');

const execCallback = (err, stdout, stderr) => {
  if (err) console.log('err', err);
  if (stdout) console.log('stdout', stdout);
  if (stderr) console.log('stderr', stderr);
};

class Project {
  constructor(name) {
    this.name = name;
    this.absolutePath = `${os.homedir()}/Projects/${name}`;
  }

  exists() {
    return fs.existsSync(this.absolutePath);
  }
  isGitRepository() {
    try {
      execSync(`git -C ${this.absolutePath} rev-parse`);
      return true;
    } catch (e) {
      return false;
    }
  }
  hasRemoteUrl() {
    try {
      execSync(`git -C ${this.absolutePath} ls-remote`);
      return true;
    } catch (e) {
      return false;
    }
  }

  pullFromGithub() {
    if (this.hasRemoteUrl()) {
      try {
        execSync(`git -C ${this.absolutePath} reset --hard`);
        execSync(`git -C ${this.absolutePath} clean -df`);
        execSync(`git -C ${this.absolutePath} pull -f`);
      } catch (e) {
        console.log('pullFromGithub:', e);
      }
    } else {
      console.log('pullFromGithub: Tried to pull form github, but remote url was not find');
    }
  }

  createDirectory() {
    try {
      execSync(`mkdir ${this.absolutePath}`);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  cloneFromGithub(githubUrl) {
    if (githubUrl) {
      exec(`git -C ${this.absolutePath} clone ${githubUrl} ./`, execCallback);
    } else {
      console.log('githubUrl parameter was not pass to cloneFromGithub method');
    }
  }

  installDependencies() {
    exec(`npm -C ${this.absolutePath} install --production`, execCallback);
  }

  restartForever() {
    exec(`forever -C ${this.absolutePath} restart ${this.name}`, execCallback);
  }
}

module.exports = Project;
