import { useParams } from 'next/navigation'
import React from 'react'


function ProjectPage() {
    const params = useParams();
  return (
    <div>{params.name}</div>
  )
}

export default ProjectPage