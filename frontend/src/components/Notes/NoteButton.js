import React from 'react';

function NoteButton({ icon, altText, onClick, isEditing }) {
  return (
    <img
      className={`cursor-pointer overflow-visible p-2 size-10 rounded-full ${isEditing ? 'bg-[#ffe3b3]' : ''}`}
      src={icon}
      alt={altText}
      onClick={onClick}
    />
  );
}

export default NoteButton;
