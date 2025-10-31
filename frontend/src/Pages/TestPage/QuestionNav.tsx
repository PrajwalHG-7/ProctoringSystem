import { Button, px } from "@mantine/core"
import { Link, useNavigate } from "react-router-dom"

const QuestionNav = () => {
    const navigate = useNavigate()
    return (
        <div className="flex flex-col w-2/12 gap-8">
            <div className="flex flex-col w-full h-fit bg-mine-shaft-800 rounded-xl items-start p-5">
                <div className="w-fit h-fit flex flex-wrap gap-5">
                    <Button variant="outline">Q1</Button>
                    <Button color="bright-sun.4" variant="outline">Q1</Button>
                    <Button variant="outline">Q1</Button>
                    <Button variant="outline">Q1</Button>
                    <Button variant="outline">Q1</Button>
                    <Button variant="outline">Q1</Button>
                    <Button variant="outline">Q1</Button>
                    <Button variant="outline">Q1</Button>
                    <Button variant="outline">Q1</Button>
                </div>
            </div>
            <div className="w-full h-fit">
                <Link to="/submit" onClick={() => {
                        navigate('/submit')
                        window.location.reload()
                    }}>
                    <Button w={250} h={50} variant="filled"><div className="text-xl text-mine-shaft-950 font-bold">Submit</div></Button>
                </Link>
            </div>
        </div>
    )
}

export default QuestionNav