import { useState } from 'react'
import './App.css'
//importing pdfmake to generate our PDF file
import pdfMake from "pdfmake/build/pdfmake"
//importing the fonts whichever present inside vfs_fonts file
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { faker } from '@faker-js/faker';
import { format, isValid } from 'date-fns';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

function App() {
  const [inputNumber, setInputNumber] = useState(10000);
  const [timeTaken, setTimeTaken] = useState<number | undefined>();
  const createPdf = () => {
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
    console.time(`pdf-creation-time ${inputNumber} rows`);
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getDataUrl((dataUrl) => {
      var end= Date.now();

      const timeTaken = console.timeEnd(`pdf-creation-time ${inputNumber} rows`);
      console.log({dataUrl, timeTaken});
      // const targetElement = document.querySelector('#iframeContainer');
      // const iframe = document.createElement('iframe');
      // iframe.src = dataUrl;
      // targetElement!.appendChild(iframe);
      pdfDocGenerator.print();
      setTimeTaken(end - begin);
    });
  };

  return (
    <>
      <h1>Hello!</h1>
      <h4>Simple POC for creating pdf using pdfmake library.</h4>
      <h3>Time Taken {timeTaken || "-"} milliseconds</h3>
      <div className="card">
        <input
          type="number"
          className="input"
          value={inputNumber}
          onChange={(e) => setInputNumber(parseInt(e.target.value) || 0)}
        />
        <button onClick={createPdf}>
          Create Pdf
        </button>
        <div id='iframeContainer'></div>
      </div>
    </>
  )
}

export default App;

function fddmmyy(date: any) {
  // console.log({date});
  return date && isValid(new Date(date)||date) ? format(new Date(date), 'dd-MM-yy') : "";
}
