const CreateAccount = () => {
    return (
        <>
            <div className="box">
                <div className="box-content">
                    <form action="">
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input type="text" name="name" id="name" className="form-control" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" name="name" className="form-control" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input type="text" name="name" id="name" className="form-control" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input type="text" name="name" id="name" className="form-control" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input type="text" name="name" id="name" className="form-control" />
                        </div>

                        <div className="form-group">
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