import React from 'react'
import { LuTrendingUpDown } from "react-icons/lu"

const AuthLayout = ({ children }) => {
    return <div className='flex'>
        <div className='w-screen h-screen md:w-[60vw] px-12 pt-8 pb-80'>
            <div className="flex items-center gap-5">
                <div className='h-55 w-55'>
                    <img src="/expenseTrackerLogo.png" alt="logo" />
                </div>
                <div className="flex flex-col justify-center text-7xl font-bold text-primary1">
                    <h2 className=''>Expense</h2>
                    <h2 className='pl-35'>Tracker</h2>
                </div>
            </div>
            {children}
        </div>

        <div className="hidden md:block w-[40vw] h-screen bg-violet-50 bg-auth-bg-img bg-cover bg-no-repeat bg-center overflow-hidden p-8 relative">
            <div className="w-48 h-48 rounded-[40px] bg-purple-600 absolute -top-7 -left-5"></div>
            <div className="w-48 h-56 rounded-[40px] border-20 border-fuchsia-600 absolute top-[30%] -right-10"></div>
            <div className="w-48 h-48 rounded-[40px] bg-violet-500 absolute -bottom-7 -left-5"></div>

            <div className="grid grid-cols-1 z-20">
                <StatsInfoCard
                    icon={<LuTrendingUpDown />}
                    label="Track Your Income & Expenses"
                    value="4,30,000"
                    color="bg-primary"
                />
            </div>

            <img src="" alt="img" className='w-64 lg:w-[90%] rounded-xl absolute bottom-10 shadow-lg shadow-blue-400/15' />
        </div>
    </div>
}

export default AuthLayout

const StatsInfoCard = ({ icon, label, value, color }) => {
    return <div className="flex gap-6 bg-white p-4 rounded-xl shadow-md shadow-purple-400/10 border border-gray-200/50 z-10">
        <div className={`w-12 h-12 flex items-center bg-purple-600 justify-center text-26 text-white ${color} rounded-full drop-shadow-xl`}>
            {icon}
        </div>
        <div>
            <h6 className='text-xs text-gray-500 mb-1'>{label}</h6>
            <span className="text-20">${value}</span>
        </div>
    </div>
}