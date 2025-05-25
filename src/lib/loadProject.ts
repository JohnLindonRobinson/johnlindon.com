import { promises as fs } from 'fs';
import matter from 'gray-matter';
import { marked } from 'marked';

export interface LoadedProject {
  title: string;
  contentHtml: string;
  [key: string]: any;
}

export async function loadProject(slug: string) {
  const res = await fetch(`/api/portfolio/${slug}`);
  if (!res.ok) throw new Error('Project not found');
  return await res.json();
} 