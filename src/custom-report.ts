import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { Reporter, TestCase, TestResult, TestStep } from '@playwright/test/reporter';
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
  onBegin(config, suite) {
    logger.log(`Teszt megkezdése ${suite.allTests().length} esettel`);
  }
  onTestBegin(test) {
    logger.log(`Teszteset címe: "${test.title}"`);
  }
  onStepBegin(test, result, step) {
    logger.log(`${step.title}`);
  }
  /*onStepEnd(test: TestCase, result: TestResult, step: TestStep): void {
    logger.log(`Finished test step ${step.title} inside ${test.title}: ${result.status}`)
  }*/
  onTestEnd(test, result) {
    logger.log(`"${test.title}" teszteset lefuttatva "${result.status}" eredménnyel`);
  }
  onEnd(result) {
    logger.log(`Teszt összegzett eredménye: ${result.status}`);
  }
}
export default MyReporter;