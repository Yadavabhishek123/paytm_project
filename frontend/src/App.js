import {BrowserRouter, Routes, Route} from "react-router-dom"
import Signup from "./pages/Signup"
import Signin from "./pages/Signin"
import Dashboard from "./pages/Dashboard"
import Sendmoney from "./pages/Sendmoney"


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/signin" element={<Signin/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/send" element={<Sendmoney/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
