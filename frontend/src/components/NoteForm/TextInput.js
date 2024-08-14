import React from 'react';

const TextInput = ({ value, onChange, onKeyDown, placeholder, required = false }) => (
  <input
    className="w-full focus:outline-none placeholder-black"
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    onKeyDown={onKeyDown}
    required={required}
  />
);

export default TextInput;
