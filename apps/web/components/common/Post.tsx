import { Icon } from '@iconify/react';
import parse from 'html-react-parser';
import Link from 'next/link';
import { PostType } from '@/types/blog';

import { Byline } from '@/components/common/Byline';

type Props = {
  post: PostType;
};

export const isDoi = (doi: any) => {
  try {
    return new URL(doi).hostname === 'doi.org';
  } catch (error) {
    return false;
  }
};

export const Post: React.FunctionComponent<Props> = ({ post }) => {
  return (
    <>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <div className="space-t-10 lg:space-t-10 mt-10 lg:mt-12">
            <article key={post.id} className="relative mb-8 flex gap-6 lg:flex-row">
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
                  <h3 className="mt-2 text-xl font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                    <Link href={post.id}>
                      {post.title}
                      {isDoi(post.id) && <Icon icon="academicons:doi" className="ml-0.5 inline text-base text-[#f0b941]" />}
                    </Link>
                  </h3>
                  <Byline authors={post.authors} datePublished={post.date_published} />
                  {post.content_html && (
                    <p className="text-medium mt-2 leading-6 text-gray-900">{parse(String(post.content_html))}</p>
                  )}
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </>
  );
};
