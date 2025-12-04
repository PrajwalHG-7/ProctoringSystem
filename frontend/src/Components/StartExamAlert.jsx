import React from 'react'

const StartExamAlert = ({ onStart }) => {
    return (
        <div className=''>
            <div className="bg-gray-50 p-4 rounded-lg border mb-4">
                <h2 className="text-lg font-semibold mb-3">Before You Start</h2>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    <li>Do not switch tabs or minimize the browser during the test.</li>
                    <li>The timer will be visible at the top of the screen at all times.</li>
                    <li>The test will <strong>not</strong> auto-submit when the time ends — you must submit manually.</li>
                    <li>This exam is AI-proctored; suspicious activities will be monitored.</li>
                    <li>Do not refresh or close the page once the test begins.</li>
                    <li>Maintain a stable internet connection throughout the test.</li>
                </ul>
            </div>

            <div className="flex justify-end mt-6">
                <button
                    type='button'
                    className="add-btn add-btn-fill"
                    onClick={onStart}
                >
                    Start Exam
                </button>
            </div>
        </div>
    )
}

export default StartExamAlert