import cross from "../../assets/cross.svg";
import noteIcon from "../../assets/note-icon.png";
import searchIcon from "../../assets/search-icon.png";
import { useState } from 'react';

function SearchNotes({ onSearch }) {
  const [searchValue, setSearchValue] = useState('');

  const clearSearch = () => {
    setSearchValue('');
    onSearch('');
  };

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearchClick = () => {
    onSearch(searchValue);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onSearch(searchValue);
    }
  };

  return (
    <header className="bg-white px-2 py-4 sm:px-8 sm:py-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-1 sm:gap-4 grow mx-4 items-center">
          <img className="size-8 md:size-12" src={noteIcon} alt="NoteIcon" />
          <h4 className="invisible h-0 w-0 sm:visible sm:h-fit sm:w-fit text-xs sm:text-xl text-[#455A64]">CoreNotes</h4>
          <div className="flex items-center p-2 grow md:max-w-xl shadow-md border rounded-md border-[#D9D9D9]">
            <input
              className="grow focus:outline-none text-[#9A9A9A]"
              placeholder="Pesquisar notas"
              value={searchValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <img
              className="size-4 sm:size-6 cursor-pointer"
              src={searchIcon}
              alt="SearchIcon"
              onClick={handleSearchClick}
            />
          </div>
        </div>
        <div>
          <img
            className="size-6 md:size-8 cursor-pointer"
            src={cross}
            alt="CrossIcon"
            onClick={clearSearch}
          />
        </div>
      </div>
    </header>
  );
}

export default SearchNotes;
