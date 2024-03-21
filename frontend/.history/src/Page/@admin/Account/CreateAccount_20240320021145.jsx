const CreateAccount = () => {
    return (
        <>
            <div class="box detail">
                <div class="box-content contribution detail">
                    <form action="">
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" name="name" id="name" class="form-control" readonly>
                        </div>

                        <div class="form-group">
                            <label for="name">Content</label>
                            <textarea name="" id="" cols="30" rows="10" readonly></textarea>
                        </div>

                        <div class="form-group" style="margin-bottom: 116px;">
                            <label for="name">Image</label>
                            <div class="image"></div>
                        </div>

                        <div class="form-action">
                            <button type="submit" class="btn">Back</button>
                        </div>

                    </form>
                    <div class="content-right">
                        <table class=" date-time">
                            <tbody>
                                <tr>
                                    <td class="label">Closure Date</td>
                                    <td class="value">Saturday, 8 April 2023, 11:59 PM</td>
                                </tr>
                                <tr>
                                    <td class="label">Due Date</td>
                                    <td class="value">Sunday, 9 April 2023, 11:59 PM</td>
                                </tr>
                                <tr>
                                    <td class="label">Time Remaining</td>
                                    <td class="value">Contribution was submitted 7 hours 35 mins</td>
                                </tr>
                                <tr>
                                    <td class="label">Last Modified</td>
                                    <td class="value">Sunday, 9 April 2023, 4:23 PM</td>
                                </tr>
                            </tbody>
                        </table>

                        <div class="content-flex">
                            <div class="form-group">
                                <label for="file">File</label>
                                <input type="text" name="name" id="name" class="form-control" readonly>
                            </div>
                            <div class="download">
                                <a href="" download="">
                                    <i class="fa-solid fa-file-arrow-down"></i>
                                </a>
                            </div>
                        </div>

                        <form action="">
                            <div class="form-group comments">
                                <label for="name">Comments (3)</label>
                                <div class="list-comment">
                                    <div class="comment-item">
                                        <div class="user">Nguyen Van A</div>
                                        <div class="description">You should find another procedure.</div>
                                    </div>
                                    <!-- test -->
                                    <div class="comment-item">
                                        <div class="user">Nguyen Van A</div>
                                        <div class="description">You should find another procedure.</div>
                                    </div>
                                    <div class="comment-item">
                                        <div class="user">Nguyen Van A</div>
                                        <div class="description">You should find another procedure.</div>
                                        <!--  -->
                                    </div>
                                </div>

                                <div style="position: relative;">
                                    <input type="text" name="name" id="name" class="form-control"
                                        placeholder="Write a comment...">
                                        <button type="submit">
                                            <i class="fa-solid fa-paper-plane"></i>
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