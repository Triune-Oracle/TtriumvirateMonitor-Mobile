/*
 * Layered Authorship Framework Attribution
 *
 * Primary Author: Sean Christopher Southwick
 * Computational Assistance: Non-human automated systems provided webpack plugin structure
 * Human Collaborators: None
 * Creation Date: 2025-08-26
 * Last Modified: 2025-08-26
 * Artifact ID: SCS-WEBPACK-PLUGIN-001
 *
 * Contribution Level: Level 2 - Assisted Development
 */

/**
 * Webpack plugin for Layered Authorship Framework integration
 * Automatically adds attribution headers to bundled files
 */
class AuthorshipFrameworkPlugin {
  constructor(options = {}) {
    this.options = {
      primaryAuthor: "Sean Christopher Southwick",
      assistanceType: "build process and bundling",
      contributionLevel: "Level 2 - Assisted Development",
      ...options,
    }
  }

  apply(compiler) {
    const pluginName = "AuthorshipFrameworkPlugin"

    compiler.hooks.emit.tapAsync(pluginName, (compilation, callback) => {
      // Generate attribution header
      const now = new Date().toISOString().split("T")[0]
      const artifactId = `SCS-BUNDLE-${Date.now()}`

      const attributionHeader = `/*
 * Layered Authorship Framework Attribution
 *
 * Primary Author: ${this.options.primaryAuthor}
 * Computational Assistance: Non-human automated systems provided ${this.options.assistanceType}
 * Human Collaborators: None
 * Creation Date: ${now}
 * Last Modified: ${now}
 * Artifact ID: ${artifactId}
 *
 * Contribution Level: ${this.options.contributionLevel}
 */

`

      // Add attribution to JavaScript bundles
      Object.keys(compilation.assets).forEach((filename) => {
        if (filename.endsWith(".js")) {
          const asset = compilation.assets[filename]
          const source = asset.source()

          // Check if attribution already exists
          if (!source.includes("Layered Authorship Framework")) {
            compilation.assets[filename] = {
              source: () => attributionHeader + source,
              size: () => attributionHeader.length + source.length,
            }
          }
        }
      })

      callback()
    })

    // Generate attribution report
    compiler.hooks.done.tap(pluginName, (stats) => {
      const fs = require("fs")
      const path = require("path")

      const report = {
        framework: "Layered Authorship Framework",
        primaryAuthor: this.options.primaryAuthor,
        buildTime: new Date().toISOString(),
        bundles: Object.keys(stats.compilation.assets).filter((name) => name.endsWith(".js")),
        contributionLevel: this.options.contributionLevel,
      }

      const reportPath = path.join(stats.compilation.outputOptions.path, "authorship-report.json")
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))

      console.log(`📋 Authorship Framework report generated: ${reportPath}`)
    })
  }
}

module.exports = AuthorshipFrameworkPlugin
