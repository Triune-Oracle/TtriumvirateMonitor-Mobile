#!/usr/bin/env node

import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DEFAULT_CONFIG = {
  primaryAuthor: "Sean Christopher Southwick",
  frameworkVersion: "1.0.0",
  excludeDirs: [".git", "node_modules", ".next", "dist", "build", ".vscode", ".idea"],
  excludeFiles: [".DS_Store", "Thumbs.db"],
  maxFileSize: 10 * 1024 * 1024, // 10MB limit
  verbose: false,
  dryRun: false,
  concurrency: 10, // Max concurrent file operations
  templatePath: path.join(__dirname, "..", "templates"),
}

// File type mappings
const FILE_TYPES = {
  ".js": { type: "javascript", template: "code-header-template.js" },
  ".jsx": { type: "javascript", template: "code-header-template.js" },
  ".ts": { type: "javascript", template: "code-header-template.js" },
  ".tsx": { type: "javascript", template: "code-header-template.js" },
  ".py": { type: "python", template: "python-header-template.py" },
  ".html": { type: "html", template: "html-header-template.html" },
  ".md": { type: "markdown", template: "README_TEMPLATE.md" },
  ".json": { type: "json", template: null },
  ".yml": { type: "yaml", template: "project-metadata.yml" },
  ".yaml": { type: "yaml", template: "project-metadata.yml" },
}

/**
 * Layered Authorship Framework Adder
 * Recursively adds authorship attribution to project files
 */
class AuthorshipFrameworkAdder {
  /**
   * Initialize the framework adder
   * @param {Object} options - Configuration options
   * @param {string} options.primaryAuthor - Primary author name
   * @param {boolean} options.verbose - Enable verbose logging
   * @param {boolean} options.dryRun - Simulate changes without writing files
   * @param {number} options.concurrency - Maximum concurrent operations
   */
  constructor(options = {}) {
    this.options = { ...DEFAULT_CONFIG, ...options }
    this.report = {
      processed: 0,
      modified: 0,
      skipped: 0,
      errors: 0,
      files: [],
      startTime: Date.now(),
    }
    this.logger = new Logger(this.options.verbose)
  }

  /**
   * Load template file with enhanced error handling
   * @param {string} templateName - Name of the template file
   * @returns {Promise<string|null>} Template content or null if not found
   */
  async loadTemplate(templateName) {
    try {
      const templatePath = path.join(this.options.templatePath, templateName)
      const content = await fs.readFile(templatePath, "utf-8")
      this.logger.debug(`✅ Loaded template: ${templateName}`)
      return content
    } catch (error) {
      this.logger.warn(`⚠️  Template ${templateName} not found: ${error.message}`)

      return this.getDefaultTemplate(templateName)
    }
  }

  /**
   * Generate default template as fallback
   * @param {string} templateName - Original template name
   * @returns {string} Default template content
   */
  getDefaultTemplate(templateName) {
    const ext = path.extname(templateName)
    const commentStyle = this.getCommentStyle(ext)

    return `${commentStyle.start}
${commentStyle.line} Layered Authorship Framework
${commentStyle.line} Primary Author: {primaryAuthor}
${commentStyle.line} Computational Assistance: {assistanceType}
${commentStyle.line} Creation Date: {creationDate}
${commentStyle.line} Artifact ID: {artifactId}
${commentStyle.end}`
  }

  /**
   * Get comment style for file extension
   * @param {string} ext - File extension
   * @returns {Object} Comment style configuration
   */
  getCommentStyle(ext) {
    const styles = {
      ".js": { start: "/*", line: " *", end: " */" },
      ".py": { start: '"""', line: "", end: '"""' },
      ".html": { start: "<!--", line: "", end: "-->" },
      ".md": { start: "", line: "", end: "" },
    }
    return styles[ext] || styles[".js"]
  }

