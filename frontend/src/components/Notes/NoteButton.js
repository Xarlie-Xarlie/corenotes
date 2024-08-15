import React from 'react';

function NoteButton({ icon, altText, onClick }) {
  return (
    <img
      className="cursor-pointer size-6"
      src={icon}
      alt={altText}
      onClick={onClick}
    />
  );
}

export default NoteButton;
