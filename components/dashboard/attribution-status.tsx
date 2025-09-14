/*
 * Layered Authorship Framework Attribution
 *
 * Primary Author: Sean Christopher Southwick
 * Computational Assistance: Non-human automated systems provided React component structure and chart implementation
 * Human Collaborators: None
 * Creation Date: 2025-08-26
 * Last Modified: 2025-08-26
 * Artifact ID: SCS-ATTRIBUTION-STATUS-001
 *
 * Contribution Level: Level 2 - Assisted Development
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const attributionLevels = [
  {
    level: "Level 1 - Pure Origination",
    count: 156,
    percentage: 22,
    color: "bg-chart-1",
  },
  {
    level: "Level 2 - Assisted Development",
    count: 445,
    percentage: 63,
    color: "bg-chart-2",
  },
  {
    level: "Level 3 - Collaborative Refinement",
    count: 104,
    percentage: 15,
    color: "bg-chart-3",
  },
]

const fileTypes = [
  { type: "JavaScript/TypeScript", count: 298, attributed: 295 },
  { type: "Python", count: 187, attributed: 185 },
  { type: "Markdown", count: 156, attributed: 156 },
  { type: "YAML/JSON", count: 64, committed: 62 },
]

export function AttributionStatus() {
  return (
    <div className="space-y-6">
      {/* Attribution Levels */}
      <Card>
        <CardHeader>
          <CardTitle>Attribution Levels</CardTitle>
          <CardDescription>Distribution by contribution type</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {attributionLevels.map((level, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{level.level.split(" - ")[0]}</span>
                <span className="text-muted-foreground">{level.count} files</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className={`h-2 rounded-full ${level.color}`} style={{ width: `${level.percentage}%` }} />
              </div>
              <p className="text-xs text-muted-foreground">{level.level.split(" - ")[1]}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* File Types */}
      <Card>
        <CardHeader>
          <CardTitle>File Type Coverage</CardTitle>
          <CardDescription>Attribution by file type</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {fileTypes.map((fileType, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">{fileType.type}</p>
                <p className="text-xs text-muted-foreground">
                  {fileType.attributed}/{fileType.count} files
                </p>
              </div>
              <Badge variant={fileType.attributed === fileType.count ? "default" : "secondary"}>
                {Math.round((fileType.attributed / fileType.count) * 100)}%
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
