import React, { useContext, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/layouts/AuthLayout'
import Input from '../../components/inputs/Input'
import { validateEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { UserContext } from '../../context/userContext'

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)

    const { updateUser } = useContext(UserContext)

    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError("Please enter a valid email")
            return
        }

        if (!password) {
            setError("Please enter the password")
            return
        }

        setError("")

        try {
            const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
                email,
                password,
            })

            const { token, user } = response.data

            if (token) {
                localStorage.setItem("token", token)
                updateUser(user)
                navigate("/dashboard")
            }
        } catch (err) {
            if (err.response && err.response.data.message) {
                setError(err.response.data.message)
            }
            else {
                setError("Something went wrong. Please try again.")
            }
        }
    }

    return (
        <div className='lg:w-[100%] min-h-[81vh] md:h-full flex flex-col gap-10 items-center justify-start'>
            <div className='flex flex-col items-center pt-10'>
                <h3 className='text-3xl font-semibold text-primary'>Welcome Back!</h3>
                <p className='text-xl text-bright-sun-300 pb-10'>Please enter your details to log in</p>
            </div>

            <form onSubmit={handleLogin} className='w-1/4 flex flex-col items-center'>
                <Input
                    value={email}
                    onChange={({ target }) => setEmail(target.value)}
                    label="Email"
                    placeholder="Enter email"
                    type="text"
                />

                <Input
                    value={password}
                    onChange={({ target }) => setPassword(target.value)}
                    label="Password"
                    placeholder="Min 8 characters"
                    type="password"
                />

                {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

                <button type="submit" className='btn-primary'>
                    Login
                </button>

                <p className="text-[13px] text-mine-shaft-600 mt-3">
                    Don't have an account? {" "}
                    <Link className='font-medium text-primary underline' to="/signUp">
                        SignUp
                    </Link>
                </p>
            </form>
        </div>
    )
}

export default Login