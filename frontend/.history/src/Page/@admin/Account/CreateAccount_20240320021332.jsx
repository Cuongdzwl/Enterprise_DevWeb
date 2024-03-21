const CreateAccount = () => {
    return (
        <>
            <div className="box">
                <div className="box-content">
                    <form action="">
                        <div className="form-group">
                            <label for="name">Name</label>
                            <input type="text" name="name" id="name" className="form-control" />
                        </div>

                        <div className="form-group">
                            <label for="name">Description</label>
                            <textarea name="" id="" cols="30" rows="10"></textarea>
                        </div>

                        <div className="form-group">
                            <label for="name">Guest</label>
                            <select name="" id="" className="select-guest">
                                <option value="" hidden>Select option</option>
                                <option value="">Yes</option>
                                <option value="">No</option>
                            </select>
                        </div>

                        <div className="form-action">
                            <button type="submit" className="btn">Cancel</button>
                            <button type="submit" disabled className="btn">Create</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default CreateAccount;