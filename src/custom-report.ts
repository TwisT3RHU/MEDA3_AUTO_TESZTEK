//import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { FullConfig, FullResult, Reporter, Suite, TestCase, TestResult, TestStep } from '@playwright/test/reporter';
import { logger } from 'globalis';

/*async function createPdf() {
    const pdfDoc = await PDFDocument.create()
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
  
    const page = pdfDoc.addPage()
    const { width, height } = page.getSize()
    const fontSize = 30
    page.drawText('Creating PDFs in JavaScript is awesome!', {
      x: 50,
      y: height - 4 * fontSize,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0.53, 0.71),
    })
  
    const pdfBytes = await pdfDoc.save()
  }*/

let resultcount: number = 0; // normális számláló majd...

class customReport implements Reporter {
  async onBegin(config: FullConfig, suite: Suite) {
    console.log('Playwright custom report - kotel.g');
    console.log(`Teszt megkezdése ${suite.allTests().length} esettel`);
    console.log(`${config.version} - ${config.metadata}`);
  }
  async onTestBegin(test: TestCase, result: TestResult) {
    console.log(`${test.id} - Teszteset címe: "${test.title}"`);
  }
  async onStepBegin(test: TestCase, result: TestResult, step: TestStep) {
    console.log(`${test.id} - ${step.title}`);
  }
  /*async onStepEnd(test: TestCase, result: TestResult, step: TestStep) { 
    console.log(`${step.title} (${test.id}): ${result.status}`);
  }*/
  async onTestEnd(test: TestCase, result: TestResult) {
    console.log(`${test.id} - "${test.title}" teszteset lefuttatva "${result.status}" eredménnyel`);
  }
  async onEnd(result: FullResult) {
    console.log(`Teszt összegzett eredménye: ${result.status}`);
    
  }
}
export default customReport;