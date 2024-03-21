import Search from "./components/Search"

const Heading = () => {
    return (
        <div className="row-1">
            <div className="header">
                <div className="title">List Faculity</div>
            </div>
            <Search />
            <div className="create">
                <button className="custom-button">Create</button>
            </div>
        </div>
    );
}

export default Heading;