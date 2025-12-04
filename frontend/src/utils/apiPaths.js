export const BASE_URL = "http://localhost:3000"

export const API_PATHS = {
    AUTH: {
        LOGIN: "/api/v1/auth/login",
        REGISTER: "/api/v1/auth/register",
        GET_USER_INFO: "/api/v1/auth/getUser",
    },
    TEACHER: {
        GET_DATA: "/api/v1/t/dashboard",
        ADD_EXAM: "/api/v1/t/addExam",
        GET_EXAM: "/api/v1/t/exam/:examId",
        DELETE_EXAM: "/api/v1/t/delete/:examId",
        GET_ALL_EXAMS: "/api/v1/t/exam",
    },
    STUDENT: {
        GET_DATA: "/api/v1/s/dashboard",
        START_EXAM: "/api/v1/s/start/:exmaId",
        SUBMIT_EXAM: "/api/v1/s/submit",
        GET_ALL_EXAMS: "/api/v1/s/exam",
    },
    IMAGE: {
        UPLOAD_IMAGE: "/api/v1/auth/upload-image",
    },
}