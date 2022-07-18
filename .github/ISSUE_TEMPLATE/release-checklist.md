---
name: Release checklist
about: This is a checklist to be used when doing a new release
title: New release checklist for [version number]
labels: ''
assignees: ''

---

You can see the action released in [here](https://github.com/marketplace/actions/sentry-release).

Checklist for a new release:

[ ] Create a PR that bumps the version in `package.json`
    [ ] Tag the sha with the same version `git tag _some_version_`
    [ ] If it's a security update, tag is a patch release
    [ ] If it's just some improvements or bug fix, tag is a minor release
    [ ] If there are _breaking_ changes, tag it as a major release
        [ ] Plan to do a blog post
[ ] Once merged, visit the [releases page](https://github.com/getsentry/action-release/releases)
    [ ] Create a new release
    [ ] Mark it as _pre-release_ if you do not want users to start using it immediately
    [ ] Name the release (You can use the version number if you want)
    [ ] Describe the release by looking at what commits landed on master since the last release
[ ] Once published, visit [the marketplace](https://github.com/marketplace/actions/sentry-release) to see that the release is showing up
[ ] If you marked the release as _pre-release_, make sure that you do your testing and don't forget to fully release it
