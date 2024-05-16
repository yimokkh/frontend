import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import MainPage from "./components/MainPage.jsx";
import {Toaster} from "react-hot-toast";
import Profile from "./components/Profile.jsx";
import Track from "./components/Track.jsx";

function App() {
  return (
    <div>
        <Toaster/>
      <BrowserRouter>
        <Routes>
          <Route path={'/'} element={<MainPage/>}/>
          <Route path={'/track/:id'} element={<Track/>}/>
          <Route path={'/user/:id'} element={<Profile/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
