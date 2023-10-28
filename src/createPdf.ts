import { proxy, wrap } from "comlink";
import Worker from './worker/pdf.worker?worker';
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { WorkerType } from "./worker/pdf.worker";

export const createPdfFromData = async (data: TDocumentDefinitions, setProgress: React.Dispatch<React.SetStateAction<number>>) => {
  const worker = new Worker();
  const pdfWorker = wrap<WorkerType>(worker);
  pdfWorker.progessTracker(proxy(setProgress));
  const pdfBlob = await pdfWorker.renderPDFInWorker(data);
  worker.terminate();
  return pdfBlob;
};
