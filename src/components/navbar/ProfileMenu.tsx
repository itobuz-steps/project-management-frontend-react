export default function ProfileMenu() {
  return (
    <div className="relative">
      <button
        id="profileBtn"
        className="border-primary-400 flex items-center rounded-full border-3"
      >
        <div className="profile-image h-7 w-7 cursor-pointer rounded-full bg-gray-400 sm:h-9 sm:w-9">
          <img
            id="profileImage"
            src="../assets/img/profile.png"
            alt="Profile Preview"
            className="size-full rounded-full object-cover"
          />
        </div>
      </button>

      <div
        id="dropdownMenu"
        className="absolute right-0 z-50 mt-2 hidden w-40 flex-col gap-3 rounded-sm border border-gray-200 bg-white p-4 shadow-lg"
      >
        <a
          href="./editProfile.html"
          className="block rounded-xs bg-gray-50 p-2 font-medium text-black shadow-sm hover:bg-gray-100"
        >
          Edit Profile
        </a>

        <div className="flex flex-col gap-2">
          <p className="font-semibold">Select a theme:</p>

          <div className="theme-picker flex w-full justify-between gap-0.5">
            {[
              'indigo',
              'custom_2',
              'custom_1',
              'purple',
              'rose',
              'custom_3',
            ].map((theme) => (
              <div
                key={theme}
                data-value={theme}
                className="theme-option aspect-square size-4 rounded-full transition-all hover:scale-110 hover:shadow-md"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
