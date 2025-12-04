import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/layouts/AuthLayout'
import Input from '../../components/inputs/Input'
import ProfilePhotoSelector from '../../components/inputs/ProfilePhotoSelector'
import { validateEmail } from '../../utils/helper'
import { API_PATHS } from '../../utils/apiPaths'
import axiosInstance from '../../utils/axiosInstance'
import { UserContext } from '../../context/userContext'
import uploadImage from '../../utils/uploadImage'

const SignUp = () => {
    const [profilePic, setProfilePic] = useState(null)
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("")

    const { updateUser } = useContext(UserContext)

    const [error, setError] = useState(null)

    const navigate = useNavigate()

    const handleSignUp = async (e) => {
        e.preventDefault()

        let profileImageUrl = ""

        if (!fullName) {
            setError("Please enter your name")
            return
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email")
            return
        }

        if (!password) {
            setError("Please enter the password")
            return
        }

        if (!role) {
            setError("Please select your role")
            return
        }

        setError("")

        try {

            if (profilePic) {
                const imgUploadRes = await uploadImage(profilePic)
                profileImageUrl = imgUploadRes.imageUrl || ""
            }

            const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
                fullName,
                email,
                password,
                role,
                profileImageUrl
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
        <div className="w-full min-h-[81vh] md:h-full md:mt-0 flex flex-col items-center justify-center">
            <h3 className="text-3xl font font-semibold text-primary">Create an Account</h3>

            <p className="text-xl text-bright-sun-300 pb-10 mt-[5px]">
                Join us today by entering details below.
            </p>

            <form onSubmit={handleSignUp} className='flex flex-col items-center'>
                <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

                <div className="grid grid-cols-1 min-w-[100vh] md:grid-cols-2 gap-4">
                    <Input
                        value={fullName}
                        onChange={({ target }) => setFullName(target.value)}
                        label="Full Name"
                        placeholder="Enter name"
                        type="text"
                    />

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

                    <Input
                        value={role}
                        onChange={({ target }) => setRole(target.value)}
                        label="User Role"
                        placeholder="Select your role"
                        type="role"
                    />
                </div>

                {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

                <button type="submit" className='btn-primary'>
                    Sign Up
                </button>

                <p className="text-[13px] text-mine-shaft-600 mt-3">
                    Already have an account? {" "}
                    <Link className='font-medium text-primary underline' to="/login">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    )
}

export default SignUp