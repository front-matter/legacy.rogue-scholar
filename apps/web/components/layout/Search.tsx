import { useRef, useState } from 'react';
import { useQueryState, queryTypes } from 'next-usequerystate';
import { Icon } from '@iconify/react';

export default function Search() {
  const [query, setQuery] = useQueryState('query');
  const [page, setPage] = useQueryState('page', queryTypes.integer)
  console.log(query, page)
  const [searchInput, setSearchInput] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onSubmit = () => {
    setQuery(inputRef.current?.value ?? '');
  };

  const onKeyDown = (event) => {
    if (event.key === 'Enter') {
      onSubmit();
    }
  };

  const onSearchChange = () => {
    setPage(1)
    setSearchInput(inputRef.current?.value ?? '')
  };

  const onSearchClear = () => {
    setQuery('')
    setSearchInput('')
    inputRef.current?.focus();
  };

  return (
    <div className="mx-auto max-w-2xl lg:max-w-4xl relative">
      <Icon icon="fa6-solid:magnifying-glass" className="absolute top-3 left-3 h-5 w-5 text-gray-500" />
      {searchInput !== '' && (
        <span id="search-clear" title="Clear" aria-label="Clear" onClick={onSearchClear}>
          <Icon icon="fa6-solid:xmark" className="absolute top-3 right-3 h-5 w-5 text-gray-500" />
        </span>
      )}
      <input
        id="search"
        placeholder={'Type to search...'}
        value={searchInput}
        onChange={onSearchChange}
        className="block w-full bg-white border border-gray-400 rounded-md mt-3 py-2 pl-10 text-base placeholder-gray-500 focus:outline-none focus:text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        onSubmit={onSubmit}
        onKeyDown={onKeyDown}
        ref={inputRef}
      />
    </div>
  );
}
