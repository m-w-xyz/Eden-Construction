import type { Metadata } from 'next'
import { Suspense } from 'react'
import Nav from '@/components/Nav'
import ProjectsList from '@/components/ProjectsList'
import { client } from '@/lib/sanity.client'
import { projectsQuery } from '@/lib/queries'
import type { Project } from '@/types'

export const metadata: Metadata = { title: 'Projects' }
export const revalidate = 60

export default async function ProjectsPage() {
  const projects: Project[] = await client.fetch(projectsQuery)

  return (
    <>
      <Nav />
      <main className="pt-16 pb-0">
        <div className="px-[10px] pt-16 md:pt-24 pb-16 md:pb-[240px]">
          <Suspense>
            <ProjectsList projects={projects} />
          </Suspense>
        </div>
      </main>
    </>
  )
}
