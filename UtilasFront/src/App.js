import {Header} from "./Components/Pages/Main/Header";
import {Footer} from "./Components/Pages/Main/Footer";
import
{
    Route,
    Routes,
    useNavigate
}
from 'react-router-dom';

function App() {
    const navigateHook = useNavigate();

  return (
    <>
        <Header/>

        <Footer/>
    </>
  );
}

export default App;
