import { Icon } from '@iconify/react';
import parse from 'html-react-parser';
import Link from 'next/link';
import { PostType } from '@/types/blog';

import { Byline } from '@/components/common/Byline';

type Props = {
  posts: PostType[];
  parent?: boolean;
};

export const isDoi = (doi: any) => {
  try {
    return new URL(doi).hostname === 'doi.org';
  } catch (error) {
    return false;
  }
};

export const Posts: React.FunctionComponent<Props> = ({ posts, parent = false }) => {
  return (
    <>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {!parent && (
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">The Rogue Scholar Posts</h2>
          </div>
        )}
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <div className="space-t-10 lg:space-t-10 mt-4 lg:mt-6">
            {posts.map((post) => (
              <article key={post.id} className="relative mb-8 flex gap-6 lg:flex-row">
                {post.image && (
                  <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0">
                    <img
                      src={post.image}
                      alt=""
                      className="absolute inset-0 h-full w-full rounded-2xl bg-gray-50 object-cover"
                    />
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                  </div>
                )}
                <div>
                  {post.tags && (
                    <div className="flex items-center gap-x-1 text-xs">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="relative z-10 ml-0 rounded-full bg-blue-100 px-2 py-0.5 font-medium text-blue-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="group relative max-w-3xl">
                    {!parent && post.blog && (
                      <h2 className="mt-1 text-2xl font-bold leading-6 text-blue-600 group-hover:text-blue-700">
                        <Link href={'/blogs/' + post.blog.id}>{post.blog.title}</Link>
                      </h2>
                    )}
                    <h3 className="mt-1 text-xl font-semibold leading-7 text-gray-900 group-hover:text-gray-600">
                      <Link href={post.id}>
                        {post.title}
                        {isDoi(post.id) && (
                          <Icon icon="academicons:doi" className="ml-0.5 inline text-base text-[#f0b941]" />
                        )}
                      </Link>
                    </h3>
                    <Byline authors={post.authors} datePublished={post.date_published} />
                    {post.summary && (
                      <p className="text-medium mt-2 leading-6 text-gray-900">{parse(String(post.summary))}</p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
