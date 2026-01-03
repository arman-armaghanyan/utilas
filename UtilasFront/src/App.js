import {Header} from "./Components/Pages/Main/Header";
import {Footer} from "./Components/Pages/Main/Footer";
import {Route, Routes, useLocation} from 'react-router-dom';
import {MiniToolsList} from "./Components/Pages/Main/MiniToolsList";
import {MiniToolDetail} from "./Components/Pages/Detail/MiniToolDetail";
import {SearchProvider} from "./context/SearchContext";
import {GlobalSearchModal} from "./Components/Pages/Main/GlobalSearchModal";

function AppContent() {
  const location = useLocation();
  const isDetailPage = location.pathname.startsWith('/app/');

  return (
    <>
      <Header/>
      <GlobalSearchModal/>
      <Routes>
          <Route path="/" element={<MiniToolsList/>}/>
          <Route path="/app/:appId" element={<MiniToolDetail/>}/>
          <Route path="*" element={<MiniToolsList/>}/>
      </Routes>
      {!isDetailPage && <Footer/>}
    </>
  );
}

function App() {
  return (
    <SearchProvider>
        <AppContent />
    </SearchProvider>
  );
}

export default App;
