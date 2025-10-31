import './App.css';
import { createTheme, Divider, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import StartPage from './Pages/StartPage/StartPage';
import TestPage from './Pages/TestPage/TestPage';
import SubmitPage from './Pages/SubmitPage/SubmitPage';

function App() {
  const theme = createTheme({
    fontFamily: 'Poppins, sans-serif',
    focusRing: "never",
    primaryColor: 'bright-sun',
    primaryShade: 4,
    colors: {
      'mine-shaft': ['#f6f6f6', '#e7e7e7', '#d1d1d1', '#b0b0b0', '#888888', '#6d6d6d', '#5d5d5d', '#4f4f4f', '#454545', '#3d3d3d', '#2d2d2d',],
      'bright-sun': ['#fffbeb', '#fff3c6', '#ffe588', '#ffd149', '#ffbd20', '#f99b07', '#dd7302', '#b75006', '#943c0c', '#7a330d', '#461902']
    },
  })
  return (
    <MantineProvider defaultColorScheme='dark' theme={theme}>
      <BrowserRouter>
        <div className='relative h-min-[100vh] bg-mine-shaft-950 font-[Poppins]'>
          <Header />
          <Divider size="xs" m='md' />
          <Routes>
            <Route path='/' element={<StartPage />} />
            <Route path='/test' element={<TestPage />} />
            <Route path='/submit' element={<SubmitPage />} />
          </Routes>
          <Divider size="xs" m='md'/>
          <Footer />
        </div>
      </BrowserRouter>
    </MantineProvider>
  )
}

export default App;
