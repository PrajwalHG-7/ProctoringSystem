import { useContext } from "react"
import { useUserAuth } from "../../hooks/useUserAuth"
import LoadingOverlay from "../../components/loadingOverlay"
import StudentHome from "../../components/Home/StudentHome"
import TeacherHome from "../../components/Home/TeacherHome"
import { UserContext } from "../../context/userContext"

const Home = () => {
    useUserAuth()
    const { user } = useContext(UserContext)

    if (!user) {
        return (
            <div>
                <LoadingOverlay />
            </div>
        )
    }

    return user.role === "student"
        ? <StudentHome />
        : <TeacherHome />
}

export default Home