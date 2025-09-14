/*
 * Layered Authorship Framework Attribution
 *
 * Primary Author: Sean Christopher Southwick
 * Computational Assistance: Non-human automated systems provided React component structure and data visualization
 * Human Collaborators: None
 * Creation Date: 2025-08-26
 * Last Modified: 2025-08-26
 * Artifact ID: SCS-PROJECT-OVERVIEW-001
 *
 * Contribution Level: Level 2 - Assisted Development
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const projects = [
  {
    name: "Genesis Codex Framework",
    type: "Mythological System",
    files: 247,
    attributed: 247,
    coverage: 100,
    lastUpdated: "2025-08-26",
    status: "compliant",
  },
  {
    name: "Triumvirate Personas",
    type: "Character System",
    files: 89,
    attributed: 85,
    coverage: 96,
    lastUpdated: "2025-08-25",
    status: "warning",
  },
  {
    name: "Oracle Methodology",
    type: "Narrative Design",
    files: 156,
    attributed: 156,
    coverage: 100,
    lastUpdated: "2025-08-24",
    status: "compliant",
  },
  {
    name: "Legio Protocol",
    type: "System Design",
    files: 203,
    attributed: 198,
    coverage: 97,
    lastUpdated: "2025-08-23",
    status: "warning",
  },
]

export function ProjectOverview() {
  const totalFiles = projects.reduce((sum, project) => sum + project.files, 0)
  const totalAttributed = projects.reduce((sum, project) => sum + project.attributed, 0)
  const overallCoverage = Math.round((totalAttributed / totalFiles) * 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Project Overview</CardTitle>
        <CardDescription>Attribution status across all projects</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{projects.length}</div>
            <div className="text-sm text-muted-foreground">Active Projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{totalFiles}</div>
            <div className="text-sm text-muted-foreground">Total Files</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{overallCoverage}%</div>
            <div className="text-sm text-muted-foreground">Coverage</div>
          </div>
        </div>

        {/* Project List */}
        <div className="space-y-4">
          {projects.map((project, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{project.name}</h3>
                  <Badge variant={project.status === "compliant" ? "default" : "secondary"}>
                    {project.status === "compliant" ? "Compliant" : "Needs Attention"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{project.type}</p>
                <p className="text-xs text-muted-foreground">Last updated: {project.lastUpdated}</p>
              </div>

              <div className="text-right space-y-2 min-w-[120px]">
                <div className="text-sm">
                  {project.attributed}/{project.files} files
                </div>
                <Progress value={project.coverage} className="w-20" />
                <div className="text-xs text-muted-foreground">{project.coverage}% coverage</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
