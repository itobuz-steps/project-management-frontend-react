export default function SearchBar() {
  return (
    <div className="search-icon flex items-center justify-between">
      <form
        id="search-input-form"
        autoComplete="off"
        className="search-input-form w-40 rounded-lg bg-white text-black shadow-sm placeholder:text-neutral-600 max-[640px]:w-60 max-[420px]:w-40 sm:w-80 md:w-100 lg:w-120"
      >
        <div className="relative">
          <input
            type="search"
            id="search-input-field"
            placeholder="Search"
            className="bg-neutral-secondary-medium text-heading placeholder:text-body focus-visible:outline-primary-200 block w-full rounded-lg px-2 py-2 ps-6 text-sm focus-visible:outline-2 max-md:p-2"
          />
        </div>
      </form>
    </div>
  );
}
