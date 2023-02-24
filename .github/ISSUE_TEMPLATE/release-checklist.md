---
name: Release checklist
about: This is a checklist for maintainers to be used when creating a new release.
title: New release checklist for [version number] (maintainers only).
labels: ''
assignees: ''

---
You can see the action released in [here](https://github.com/marketplace/actions/sentry-release). The version shows what was the last released version.

Checklist for a new release:

- [ ] Create a PR that bumps the version in `package.json` and merge it
   - [ ] Read notes below to figure out which version to pick
   - [ ] Make the commit read "Bump version to x.y.z"
- [ ] Once merged, visit the [releases page](https://github.com/getsentry/action-release/releases)
  - [ ] Click Draft a new release
  - [ ] Create a new tag by entering it in the drop down (see screenshot)
  - [ ] Name the release (Use the version number if you want)
  - [ ] Describe the release
     - [ ] Use the button Generate Release Notes (see screenshot)
     - [ ] Update the Full Changelog link to use the right tags (there's a minor bug)
        - The first value is the last release; the second value is the tag that has not yet been created, thus, the link won't be working yet
- [ ] Once published, visit [the marketplace](https://github.com/marketplace/actions/sentry-release) to see that the release is showing up
- [ ] Update existing major tag (i.e. v1, v2 etc); Run the following commands
  - [ ] `git checkout master && git pull`
  - [ ] `git tag -f v<Major Release Num>`
  - [ ] `git push origin master --tags -f`

**DONE!!** 🎉 

<hr/>

Screenshot of UI to create tag as part of the release:

<img width="317" alt="image" src="https://user-images.githubusercontent.com/44410/221204718-6fc7b2d8-a8a1-4c13-a626-0fdebff11892.png">

Screenshot of UI to generate release notes:

<img width="250" alt="image" src="https://user-images.githubusercontent.com/44410/221206306-bba4a62d-2181-4cad-9285-2aa1a7bde5e8.png">

### NOTES

We use semver (x.y.z) versioning. This basically means:
* x bump (breaking compatibility)
* z bump (bug fix/security)
* y bump for everything that does not fall on the other two categories
