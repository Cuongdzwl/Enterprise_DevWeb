const Row1 = () => {
    return (
        <div class="row-1">
            <div class="header">
                <div class="title">List Faculity</div>
            </div>
            <div class="search">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input type="text" class="custom-input" placeholder="Search Faculty" />
            </div>
            <div class="create">
                <button class="custom-button">Create</button>
            </div>
        </div>
    );
}

export default Row1;