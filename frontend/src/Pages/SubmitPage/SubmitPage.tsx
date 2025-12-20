import { Link } from "react-router-dom"

const SubmitPage = () => {
    return (
        <div className="flex flex-col h-[80vh] justify-center items-center pb-52">
            <div className="text-3xl text-mine-shaft-700 font-semibold">
                Test Submitted, Thank You!!!
            </div>
            <div>
                <Link className="text-bright-sun-400 underline" to='/'>Home</Link>
            </div>
        </div>
    )
}

export default SubmitPage