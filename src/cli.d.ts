declare module '@sentry/cli' {
  export class Releases {
    constructor(options: any)
    new(release: string): Promise<void>
    setCommits(release: string, options: {
      repo?: string,
      auto?: boolean,
      commit?: string,
      previousCommit?: string,
    }): Promise<void>
    finalize(release: string): Promise<void>
    proposeVersion(): Promise<string>
    uploadSourceMaps(release: string, options: {
      include: string[],
      ignore?: string[],
      ignoreFile?: string,
      rewrite?: boolean,
      sourceMapReference?: boolean,
      stripPrefix?: string[],
      stripCommonPrefix?: boolean,
      validate?: boolean,
      urlPrefix?: string,
      urlSuffix?: string,
      ext?: string[],
    }): Promise<void>
    listDeploys(release: string): Promise<string[]>
    newDeploy(release: string, options: {
      env: string,
      started?: number,
      finished?: number,
      time?: number,
      name?: string,
      url?: string,
    }): Promise<void>
    execute(args: string[], live: boolean): Promise<string>
  }

  export class SentryCli {
    constructor(options?: {configFile: string})
    releases: Releases
  }

  export default SentryCli
}
