import { Divider } from '@mantine/core';
import React from 'react';

const TPastExams = () => {
    return (
        <div className="w-3/5 min-h-[50vh] flex p-10 flex-col gap-4 items-center">
            <h2 className="text-primary text-2xl font-bold">Your Past Exams</h2>

            <div className="border border-mine-shaft-500 rounded-lg min-w-[100vh] min-h-[60vh] p-4">
                <div className="flex pb-3 pt-1 text-primary items-center justify-between gap-4">
                    <span>Exam Name</span>
                    <span>Exam Date</span>
                    <span>Total Marks</span>
                    <span>No of Responses</span>
                </div>

                <Divider color="mine-shaft.6" />
            </div>
        </div>
    );
};

export default TPastExams
