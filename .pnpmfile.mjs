const unusedBundlerPeer = /^@(?:rsbuild|rspack)\//

export const hooks = {
  readPackage(pkg) {
    if (pkg.name === 'unplugin') {
      for (const name of Object.keys(pkg.peerDependencies ?? {})) {
        if (unusedBundlerPeer.test(name) && pkg.peerDependenciesMeta?.[name]?.optional) {
          delete pkg.peerDependencies[name]
          delete pkg.peerDependenciesMeta[name]
        }
      }
    }
    return pkg
  },
}
