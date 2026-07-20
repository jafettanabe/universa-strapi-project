import type { Core } from '@strapi/strapi';
import fs from 'fs';
import path from 'path';

export async function seedBlogPostsFromFrontend(strapi: Core.Strapi) {
  const logFile = path.resolve(process.cwd(), '.tmp/seeder-log.txt');
  const writeLog = (content: string) => {
    try {
      const dir = path.dirname(logFile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(logFile, content, 'utf8');
    } catch (e) {
      // Ignore log file writing errors in read-only / deployment environments
    }
  };

  let logContent = `Seeder started at ${new Date().toISOString()}\n`;
  logContent += `cwd: ${process.cwd()}\n`;

  const jsonPath = path.resolve(process.cwd(), '../universa-portal/src/data/blog-posts.json');
  logContent += `Checking JSON path: ${jsonPath} (exists: ${fs.existsSync(jsonPath)})\n`;
  
  if (!fs.existsSync(jsonPath)) {
    logContent += `Error: json file not found.\n`;
    writeLog(logContent);
    strapi.log.info(`[blog-posts-seed] Archivo local JSON del frontend no encontrado en: ${jsonPath}. Se omite el semillado.`);
    return;
  }

  try {
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const posts = JSON.parse(rawData);
    logContent += `Found ${posts?.length} posts in JSON.\n`;

    if (!Array.isArray(posts)) {
      logContent += `Error: posts is not an array.\n`;
      fs.writeFileSync(logFile, logContent, 'utf8');
      strapi.log.warn('[blog-posts-seed] El contenido del archivo JSON no es una lista válida.');
      return;
    }

    const doc = strapi.documents.bind(strapi);

    for (const post of posts) {
      const cleanSlug = (post.slug || '').replace(/^\/+/, '');
      logContent += `Processing post: ${cleanSlug}\n`;
      
      // Convertir content a string si viene como objeto/array JSON en el archivo
      const contentValue = typeof post.content === 'string' ? post.content : JSON.stringify(post.content);

      // Validar si ya existe el artículo por su slug
      const existing = await doc('api::blog-post.blog-post').findFirst({
        filters: { slug: cleanSlug },
      });

      const postData = {
        title: post.title,
        slug: cleanSlug,
        excerpt: post.excerpt,
        content: contentValue,
        authorName: post.authorName,
        category: post.category,
        featured: post.featured || false,
        seo: post.seo ? {
          metaTitle: post.seo.metaTitle,
          metaDescription: post.seo.metaDescription,
          noIndex: post.seo.noIndex || false,
          canonicalUrl: post.seo.canonicalUrl || null,
        } : undefined,
        publishedAt: new Date(post.createdAt || Date.now()),
      };

      if (existing) {
        logContent += `  Post already exists in DB (documentId: ${existing.documentId}). Updating fields...\n`;
        strapi.log.info(`[blog-posts-seed] Actualizando artículo en CMS: "${post.title}"…`);
        await doc('api::blog-post.blog-post').update({
          documentId: existing.documentId,
          data: postData,
        });
        continue;
      }

      logContent += `  Creating post in DB...\n`;
      strapi.log.info(`[blog-posts-seed] Semillando artículo en CMS: "${post.title}"…`);
      const created = await doc('api::blog-post.blog-post').create({
        data: postData,
        status: 'published',
      });
      logContent += `  Created successfully (documentId: ${created.documentId}).\n`;
    }
    logContent += `Seeder finished successfully.\n`;
  } catch (error) {
    logContent += `Error during execution: ${String(error)}\n`;
    strapi.log.error(`[blog-posts-seed] Error al ejecutar el semillado de blogs: ${String(error)}`);
  }

  writeLog(logContent);
}
