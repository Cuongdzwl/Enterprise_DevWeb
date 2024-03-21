import React from 'react';

const Search = ({ placeholder, value, onChange }) => {
    return (
        <div className="search">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input
                        type="text"
                        className="custom-input"
                        placeholder="Search Account"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
    );
}

placeholder="Search Account"
                        value={searchTerm}
                        onChange={handleSearchChange}

export default Search;
