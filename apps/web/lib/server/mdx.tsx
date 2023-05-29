import { readdir, readFile } from 'fs/promises';
import matter from 'gray-matter';
import sizeOf from 'image-size';
import { GetStaticPathsContext, GetStaticPropsContext } from 'next';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import path from 'path';
import rehypeImgSize from 'rehype-img-size';

export type MdxEntry = {
  slug: string;
  source: MDXRemoteSerializeResult;
  frontMatter: Record<string, any>;
};

async function readMdxFile(dir: string, slug: string, locale?: string) {
  if (locale)
    try {
      return await readFile(path.join(dir, locale, `${slug}.mdx`), 'utf8');
    } catch {}

  try {
    return await readFile(path.join(dir, `${slug}.mdx`), 'utf8');
  } catch {}

  return null;
}

export function getImageSize(src: string, dir?: string) {
  const absolutePathRegex = /^(?:[a-z]+:)?\/\//;

  if (absolutePathRegex.exec(src)) return;

  const shouldJoin = !path.isAbsolute(src) || src.startsWith('/');

  if (dir && shouldJoin) src = path.join(dir, src);

  return sizeOf(src);
}

export async function getMdxStaticProps(
  ctx: GetStaticPropsContext,
  dir: string,
  slug?: string
): Promise<MdxEntry | null> {
  const { locale, defaultLocale } = ctx;

  if (!slug) return null;

  const fileContent = await readMdxFile(dir, slug, locale !== defaultLocale ? locale : undefined);

  if (!fileContent) return null;

  const { content, data: frontMatter } = matter(fileContent);
  const source = await serialize(content, {
    mdxOptions: {
      rehypePlugins: [[rehypeImgSize as any, { dir: 'public' }]],
    },
  });

  return {
    slug,
    source,
    frontMatter,
  };
}

export async function getMdxStaticPaths(ctx: Pick<GetStaticPathsContext, 'locales' | 'defaultLocale'>, dir: string) {
  const paths: Array<{
    params: any;
    locale?: string;
  }> = [];
  const locales = ctx.locales ?? [];

  await Promise.all(
    locales.map(async (locale) => {
      const isDefaultLocale = locale === ctx.defaultLocale;

      try {
        const files = await readdir(path.join(process.cwd(), `${dir}${isDefaultLocale ? '' : `/${locale}`}`));

        files.forEach((file) => {
          if (!file.endsWith('.mdx')) return;

          paths.push({ params: { slug: file.replace('.mdx', ''), locale: isDefaultLocale ? undefined : locale } });
        });
      } catch {}
    })
  );

  return paths;
}

export async function getAllMdxEntries(ctx: GetStaticPropsContext, dir: string): Promise<MdxEntry[]> {
  const paths = await getMdxStaticPaths(ctx, dir);
  const entries = (
    await Promise.all(
      paths.map(async ({ params: { slug } }) => {
        return await getMdxStaticProps(ctx, dir, slug);
      })
    )
  ).filter((entry) => entry !== null);

  return entries as MdxEntry[];
}
