import { useContext } from "react"
import { UserContext } from "../../context/userContext"
import { useNavigate, useLocation } from "react-router-dom"

const Navbar = () => {
    const { user, clearUser } = useContext(UserContext)
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = () => {
        localStorage.removeItem("token")
        clearUser()
        navigate("/login")
    }

    // Hide logout if URL is like: /test/:examId
    const isExamPage = location.pathname.startsWith("/test")

    return (
        <div className="flex justify-between p-5 pb-0 items-center bg-mine-shaft-950">

            <div className="w-3/12">
                <img
                    src="/pvg_logo.png"
                    className="rounded-lg border border-bright-sun-400"
                    alt="NA"
                    width="80px"
                />
            </div>

            <div className="flex flex-col w-6/12 items-center">
                <div className="font-semibold text-2xl text-bright-sun-400">
                    Pune Vidyarthi Griha's College of Engineering & Technology
                </div>
                <div className="font-medium text-lg text-bright-sun-400">
                    Online Test Platform
                </div>
            </div>

            <div className="flex w-3/12 justify-end gap-4 text-mine-shaft-500">
                {/* Show Logout only if user exists AND not on exam page */}
                {user && !isExamPage && (
                    <button
                        onClick={handleLogout}
                        className="text-mine-shaft-500 hover:text-bright-sun-400 cursor-pointer"
                    >
                        Logout
                    </button>
                )}
            </div>
        </div>
    )
}

export default Navbar