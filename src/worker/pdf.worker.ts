import { expose} from 'comlink';
import pdfMake from "pdfmake/build/pdfmake.min"
import './workerShim';

let log = console.info;

let currentProgress:any=0;
let mainThreadCallback:any = ()=>{};

async function remoteCallBackFunction(cb) {
  console.log("setting the callback function")
  mainThreadCallback = cb
  await cb(currentProgress);
}


const renderPDFInWorker = async (props: any) => {
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
      const blob =  await new Promise<Blob>((resolve)=>pdfDocGenerator.getBlob((blob) => resolve(blob), {
        progressCallback(progress) {
          // console.log(remoteCallBackFunction)
            // console.log(progress);
          // currentProgress = progress
          mainThreadCallback(progress);
        },
      }))
    return URL.createObjectURL(blob);
  } catch (error) {
    log(error);
    throw error;
  }
};


const onProgress = (cb: typeof console.info) => (log = cb);

expose({ renderPDFInWorker: renderPDFInWorker, onProgress,remoteFunction:remoteCallBackFunction });

export type WorkerType = {
  renderPDFInWorker: typeof renderPDFInWorker;
  onProgress: typeof onProgress;
};


