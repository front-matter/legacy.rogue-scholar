import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { PaginationType } from '@/types/blog';

type Props = {
  base_url: string;
  pagination: PaginationType;
};

export default function Pagination({ base_url, pagination }: Props) {
  const { t } = useTranslation('common');

  return (
    <div className="mx-auto max-w-2xl lg:max-w-4xl">
      <nav className="flex items-center justify-between bg-white py-3" aria-label="Pagination">
        <div className="hidden sm:block">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">page {pagination.page}</span> out of{' '}
            <span className="font-medium">{pagination.pages}</span> pages.
          </p>
        </div>
        <div className="flex flex-1 justify-between sm:justify-end">
          {pagination.prev && (
            <Link
              className="relative inline-flex items-center rounded-md bg-white px-2 py-1 text-sm font-medium text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
              href={`${base_url}?page=${pagination.prev}`}
            >
              Previous
            </Link>
          )}
          {pagination.next && (
            <Link
              className="relative ml-1 inline-flex items-center rounded-md bg-white px-2 py-1 text-sm font-medium text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
              href={`${base_url}?page=${pagination.next}`}
            >
              Next
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
