const CreateAccount = () => {
    return (
        <>
            <div className="box">
                <div className="box-content">
                    <form action="">
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input type="text" name="name" className="form-control" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" className="form-control" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Phone</label>
                            <input type="text" name="phone" className="form-control" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="name">Address</label>
                            <input type="text" name="address" className="form-control" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="name">Role</label>
                            <input type="text" name="" id="name" className="form-control" />
                            <select name="role" id="">
                                <option value="" hidden>Select</option>

                            </select>
                        </div>

                        <div className="form-group mb-input">
                            <label htmlFor="name">Name</label>
                            <input type="text" name="name" id="name" className="form-control" />
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