import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'

const Input = ({ value, onChange, placeholder, label, type }) => {
    const [showPassword, setShowPassword] = useState(false)

    const toggleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    if (type === "role") {
        return (
            <div className="w-full">
                <label className="text-xl text-primary">{label}</label>

                <div className="flex items-center gap-6 mt-2">

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="role"
                            value="student"
                            checked={value === "student"}
                            onChange={(e) => onChange(e)}
                        />
                        <span className="text-lg text-primary">Student</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="role"
                            value="teacher"
                            checked={value === "teacher"}
                            onChange={(e) => onChange(e)}
                        />
                        <span className="text-lg text-primary">Teacher</span>
                    </label>

                </div>
            </div>
        )
    }

    return (
        <div className='w-full'>
            <label className='text-xl text-primary'>{label}</label>

            <div className="input-box">
                <input
                    type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
                    placeholder={placeholder}
                    className={
                        type === 'password'
                            ? showPassword
                                ? "w-full text-lg bg-transparent outline-none"
                                : "w-full text-lg text-primary bg-transparent outline-none"
                            : "w-full text-lg bg-transparent outline-none"
                    }
                    value={value}
                    onChange={(e) => onChange(e)}
                />

                {type === "password" && (
                    <>
                        {showPassword ? (
                            <FaRegEye
                                size={22}
                                className='text-primary cursor-pointer'
                                onClick={toggleShowPassword}
                            />
                        ) : (
                            <FaRegEyeSlash
                                size={22}
                                className='text-mine-shaft-400 cursor-pointer'
                                onClick={toggleShowPassword}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default Input