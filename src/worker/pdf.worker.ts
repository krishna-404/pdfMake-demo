import { expose } from 'comlink';
import pdfMake from "pdfmake/build/pdfmake.min"
import './workerShim';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

let log = console.info;

let setProgress: React.Dispatch<React.SetStateAction<number>> | (() => void) = ()=>{};

const progessTracker = (cb: React.Dispatch<React.SetStateAction<number>>) => {
  setProgress = cb;
};

const renderPDFInWorker = async (props: TDocumentDefinitions) => {
  try {
    console.log({props})
    pdfMake.fonts  ={
        // download default Roboto font from cdnjs.com
        Roboto: {
          normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
          bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
          italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
          bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
        },
      }
      const pdfDocGenerator = pdfMake.createPdf(props);
      const blob =  await new Promise<Blob>((resolve)=>pdfDocGenerator.getBlob(
          (blob) => resolve(blob), 
          { progressCallback: (progress) => setProgress(progress) }
      ))
    return URL.createObjectURL(blob);
  } catch (error) {
    log(error);
    throw error;
  }
};

expose({ renderPDFInWorker, progessTracker });

export type WorkerType = {
  renderPDFInWorker: typeof renderPDFInWorker;
  progessTracker: typeof progessTracker;
};


