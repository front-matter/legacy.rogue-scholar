import { Icon } from '@iconify/react';
import parse from 'html-react-parser';
import Link from 'next/link';
import { BlogType } from '@/types/blog';

type Props = {
  blog: BlogType;
};

export const generators: { [key: string]: string; } = {
  WordPress: 'https://wordpress.org/',
  Ghost: 'https://ghost.org/',
  Jekyll: 'https://jekyllrb.com/',
  Hugo: 'https://gohugo.io/',
  Blogger: 'https://www.blogger.com/',
  Medium: 'https://medium.com/',
  Quarto: 'https://quarto.org/',
  Distill: 'https://rstudio.github.io/distill/',
};

export const languages: { [key: string]: string; } = {
  en: 'English',
  'en-US': 'English',
  'en-GB': 'English',
  de: 'Deutsch',
  'de-DE': 'Deutsch',
  es: 'Español',
  fr: 'Français',
  it: 'Italiano',
  ja: '日本語',
  ko: '한국어',
  nl: 'Nederlands',
  pt: 'Português',
  ru: 'Русский',
  zh: '中文',
};

export const feedFormats: { [key: string]: string; } = {
  'application/rss+xml': 'RSS',
  'application/atom+xml': 'Atom',
  'application/feed+json': 'JSON',
};

export const Blog: React.FunctionComponent<Props> = ({ blog }) => {
  return (
    <div className="bg-inherit pt-4">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <div className="relative flex items-center gap-x-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {parse(String(blog.title))}
              </h2>
            </div>
            {blog.favicon && (
              <img className="h-10 w-10 rounded-full bg-transparent" src={blog.favicon} alt={blog.title} />
            )}
          </div>
          <div className="-mt-px">
            {blog.category && (
              <span className="inline-block flex-shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                {blog.category}
              </span>
            )}
            {blog.language && (
              <span className="ml-1 inline-block flex-shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                {languages[blog.language]}
              </span>
            )}
            {blog.description && (
              <div className="mt-1 text-lg leading-normal text-gray-600">{parse(String(blog.description))}</div>
            )}
          </div>
          <div className="mt-2">
            <span className="text-gray-500">
              <Link
                href={blog.home_page_url ?? ''}
                target="_blank"
                className="relative mr-6 w-0 py-2 text-base font-medium"
              >
                <Icon icon="fa6-solid:house" className="inline" />
                <span className="ml-2">Home Page</span>
              </Link>
            </span>
            {blog.feed_url && blog.feed_format && (
              <span className="-ml-px text-gray-500">
                <Link href={blog.feed_url} target="_blank" className="relative mr-6 w-0 py-2 text-base font-medium">
                  <Icon icon="fa6-solid:rss" className="inline" />
                  <span className="ml-2">{feedFormats[blog.feed_format] + ' Feed'}</span>
                </Link>
              </span>
            )}
            {blog.generator && (
              <span className="text-gray-500">
                <Link
                  href={generators[blog.generator] ?? ''}
                  target="_blank"
                  className="relative mr-6 py-2 text-base font-medium text-gray-500"
                >
                  <Icon icon="fa6-solid:rocket" className="inline" />
                  <span className="ml-2">{blog.generator}</span>
                </Link>
              </span>
            )}
            {blog.license && (
              <span className="text-gray-500">
                <Link
                  href="https://creativecommons.org/licenses/by/4.0/legalcode"
                  target="_blank"
                  className="relative mr-6 py-2 text-base font-medium"
                >
                  <Icon icon="fa6-brands:creative-commons" className="inline font-bold" />
                  <Icon icon="fa6-brands:creative-commons-by" className="ml-0.5 inline font-bold" />
                  <span className="ml-2">License</span>
                </Link>
              </span>
            )}
            {!blog.license && (
              <span className="text-orange-600">
                <Icon icon="fa-solid:copyright" className="inline" />
                <span className="ml-2 mr-6">License not confirmed</span>
              </span>
            )}
            {blog.indexed_at && (
              <span className="text-gray-500 font-medium">
                <Icon icon="fa6-regular:calendar-plus" className="inline" />
                <time className="ml-2 mr-6" dateTime={blog.indexed_at.toString()}>
                  {new Date(blog.indexed_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </span>
            )}
            {blog.modified_at && blog.modified_at > '1970-01-02' && (
              <span className="text-gray-500 font-medium">
                <Icon icon="fa6-regular:calendar-check" className="inline" />
                <time className="ml-2 mr-6" dateTime={blog.modified_at.toString()}>
                  {new Date(blog.modified_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
