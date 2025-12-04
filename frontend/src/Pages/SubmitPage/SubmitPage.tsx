import { Link } from "react-router-dom"
import { StopBackend } from "../../aiServices/aiBackendSwitch"

const SubmitPage = () => {
    StopBackend()
    return (
        <div className="flex flex-col h-[80vh] justify-center items-center pb-52">
            <div className="text-3xl font-semibold">
                Test Submitted, Thank You!!!
            </div>
            <div>
                return <Link className="text-bright-sun-400 underline" to='/'>Home</Link>
            </div>
        </div>
    )
}

export default SubmitPage