import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { Reporter, TestCase, TestResult, TestStep } from '@playwright/test/reporter';

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
    console.log(`Starting the run with ${suite.allTests().length} tests`);
  }
  onTestBegin(test) {
    console.log(`Starting test ${test.title}`);
  }
  onStepBegin(test, result, step) {
    console.log(`Starting test step ${step.title} inside ${test.title}`)
  }
  onStepEnd(test: TestCase, result: TestResult, step: TestStep): void {
    console.log(`Finished test step ${step.title} inside ${test.title}: ${result.status}`)
  }
  onTestEnd(test, result) {
    console.log(`Finished test ${test.title}: ${result.status}`);
  }
  onEnd(result) {
    console.log(`Finished the run: ${result.status}`);
  }
}
export default MyReporter;