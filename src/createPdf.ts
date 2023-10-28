import { wrap } from "comlink";
import Worker from './worker/pdf.worker?worker';
import { WorkerType } from "./worker/pdf.worker";


export const pdfWorker = wrap<WorkerType>(new Worker());

export const createPdfFromData = async(data:any) => {
    const pdfBlob = await pdfWorker.renderPDFInWorker(data);
    console.log({pdfBlob});
    return pdfBlob;
}