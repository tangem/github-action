const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  const { getInput, setFailed, setOutput } = core;
  try {
    const githubToken = getInput('github-token', { required: true });
    const pullNumber = getInput('pull-number', { required: false });
    const base = getInput('base', { required: false });
    const head = getInput('head', { required: false });

    const { context, getOctokit } = github;
    const { repo: { owner, repo } } = context;
    const { rest } = getOctokit(githubToken);
    const jiraMatcher = /\d+-[A-Z]+(?!-?[a-zA-Z]{1,10})/g;

    if (!pullNumber && !(base && head)) {
      setFailed('You mast set pull-number or base and head branches');
    }

    let issues = [];
    if (pullNumber) {
      const { data} = await rest.pulls.listCommits({owner, repo, pull_number: pullNumber});
      issues = Array.isArray(data)
        ? data.reduce((issues, {commit}) => {
            const names = commit.message.split('').reverse().join('').match(jiraMatcher);
            if (!names) {
              return issues;
            }
            names.forEach((res) => {
              const id = res.split('').reverse().join('');
              if (issues.indexOf(id) === -1) {
                issues.push(id);
              }
            });
            return issues;
          },
          [],
        )
        : [];
    } else {
      const { data } = await rest.repos.compareCommitsWithBasehead({owner, repo, basehead: `${base}...${head}`});
      issues = Array.isArray(data.commits)
        ? data.commits.reduce((issues, { commit}) => {
            const names = commit.message.split('').reverse().join('').match(jiraMatcher);
            if (!names) {
              return issues;
            }
            names.forEach((res) => {
              const id = res.split('').reverse().join('');
              if (issues.indexOf(id) === -1) {
                issues.push(id);
              }
            });
            return issues;
          },
          [],
        )
        : [];
    }

    setOutput('issues', JSON.stringify(issues));
  } catch (err) {
    setFailed(err.message);
  }
}

run();
