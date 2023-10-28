import { useState } from 'react'
//importing pdfmake to generate our PDF file
//importing the fonts whichever present inside vfs_fonts file
// import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { faker } from '@faker-js/faker';
import { format, isValid } from 'date-fns';
import { createPdfFromData } from './createPdf';
// pdfMake.vfs = pdfFonts.pdfMake.vfs;


function Pdf() {
    const [inputNumber, setInputNumber] = useState(1000);
    const [timeTaken, setTimeTaken] = useState<number | undefined>();
    const [blobUrl, setBlobUrl] = useState<string | undefined>();
    const [progress, setProgress] = useState(0);
  const createPdfData = async() => {
    const docDefinition:TDocumentDefinitions = {
      content: [{
        table: {
          body: [
          [
            "S.no.",
            "Inv-Dt.",
            "pcs",
            "Inv.Amt",
            "Transport",
            "LR.No",
            "LR.Date" 
          ],
          ...new Array(inputNumber).fill(null).map<(string | number)[]>((_e, i) => (
              [ 
                i+1,
                fddmmyy(faker.date.anytime().toString()),
                faker.number.int({ min: 1000, max: 100000 }),
                faker.number.int({ min: 1000, max: 100000 }),
                faker.company.name(),
                faker.number.int({ min: 0, max: 100 }),
                fddmmyy(faker.date.anytime().toString())
              ]
            ))
          ],
          headerRows: 1,
          widths: [ 'auto', 'auto', 'auto', 'auto', '*', 'auto', 'auto' ],

        },
      }]
    };
    const begin=Date.now();
    console.time("pdf creation:")
    const blobURL = await createPdfFromData(docDefinition, setProgress);
    const end= Date.now();
    console.timeEnd("pdf creation:");
    setBlobUrl(blobURL);
    setTimeTaken(end - begin);

  };
  return (
    <>
    <h3>Time Taken {timeTaken || "-"} milliseconds</h3>
    <h4>Progress: {progress * 100 || "-"} %</h4>
      <div className="card">
        <input
          type="number"
          className="input"
          value={inputNumber}
          onChange={(e) => setInputNumber(parseInt(e.target.value) || 0)}
        />
        <button onClick={createPdfData}>
          Create Pdf
        </button>
        {blobUrl &&
          <a href={blobUrl} target="_blank">
            Download
          </a>
        }
        <div id='iframeContainer'></div>
      </div>
    </>
  )
}

export default Pdf

function fddmmyy(date: string) {
    // console.log({date});
    return date && isValid(new Date(date)||date) ? format(new Date(date), 'dd-MM-yy') : "";
  }
  