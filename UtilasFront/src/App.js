import {Header} from "./Components/Pages/Main/Header";
import {Footer} from "./Components/Pages/Main/Footer";
import {Route, Routes} from 'react-router-dom';
import {MiniToolsList} from "./Components/Pages/Main/MiniToolsList";
import {MiniToolDetail} from "./Components/Pages/Detail/MiniToolDetail";
import {SearchProvider} from "./context/SearchContext";
import {GlobalSearchModal} from "./Components/Pages/Main/GlobalSearchModal";

function App() {


  return (
    <SearchProvider>
        <Header/>
        <GlobalSearchModal/>
        <Routes>
            <Route path="/" element={<MiniToolsList/>}/>
            <Route path="/app/:appId" element={<MiniToolDetail/>}/>
            <Route path="*" element={<MiniToolsList/>}/>
        </Routes>
        <Footer/>
    </SearchProvider>
  );
}

export default App;
