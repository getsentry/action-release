install: setup-git
	yarn install

setup-git:
ifneq (, $(shell which pre-commit))
	pre-commit install
endif
