import { proxy, wrap } from "comlink";
import Worker from './worker/pdf.worker?worker';

export const pdfWorker = wrap(new Worker());

export const createPdfFromData = async (data: any,setProgresscallback:any) => {
    console.log("calling createpdffromdata")
    function callback(value) {
        console.log({value})
        // alert(`Result: ${value}`);
      }
      console.log("going to set remote")
      await pdfWorker.remoteFunction(proxy(setProgresscallback));
      console.log("going to render pdf")
      const pdfBlob = await pdfWorker.renderPDFInWorker(data);
      console.log({ pdfBlob });
    return pdfBlob;
};
