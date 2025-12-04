const Navbar = () => {
    return (
        <div className="flex justify-between p-5 pb-0 items-center bg-mine-shaft-950">
            <div className="w-3/12">
                <img src="/pvg_logo.png" className="rounded-lg border border-bright-sun-400" alt="NA" width='80px' />
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
                <div className="hover:text-bright-sun-400 cursor-pointer">
                    Settings
                </div>
                <div className="hover:text-bright-sun-400 cursor-pointer">
                    Logout
                </div>
            </div>
        </div>
    )
}

export default Navbar