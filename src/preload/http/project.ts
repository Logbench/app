import axios from 'axios'
import type { Project } from '../types/project'

export async function getProjects(): Promise<Project[]> {
  return axios.get<Project[]>('http://localhost:1338/projects').then((res) => res.data)
}
