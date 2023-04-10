# Contribution Guide

## Style Guides

- Files generally should have a descriptor for them as a set of comments. It
  should outline the intent of the file, scope, and some useful information for
  someone to understand why the file exists. Feel free to add some character
  here.
- Methods generally should have less comments and generally be used to clarify
  decisions about implementation. I.e we did this vs. that b/c it was faster to
  implement.

## Submitting a PR

- Check the [PR Guide](./docs/pr-guide.md) for more information.
- PR's should generally be small and constrained to a very limited scope
- You must have at least one CODEOWNER review the PR beforehand
- Try to maintain a clean history
- We generally prefer rebasing to merging, as long as the history is clean.

## Raising Issues

To raise an issue, you may use Github to do so. Please in doing so, answer the
following questions:

### Features

- what -- what feature do you want
- why -- why do you want the feature
- stakeholders? -- aside from you, who else wants the feature
- considerations/constraints -- any specific constraints with a solution that
  you need

### Bugs

- what -- what is the bug
- why -- why do you need this fixed
- replication -- how do you replicate the bug
- environment -- please give details on what system you found the bug on
- logs/metrics -- please provide logs and/or metrics of the bug as best as
  possible

## Managing an Issue

Issue management and prioritization will be done internally over JIRA. Please
talk to the product team for more information about this.
