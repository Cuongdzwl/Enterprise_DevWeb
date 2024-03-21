import React from 'react';

const Heading = ({ title, button, redirect, showSearch, showCreate, placeholder, onSearchChange }) => {
    const handleClick = () => {
        if (redirect && showCreate) {
            navigate(redirect);
        }
    };

    const handleSearchChange = (event) => {
        onSearchChange(event.target.value);
    };

    return (
        <div className="row-1">
            <div className="header">
                <div className="title">{title}</div>
            </div>
            {showSearch && (
                <div className="search">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input
                        type="text"
                        className="custom-input"
                        placeholder={placeholder}
                        onChange={handleSearchChange}
                    />
                </div>
            )}
            {showCreate && (
                <div className="create">
                    <button className="custom-button" onClick={handleClick}>{button}</button>
                </div>
            )}
        </div>
    );
};

export default Heading;
