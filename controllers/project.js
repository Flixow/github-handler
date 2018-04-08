const Project = require('../services/Project');

module.exports = ((req, res) => {
  const { id } = req.params;
  try {
    // const branch = (req.body.ref || '').split('/')[2];
    const project = new Project(id);
    const isGitRepository = project.isGitRepository();
    const exists = project.exists();

    if (exists && !isGitRepository) {
      res.status(400).send('Project already exists and is not a git repository');
    } else if (exists && isGitRepository) {
      project.pullFromGithub();
    } else if (!exists) {
      project.createDirectory();
      project.cloneFromGithub();
    }

    // if (branch === 'master') {
    //   if (project.exists) {
    //     project.pullFromGithub();
    //   } else {
    //     const { url: githubUrl } = req.body.repository;
    //     project.cloneFromGithub(githubUrl);
    //   }
    // }

    res.sendStatus(200);
  } catch (e) {
    res.status(500).send(e);
    throw new Error(e);
  }
});
