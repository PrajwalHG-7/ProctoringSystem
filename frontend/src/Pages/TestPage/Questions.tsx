import { Button, Divider } from "@mantine/core"

const Questions = () => {
    return (
        <div className="flex flex-col w-7/12 h-[67vh] gap-5 bg-mine-shaft-800 rounded-xl items-start p-8">
            <div className="text-justify">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestiae odio at ea laudantium, consequuntur modi adipisci. Quo numquam quibusdam voluptatum nemo? Quibusdam molestiae sunt temporibus, commodi consequatur magni et dicta perspiciatis illo laboriosam quis saepe dolores dolorum aut accusamus quo sapiente inventore consectetur ipsum eos nihil soluta est odio? Exercitationem.
            </div>
            <Divider color="mine-shaft.5" size="xs" className="w-full" />
            <div className="flex flex-col gap-5">
                <div>Options</div>
                <div>Options</div>
                <div>Options</div>
                <div>Options</div>
            </div>
            <div className="flex flex-col w-full h-full justify-end gap-5">
                <Divider color="mine-shaft.5" size="xs" className="w-full" />
                <div className="flex w-full justify-between">
                    <Button><div className="text-mine-shaft-950">Prev</div></Button>
                    <div className="flex w-fit gap-3">
                    <Button variant="outline">Act 1</Button>
                    <Button variant="outline">Act 2</Button>
                    <Button variant="outline">Act 3</Button>
                    </div>
                    <Button><div className="text-mine-shaft-950">Next</div></Button>
                </div>
            </div>
        </div>
    )
}

export default Questions