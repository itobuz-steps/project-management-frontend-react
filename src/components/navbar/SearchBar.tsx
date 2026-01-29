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
        className="search-input-form w-40 rounded-lg bg-white text-black shadow-sm sm:w-80"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="relative">
          <input
            type="search"
            placeholder="Search by key, title or description"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="block w-full rounded-lg px-2 py-2 ps-6 text-sm"
          />
        </div>
      </form>
    </div>
  );
}
