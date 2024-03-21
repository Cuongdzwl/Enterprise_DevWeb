import React, { useState } from 'react';
import FormInput from '../../../components/FormInput';


const CreateAccount = () => {
    const roles = [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
    ];


    const faculties = [
        { label: "Faculty of Information Technology", value: "it" },
        { label: "Faculty of Business Administration", value: "ba" },
        { label: "Faculty of International Education", value: "ie" },
    ];
    ]
    return (
        <>
            <div className="box">
                <div className="box-content">
                    <form onSubmit={handleSubmit}>
                        <FormInput label="Name" type="text" name="name" value={formData.name} onChange={handleChange} />
                        <FormInput label="Email" type="email" name="email" value={formData.email} onChange={handleChange} />
                        <FormInput label="Phone" type="text" name="phone" value={formData.phone} onChange={handleChange} />
                        <FormInput label="Address" type="text" name="address" value={formData.address} onChange={handleChange} />
                        <FormInput label="Role" type="select" name="role" options={roles} value={formData.role} onChange={handleChange} placeholder="Select Role" />
                        <FormInput label="Faculty" type="select" name="faculty" options={faculties} value={formData.faculty} onChange={handleChange} placeholder="Select Faculty" />
                        <div className="form-action">
                            <button type="submit" className="btn">Cancel</button>
                            <button type="submit" disabled={!isFormValid} className="btn">Create</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default CreateAccount;