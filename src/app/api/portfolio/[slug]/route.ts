import { promises as fs } from 'fs';
import matter from 'gray-matter';
import { marked } from 'marked';
import path from 'path';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, context: { params: { slug: string } }) {
  const params = await context.params;
  const slug = params.slug;
  try {
    const filePath = path.join(process.cwd(), 'content/portfolio', `${slug}.md`);
    const file = await fs.readFile(filePath, 'utf-8');
    const { content, data } = matter(file);
    const contentHtml = marked(content);
    return new Response(JSON.stringify({ ...data, contentHtml }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  }
} 