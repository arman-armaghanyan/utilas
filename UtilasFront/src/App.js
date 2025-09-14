import {Header} from "./Components/Header";
import {Footer} from "./Components/Footer";
import {ConverterSelector} from "./Components/ConverterSelector";
import MultiFileUploader from "./Components/MultiFileUploader";
import
{
    Route,
    Routes,
    useNavigate
}
from 'react-router-dom';

function App() {
    const navigateHook = useNavigate();

    function ConverterSelectorHandler(converter){
        console.log(converter);
        const routURL = converter.inputType + "_" + converter.outputType;
        navigateHook(routURL , { replace: false });
    }
  return (
    <>
        <Header/>
        <ConverterSelector SelectorChange={ConverterSelectorHandler}/>
        <Routes>
            <Route path={"png_jpeg"} element={<MultiFileUploader/>} />
            <Route path={"jpeg_png"} element={<MultiFileUploader/>} />
            <Route path={"jpeg_heic"} element={<MultiFileUploader/>}/>
            <Route path={"jpeg_webp"} element={<MultiFileUploader/>} />
            <Route path={"png_webp"} element={<MultiFileUploader/>}/>
            <Route path={"png_heic"} element={<MultiFileUploader/>}/>
        </Routes>
        <Footer/>
    </>
  );
}

export default App;
