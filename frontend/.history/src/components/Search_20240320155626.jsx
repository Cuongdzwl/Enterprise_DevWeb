import React from 'react';

const Search = ({ placeholder, value, onChange }) => {
    return (
        <div className="search">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input
                        type="text"
                        className="custom-input"
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                    />
                </div>
    );
}

export default Search;
