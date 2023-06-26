import { useRef } from 'react';
import { useQueryState } from 'next-usequerystate';
import { Icon } from '@iconify/react';

export default function Search({ base_url }: Props) {
  const [query, setQuery] = useQueryState('query');
  console.log(query);
  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = () => {
    setQuery(inputRef.current?.value);
  };

  const onKeyDown = (event) => {
    if (event.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <div className="mx-auto max-w-2xl lg:max-w-4xl relative">
          <Icon icon="fa6-solid:magnifying-glass" className="absolute top-2 left-2 h-5 w-5 text-gray-400" />
          <input
            id="search"
            placeholder="Search..."
            className="block w-full bg-white border border-gray-400 rounded-md mt-3 py-2 pl-9 text-base placeholder-gray-900 focus:outline-none focus:text-gray-900 focus:placeholder-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            onSubmit={onSubmit}
            onKeyDown={onKeyDown}
            ref={inputRef}
          />
        </div>
  );
}