  generateAttributionData(filePath, assistanceType = "code structure and formatting") {
    const now = new Date().toISOString().split("T")[0]
    const artifactId = `SCS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    return {
      primaryAuthor: this.options.primaryAuthor,
      assistanceType,
      collaborators: "None",
      creationDate: now,
      lastModified: now,
      artifactId,
      contributionLevel: "Level 2 - Assisted Development",
      filePath: path.relative(process.cwd(), filePath),
    }
  }

  /**
   * Replace template placeholders with actual data
   * @param {string} template - Template content
   * @param {Object} data - Attribution data
   * @returns {string} Template with replaced placeholders
   */
  replaceTemplatePlaceholders(template, data) {
    const replacements = {
      primaryAuthor: data.primaryAuthor,
      assistanceType: data.assistanceType,
      assistance_type: data.assistanceType,
      collaborators: data.collaborators,
      creationDate: data.creationDate,
      creation_date: data.creationDate,
      lastModified: data.lastModified,
      last_modified: data.lastModified,
      artifactId: data.artifactId,
      artifact_id: data.artifactId,
      contributionLevel: data.contributionLevel,
      contribution_level: data.contributionLevel,
    }

    let result = template
    for (const [key, value] of Object.entries(replacements)) {
      result = result.replace(new RegExp(`\\{${key}\\}`, "g"), value)
    }
    return result
  }

  /**
   * Check if file already has attribution
   * @param {string} content - File content
   * @returns {Promise<boolean>} True if attribution exists
   */
  async hasExistingAttribution(content) {
    const attributionMarkers = [
      "Layered Authorship Framework",
      "Primary Author: Sean Christopher Southwick",
      "Sean Christopher Southwick",
      "Authorship Attribution",
    ]

    return attributionMarkers.some((marker) => content.toLowerCase().includes(marker.toLowerCase()))
  }

  /**
   * Process a single file with enhanced error handling
   * @param {string} filePath - Path to the file
   * @returns {Promise<Object>} Processing result
   */
  async processFile(filePath) {
    const fileResult = {
      path: path.relative(process.cwd(), filePath),
      status: "pending",
      reason: null,
      error: null,
      attribution: null,
      fileType: null,
    }

    try {
      this.report.processed++
      this.logger.debug(`📄 Processing: ${fileResult.path}`)

      const ext = path.extname(filePath).toLowerCase()
      const fileType = FILE_TYPES[ext]

      if (!fileType || !fileType.template) {
        this.report.skipped++
        fileResult.status = "skipped"
        fileResult.reason = "No template for file type"
        this.logger.debug(`⏭️  Skipped ${fileResult.path}: ${fileResult.reason}`)
        return fileResult
      }

      const stats = await fs.stat(filePath)
      if (stats.size > this.options.maxFileSize) {
        this.report.skipped++
        fileResult.status = "skipped"
        fileResult.reason = "File too large"
        this.logger.debug(`⏭️  Skipped ${fileResult.path}: ${fileResult.reason}`)
        return fileResult
      }

      const content = await fs.readFile(filePath, "utf-8")

      if (await this.hasExistingAttribution(content)) {
        this.report.skipped++
        fileResult.status = "skipped"
        fileResult.reason = "Attribution already exists"
        this.logger.debug(`⏭️  Skipped ${fileResult.path}: ${fileResult.reason}`)
        return fileResult
      }

      const template = await this.loadTemplate(fileType.template)
      if (!template) {
        this.report.skipped++
        fileResult.status = "skipped"
        fileResult.reason = "Template not found"
        this.logger.debug(`⏭️  Skipped ${fileResult.path}: ${fileResult.reason}`)
        return fileResult
      }

      const attributionData = this.generateAttributionData(filePath)
      const attribution = this.replaceTemplatePlaceholders(template, attributionData)

      let newContent
      if (fileType.type === "markdown") {
        newContent = this.replaceTemplatePlaceholders(template, {
          ...attributionData,
          PROJECT_NAME: path.basename(path.dirname(filePath)),
          PROJECT_DESCRIPTION: "Project description here",
          PROJECT_CONTENT: content,
        })
      } else {
        newContent = `${attribution}\n\n${content}`
      }

      if (!this.options.dryRun) {
        await fs.writeFile(filePath, newContent, "utf-8")
      }

      this.report.modified++
      fileResult.status = "modified"
      fileResult.attribution = attributionData
      fileResult.fileType = fileType.type

      this.logger.info(`✅ ${this.options.dryRun ? "Would modify" : "Modified"}: ${fileResult.path}`)
      return fileResult
    } catch (error) {
      this.report.errors++
      fileResult.status = "error"
      fileResult.error = error.message
      this.logger.error(`❌ Error processing ${fileResult.path}: ${error.message}`)
      return fileResult
    }
  }

  /**
   * Process directory with parallel file processing
   * @param {string} dirPath - Directory path to process
   * @returns {Promise<void>}
   */
  async processDirectory(dirPath) {
    try {
      this.logger.debug(`📁 Processing directory: ${dirPath}`)
      const entries = await fs.readdir(dirPath, { withFileTypes: true })

      const files = []
      const directories = []

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name)

        if (entry.isDirectory()) {
          if (!this.options.excludeDirs.includes(entry.name)) {
            directories.push(fullPath)
          }
        } else if (entry.isFile()) {
          if (!this.options.excludeFiles.includes(entry.name)) {
            files.push(fullPath)
          }
        }
      }

      const filePromises = []
      for (let i = 0; i < files.length; i += this.options.concurrency) {
        const batch = files.slice(i, i + this.options.concurrency)
        const batchPromises = batch.map(async (filePath) => {
          const result = await this.processFile(filePath)
          this.report.files.push(result)
          return result
        })
        filePromises.push(...batchPromises)
      }

      await Promise.all(filePromises)

      // Process directories recursively
      for (const dirPath of directories) {
        await this.processDirectory(dirPath)
      }
    } catch (error) {
      const errorMsg = `Error processing directory ${dirPath}: ${error.message}`
      this.logger.error(`❌ ${errorMsg}`)
      this.report.errors++
    }
  }

  /**
   * Generate comprehensive processing report
   * @returns {Object} Detailed report
   */
  generateReport() {
    const endTime = Date.now()
    const processingTime = ((endTime - this.report.startTime) / 1000).toFixed(2)

    return {
      ...this.report,
      endTime,
      processingTime: `${processingTime}s`,
      summary: {
        totalFiles: this.report.processed,
        successRate:
          this.report.processed > 0 ? ((this.report.modified / this.report.processed) * 100).toFixed(1) + "%" : "0%",
        errorRate:
          this.report.processed > 0 ? ((this.report.errors / this.report.processed) * 100).toFixed(1) + "%" : "0%",
      },
    }
  }

  /**
   * Main method to add framework recursively
   * @param {string} rootPath - Root directory path
   * @returns {Promise<Object>} Processing report
   */
  async addFrameworkRecursively(rootPath = ".") {
    this.logger.info(`🚀 Starting Layered Authorship Framework addition...`)
    this.logger.info(`📁 Root path: ${path.resolve(rootPath)}`)
    this.logger.info(`⚙️  Mode: ${this.options.dryRun ? "DRY RUN" : "LIVE"}`)

    await this.processDirectory(rootPath)
    const report = this.generateReport()

    this.logger.info("\n📊 PROCESSING REPORT")
    this.logger.info("=".repeat(50))
    this.logger.info(`⏱️  Processing time: ${report.processingTime}`)
    this.logger.info(`📄 Files processed: ${report.processed}`)
    this.logger.info(`✅ Files modified: ${report.modified}`)
    this.logger.info(`⏭️  Files skipped: ${report.skipped}`)
    this.logger.info(`❌ Errors: ${report.errors}`)
    this.logger.info(`📈 Success rate: ${report.summary.successRate}`)

    if (report.modified > 0) {
      this.logger.info("\n📝 MODIFIED FILES:")
      report.files
        .filter((f) => f.status === "modified")
        .forEach((file) => {
          this.logger.info(`  ✅ ${file.path} (${file.fileType})`)
        })
    }

    if (report.errors > 0) {
      this.logger.info("\n❌ ERRORS:")
      report.files
        .filter((f) => f.status === "error")
        .forEach((file) => {
          this.logger.error(`  ❌ ${file.path}: ${file.error}`)
        })
    }

    // Save detailed report
    const reportPath = `authorship-framework-report-${Date.now()}.json`
    if (!this.options.dryRun) {
      await fs.writeFile(reportPath, JSON.stringify(report, null, 2))
      this.logger.info(`\n📋 Detailed report saved to: ${reportPath}`)
    }

    return report
  }
}

/**
 * Enhanced logger with verbose mode support
 */
class Logger {
  constructor(verbose = false) {
    this.verbose = verbose
  }

  info(message) {
    console.log(message)
  }

  debug(message) {
    if (this.verbose) {
      console.log(`[DEBUG] ${message}`)
    }
  }

  warn(message) {
    console.warn(`[WARN] ${message}`)
  }

  error(message) {
    console.error(`[ERROR] ${message}`)
  }
}

/**
 * Parse command line arguments
 * @returns {Object} Parsed configuration
 */
function parseArgs() {
  const args = process.argv.slice(2)
  const config = { ...DEFAULT_CONFIG }
  let rootPath = "."

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    switch (arg) {
      case "--verbose":
      case "-v":
        config.verbose = true
        break
      case "--dry-run":
      case "-d":
        config.dryRun = true
        break
      case "--author":
      case "-a":
        config.primaryAuthor = args[++i]
        break
      case "--concurrency":
      case "-c":
        config.concurrency = Number.parseInt(args[++i]) || DEFAULT_CONFIG.concurrency
        break
      case "--help":
      case "-h":
        console.log(`
Layered Authorship Framework Adder

Usage: node add-framework-recursive.js [options] [path]

Options:
  -v, --verbose      Enable verbose logging
  -d, --dry-run      Simulate changes without writing files
  -a, --author       Set primary author name
  -c, --concurrency  Set max concurrent operations (default: 10)
  -h, --help         Show this help message

Examples:
  node add-framework-recursive.js
  node add-framework-recursive.js --verbose --dry-run ./my-project
  node add-framework-recursive.js --author "John Doe" --concurrency 5
        `)
        process.exit(0)
        break
      default:
        if (!arg.startsWith("-")) {
          rootPath = arg
        }
    }
  }

  return { config, rootPath }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { config, rootPath } = parseArgs()
  const adder = new AuthorshipFrameworkAdder(config)

  adder
    .addFrameworkRecursively(rootPath)
    .then((report) => {
      console.log(`\n🎉 Framework addition complete!`)
      console.log(`📊 Final stats: ${report.modified} modified, ${report.skipped} skipped, ${report.errors} errors`)
      process.exit(report.errors > 0 ? 1 : 0)
    })
    .catch((error) => {
      console.error("💥 Fatal error:", error)
      process.exit(1)
    })
}

export default AuthorshipFrameworkAdder
