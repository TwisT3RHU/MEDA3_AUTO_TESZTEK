import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { Reporter } from '@playwright/test/reporter';
import { logger } from 'globalis';

async function createPdf() {
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
  }

class MyReporter implements Reporter {
  onBegin(config: any, suite: any) {
    logger.log(`Teszt megkezdése ${suite.allTests().length} esettel`);
  }
  onTestBegin(test: any) {
    logger.log(`Teszteset címe: "${test.title}"`);
  }
  onStepBegin(test: any, result: any, step: any) {
    logger.log(`${step.title}`);
  }
  /*onStepEnd(test: TestCase, result: TestResult, step: TestStep): void { 
    logger.log(`Finished test step ${step.title} inside ${test.title}: ${result.status}`)
  }*/
  onTestEnd(test: any, result: any) {
    logger.log(`"${test.title}" teszteset lefuttatva "${result.status}" eredménnyel`);
  }
  onEnd(result: any) {
    logger.log(`Teszt összegzett eredménye: ${result.status}`);
  }
}
export default MyReporter;