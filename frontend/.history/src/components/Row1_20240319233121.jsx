const Row1 = () => {
    return (
        <div className="row-1">
            <div className="header">
                <div className="title">List Faculity</div>
            </div>
            <div className="search">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input type="text" className="custom-input" placeholder="Search Faculty" />
            </div>
            <div className="create">
                <button className="custom-button">Create</button>
            </div>
        </div>
    );
}

export default Row1;