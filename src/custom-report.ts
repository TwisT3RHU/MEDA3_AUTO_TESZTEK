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

class MyReporter implements Reporter {
  onBegin(config: FullConfig, suite: Suite) {
    logger.log(`Teszt megkezdése ${suite.allTests().length} esettel`);
  }
  onTestBegin(test: TestCase, result: TestResult) {
    logger.log(`${test.id} - Teszteset címe: "${test.title}"`);
  }
  onStepBegin(test: TestCase, result: TestResult, step: TestStep) {
    logger.log(`${test.id} - ${step.title}`);
  }
  /*onStepEnd(test: TestCase, result: TestResult, step: TestStep): void { 
    logger.log(`${step.title} (${test.id}): ${test.}`);
  }*/
  onTestEnd(test: TestCase, result: TestResult) {
    logger.log(`${test.id} - "${test.title}" teszteset lefuttatva "${result.status}" eredménnyel`);
  }
  onEnd(result: FullResult) {
    logger.log(`Teszt összegzett eredménye: ${result.status}`);
  }
}
export default MyReporter;