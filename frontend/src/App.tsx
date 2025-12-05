import './App.css'
import { MantineProvider, createTheme, Divider } from '@mantine/core'
import '@mantine/core/styles.css'
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom"
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import StartPage from './pages/StartPage/StartPage'
import TestPage from './pages/TestPage/TestPage'
import SubmitPage from './pages/SubmitPage/SubmitPage'
import UserProvider from "./context/userContext"
import { Toaster } from 'react-hot-toast'
import Home from './pages/Dashboard/Home'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'


function App() {
	const theme = createTheme({
		fontFamily: 'Poppins, sans-serif',
		focusRing: "never",
		primaryColor: 'bright-sun',
		primaryShade: 4,
		colors: {
			'mine-shaft': [
				'#f6f6f6', '#e7e7e7', '#d1d1d1', '#b0b0b0', '#888888',
				'#6d6d6d', '#5d5d5d', '#4f4f4f', '#454545', '#3d3d3d', '#2d2d2d',
			],
			'bright-sun': [
				'#fffbeb', '#fff3c6', '#ffe588', '#ffd149', '#ffbd20',
				'#f99b07', '#dd7302', '#b75006', '#943c0c', '#7a330d', '#461902'
			]
		},
	})

	return (
		<MantineProvider theme={theme} >
			<UserProvider>
				<Router>

					<div className='relative min-h-[100vh] bg-mine-shaft-950 font-[Poppins]'>
						<Header />
						<Divider size="xs" m='md' />

						<Routes>
							<Route path="/" element={<Root />} />
							<Route path="/login" element={<Login />} />
							<Route path="/signup" element={<SignUp />} />
							<Route path="/dashboard" element={<Home />} />
							<Route path="/start" element={<StartPage />} />
							<Route path="/test/:examId" element={<TestPage />} />
							<Route path="/submit" element={<SubmitPage />} />
						</Routes>

						<Divider size="xs" m='md' />
						<Footer />
					</div>

					<Toaster
						toastOptions={{
							className: "",
							style: { fontSize: '13px' },
						}}
					/>

				</Router>
			</UserProvider>
		</MantineProvider>
	)
}

export default App

const Root = () => {
	const isAuthenticated = !!localStorage.getItem("token");
	return isAuthenticated ? (
		<Navigate to="/dashboard" />
	) : (
		<Navigate to="/login" />
	)
}
