/*
 * Layered Authorship Framework Attribution
 *
 * Primary Author: Sean Christopher Southwick
 * Computational Assistance: Non-human automated systems provided React component structure and activity tracking
 * Human Collaborators: None
 * Creation Date: 2025-08-26
 * Last Modified: 2025-08-26
 * Artifact ID: SCS-RECENT-ACTIVITY-001
 *
 * Contribution Level: Level 2 - Assisted Development
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const activities = [
  {
    type: "Framework Addition",
    description: "Added attribution to 12 new JavaScript files in Genesis Codex Framework",
    timestamp: "2025-08-26 14:30",
    project: "Genesis Codex Framework",
    files: 12,
    status: "success",
  },
  {
    type: "Compliance Check",
    description: "Automated compliance validation completed across all projects",
    timestamp: "2025-08-26 13:15",
    project: "All Projects",
    files: 695,
    status: "success",
  },
  {
    type: "Integration Update",
    description: "GitHub Actions workflow updated with new attribution rules",
    timestamp: "2025-08-26 11:45",
    project: "Triumvirate Personas",
    files: 0,
    status: "success",
  },
  {
    type: "Framework Addition",
    description: "Attribution added to Python modules in Oracle Methodology",
    timestamp: "2025-08-26 10:20",
    project: "Oracle Methodology",
    files: 8,
    status: "success",
  },
  {
    type: "Validation Error",
    description: "Missing attribution detected in 4 files during pre-commit check",
    timestamp: "2025-08-26 09:30",
    project: "Legio Protocol",
    files: 4,
    status: "warning",
  },
  {
    type: "Bulk Operation",
    description: "Framework version updated across 156 files",
    timestamp: "2025-08-25 16:45",
    project: "All Projects",
    files: 156,
    status: "success",
  },
  {
    type: "Integration Setup",
    description: "VS Code snippets and settings configured for new project",
    timestamp: "2025-08-25 14:20",
    project: "New Documentation Project",
    files: 0,
    status: "success",
  },
  {
    type: "Attribution Update",
    description: "Metadata refreshed for existing attributions in Markdown files",
    timestamp: "2025-08-25 12:10",
    project: "Genesis Codex Framework",
    files: 23,
    status: "success",
  },
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest framework operations and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div
                className={`w-2 h-2 rounded-full mt-2 ${
                  activity.status === "success"
                    ? "bg-chart-3"
                    : activity.status === "warning"
                      ? "bg-chart-4"
                      : "bg-destructive"
                }`}
              />

              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{activity.type}</h4>
                    <Badge variant="outline" className="text-xs">
                      {activity.project}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                </div>

                <p className="text-sm text-muted-foreground text-pretty">{activity.description}</p>

                {activity.files > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {activity.files} files affected
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
