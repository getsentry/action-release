---
name: Release checklist
about: This is a checklist to be used when doing a new release
title: New release checklist for [version number]
labels: ''
assignees: ''

---

You can see the action released in [here](https://github.com/marketplace/actions/sentry-release).

Checklist for a new release:

- [ ] Create a PR that bumps the version in `package.json` and merge it
- [ ] Once merged, visit the [releases page](https://github.com/getsentry/action-release/releases)
  - [ ] Create a new release
  - [ ] Name the release (You can use the version number if you want)
  - [ ] Describe the release by looking at what commits landed on master since the last release
  - Create a new tag by entering it in the drop down
    - [ ] If it's a security update, tag is a patch release
    - [ ] If it's just some improvements or bug fix, tag is a minor release
    - [ ] If there are _breaking_ changes, tag it as a major release
      - [ ] Figure out if we need to do an external annoucement of sorts
- [ ] Once published, visit [the marketplace](https://github.com/marketplace/actions/sentry-release) to see that the release is showing up
- Update existing major tag (i.e. v1, v2 etc)
  - [ ] Run `git tag -f v<Major Release Num>`
  - [ ] Run `git push origin master --tags`
