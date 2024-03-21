const CreateAccount = () => {
    return (
        <>
            <div className="box detail">
                <div className="box-content contribution detail">
                    <form action="">
                        <div className="form-group">
                            <label for="name">Name</label>
                            <input type="text" name="name" id="name" className="form-control" readonly/>
                        </div>

                        <div className="form-group">
                            <label for="name">Content</label>
                            <textarea name="" id="" cols="30" rows="10" readonly></textarea>
                        </div>

                        <div className="form-group" style="margin-bottom: 116px;">
                            <label for="name">Image</label>
                            <div className="image"></div>
                        </div>

                        <div className="form-action">
                            <button type="submit" className="btn">Back</button>
                        </div>

                    </form>
                    <div className="content-right">
                        <table className=" date-time">
                            <tbody>
                                <tr>
                                    <td className="label">Closure Date</td>
                                    <td className="value">Saturday, 8 April 2023, 11:59 PM</td>
                                </tr>
                                <tr>
                                    <td className="label">Due Date</td>
                                    <td className="value">Sunday, 9 April 2023, 11:59 PM</td>
                                </tr>
                                <tr>
                                    <td className="label">Time Remaining</td>
                                    <td className="value">Contribution was submitted 7 hours 35 mins</td>
                                </tr>
                                <tr>
                                    <td className="label">Last Modified</td>
                                    <td className="value">Sunday, 9 April 2023, 4:23 PM</td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="content-flex">
                            <div className="form-group">
                                <label for="file">File</label>
                                <input type="text" name="name" id="name" className="form-control" readonly>
                            </div>
                            <div className="download">
                                <a href="" download="">
                                    <i className="fa-solid fa-file-arrow-down"></i>
                                </a>
                            </div>
                        </div>

                        <form action="">
                            <div className="form-group comments">
                                <label for="name">Comments (3)</label>
                                <div className="list-comment">
                                    <div className="comment-item">
                                        <div className="user">Nguyen Van A</div>
                                        <div className="description">You should find another procedure.</div>
                                    </div>
                                    <!-- test -->
                                    <div className="comment-item">
                                        <div className="user">Nguyen Van A</div>
                                        <div className="description">You should find another procedure.</div>
                                    </div>
                                    <div className="comment-item">
                                        <div className="user">Nguyen Van A</div>
                                        <div className="description">You should find another procedure.</div>
                                        <!--  -->
                                    </div>
                                </div>

                                <div style="position: relative;">
                                    <input type="text" name="name" id="name" className="form-control"
                                        placeholder="Write a comment...">
                                        <button type="submit">
                                            <i className="fa-solid fa-paper-plane"></i>
                                        </button>
                                </div>
                            </div>
                        </form>
                    </div>


                </div>
            </div>
        </>
    );
}

export default CreateAccount;