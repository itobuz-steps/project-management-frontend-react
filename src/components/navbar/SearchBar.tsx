import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function SearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState(searchParams.get('searchInput') || '');

  // debounce URL update
  useEffect(() => {
    const timer = setTimeout(() => {
      const next = new URLSearchParams(searchParams);

      if (value.trim()) {
        next.set('searchInput', value.trim());
      } else {
        next.delete('searchInput');
      }

      setSearchParams(next);
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="search-icon flex items-center justify-between">
      <form
        autoComplete="off"
        className="search-input-form bg-gray w-100 rounded-lg text-black sm:w-50 dark:text-neutral-100"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="relative">
          <Search className="absolute top-1/2 left-2 -translate-y-1/2 p-0.5 text-gray-500 dark:text-neutral-400" />
          <input
            type="search"
            placeholder="Search tasks..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="focus:border-primary-400 block w-full rounded-lg border border-gray-200 bg-white px-2 py-3 ps-10 text-sm placeholder:text-gray-500 focus:outline-none dark:border-[#27272e] dark:bg-[#1b1b1f] dark:text-neutral-100 dark:placeholder:text-neutral-400"
          />
        </div>
      </form>
    </div>
  );
}
