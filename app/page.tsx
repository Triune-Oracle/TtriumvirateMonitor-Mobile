/*
 * Layered Authorship Framework Attribution
 *
 * Primary Author: Sean Christopher Southwick
 * Computational Assistance: Non-human automated systems provided React component structure and dashboard layout
 * Human Collaborators: None
 * Creation Date: 2025-08-26
 * Last Modified: 2025-08-26
 * Artifact ID: SCS-DASHBOARD-MAIN-001
 *
 * Contribution Level: Level 2 - Assisted Development
 */

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProjectOverview } from "@/components/dashboard/project-overview"
import { AttributionStatus } from "@/components/dashboard/attribution-status"
import { ComplianceMonitor } from "@/components/dashboard/compliance-monitor"
import { BulkOperations } from "@/components/dashboard/bulk-operations"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Overview Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ProjectOverview />
          </div>
          <div>
            <AttributionStatus />
          </div>
        </section>

        {/* Monitoring and Operations */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ComplianceMonitor />
          <BulkOperations />
        </section>

        {/* Recent Activity */}
        <section>
          <RecentActivity />
        </section>
      </main>
    </div>
  )
}
