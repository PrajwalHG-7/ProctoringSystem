import { Button } from "@mantine/core"
import Header from "../../components/Header/Header"
import { Link } from "react-router-dom"

const StartPage = () => {
    return (
        <div className="flex min-h-full w-full justify-center items-center p-10">
            <div className="flex flex-col pb-32 w-1/2 h-[73vh] justify-center">
                <div className="text-5xl font-extrabold text-center">
                    Test yourself now!
                </div>
            </div>
            <div className="w-1/2 pt-32 text-center">
                <Link to="/test">
                    <Button h={100} w={450}><div className="text-3xl text-mine-shaft-950 font-bold">Start Test!</div></Button>
                </Link>
            </div>
        </div>
    )
}

export default StartPage