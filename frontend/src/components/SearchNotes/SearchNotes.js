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
    <header className="bg-white px-8 py-4">
      <div className="flex justify-between">
        <div className="flex gap-4 grow">
          <img className="size-12" src={noteIcon} alt="NoteIcon" />
          <h4 className="text-xl text-[#455A64] p-2">CoreNotes</h4>
          <div className="flex ml-4  py-2 px-4 grow max-w-xl shadow-md border rounded-md border-[#D9D9D9]">
            <input
              className="grow focus:outline-none text-[#9A9A9A]"
              placeholder="Pesquisar notas"
              value={searchValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <img
              className="size-6 cursor-pointer"
              src={searchIcon}
              alt="SearchIcon"
              onClick={handleSearchClick}
            />
          </div>
        </div>
        <div>
          <img
            className="size-8 my-2 cursor-pointer"
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
