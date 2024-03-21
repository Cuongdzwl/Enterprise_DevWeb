const CreateAccount = () => {
    return (
        <>
            <div class="box">
                <div class="box-content">
                    <form action="">
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" name="name" id="name" class="form-control">
                        </div>

                        <div class="form-group">
                            <label for="name">Description</label>
                            <textarea name="" id="" cols="30" rows="10"></textarea>
                        </div>

                        <div class="form-group">
                            <label for="name">Guest</label>
                            <select name="" id="" class="select-guest">
                                <option value="" hidden>Select option</option>
                                <option value="">Yes</option>
                                <option value="">No</option>
                            </select>
                        </div>

                        <div class="form-action">
                            <button type="submit" class="btn">Cancel</button>
                            <button type="submit" disabled class="btn">Create</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default CreateAccount;