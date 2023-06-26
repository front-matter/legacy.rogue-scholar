import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { PaginationType } from '@/types/blog';

type Props = {
  pagination: PaginationType;
};

export default function Pagination({ pagination }: Props) {
  const { t } = useTranslation('common');
  const from = pagination.page * 15 - 15 + 1;
  const to = pagination.page * 15 > pagination.total ? pagination.total : pagination.page * 15;

  return (
    <div className="mx-auto max-w-2xl lg:max-w-4xl">
      <nav className="flex items-center justify-between bg-white pt-1 pb-3" aria-label="Pagination">
        <div className="hidden sm:block">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{from}</span> to <span className="font-medium">{to}</span> of{' '}
            <span className="font-medium">{pagination.total}</span> results
          </p>
        </div>
        <div className="flex flex-1 justify-between sm:justify-end">
          {pagination.prev && (
            <Link
              className="relative inline-flex items-center rounded-md bg-white px-2 py-1 text-sm font-medium text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
              href={`${pagination.base_url}?page=${pagination.prev}&query=${pagination.query}`}
            >
              Previous
            </Link>
          )}
          {pagination.next && (
            <Link
              className="relative ml-1 inline-flex items-center rounded-md bg-white px-2 py-1 text-sm font-medium text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
              href={`${pagination.base_url}?page=${pagination.next}&query=${pagination.query}`}
            >
              Next
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
