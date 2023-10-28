import { Suspense, lazy } from 'react';
import './App.css'
const PDFComponent = lazy(() => import('./Pdf'));

function App() {  
  return (
    <>
      <h1>Hello!</h1>
      <h4>Simple POC for creating pdf using pdfmake library.</h4>
      <Suspense fallback={<>Loading app...</>}>
        <PDFComponent/> 
      </Suspense>
    </>
  )
}

export default App;

