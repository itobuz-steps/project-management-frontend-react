import Notifications from './Notifications';
import { CommandPalette } from '../common/CommandPalette';
import { SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';

export default function Navbar() {
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [paletteSearch, setPaletteSearch] = useState('');

  const handleSearchClick = () => {
    setCommandPaletteOpen(true);
  };

  return (
    <div className="header bg-primary-50 mx-2 mt-2 rounded-lg border border-gray-50 md:mx-4 md:mt-4">
      <nav className="flex flex-row items-center justify-end rounded-lg p-2 pl-5 shadow-sm md:px-5 md:py-2">
        <div className="flex items-center gap-1 md:gap-5">
          <SearchOutlined
            onClick={handleSearchClick}
            style={{ fontSize: '1.75rem' }}
          />
          <Notifications />
        </div>
      </nav>
      {isCommandPaletteOpen && (
        <CommandPalette
          open={isCommandPaletteOpen}
          value={paletteSearch}
          onChange={(value) => setPaletteSearch(value)}
          onClose={() => setCommandPaletteOpen(false)}
        />
      )}
    </div>
  );
}
