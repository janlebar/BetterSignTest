import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fetch from 'node-fetch';
import * as fs from 'fs';


interface DocumentFieldOption {
    visualisation: {
        location: { page: number; x: number; y: number };
        width: number;
        height: number;
        borderWidth: number;
        borderColor: string;
        fontSize: number;
        fontColor: string;
        padding: number;
        borderStyle: string;
        fontStyle: string;
    };
    comboboxExtras: {
        options: { [key: string]: string };
        defaultOptionKey: string;
    };
}

interface DocumentField {
    fieldType: string;
    options: DocumentFieldOption;
    id: string;
}

interface DocumentData {
    externalDocId: string;
    mimeType: string;
    title: string;
    fileName: string;
    documentField: DocumentField[];
}


async function fetchDocument(apiUrl: string): Promise<DocumentData[]> {
    try {
        const response = await fetch(apiUrl);
        if (response.ok) {
            return await response.json() as DocumentData[];
        } else {
            console.error("Failed to fetch API data.");
            return [];
        }
    } catch (error) {
        console.error("Error fetching document data:", error);
        return [];
    }
}

// Funkcija za določitev barve glede na json podatke
function colourChange(color: string) {
    const [r, g, b] = color.split(',').map(Number);
    return rgb(r / 255, g / 255, b / 255);
}


async function modifyPdf() {
    const testUrl = 'https://pdf-lib.js.org/assets/with_update_sections.pdf';
    const mockApi = "https://639335b5ab513e12c50722ff.mockapi.io/job";

    const apiData = await fetchDocument(mockApi);
    if (apiData.length === 0) {
        console.error("No document in data.");
        return;
    }

    const testPDF = await fetch(testUrl).then(data => data.arrayBuffer());
    const pdfDoc = await PDFDocument.load(testPDF);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    for (const doc of apiData) {
        for (const field of doc.documentField) {
            if (field.fieldType === 'COMBOBOX') {
                const options = field.options.comboboxExtras.options;
                const defaultOption = options[field.options.comboboxExtras.defaultOptionKey];
                const visual = field.options.visualisation;
                const page = pdfDoc.getPage(visual.location.page - 1);

                const x = visual.location.x * page.getWidth();
                const y = visual.location.y * page.getHeight();
                const width = visual.width * page.getWidth();
                const height = visual.height * page.getHeight();


                const borderColor = colourChange(visual.borderColor);
                const fontColor = colourChange(visual.fontColor);


                const borderDashArray = visual.borderStyle === 'DASH' ? [6] : visual.borderStyle === 'DOT' ? [2, 2] : [];

                // V JSONU je specifična barva 
                page.drawRectangle({
                    x,
                    y,
                    width,
                    height,
                    borderColor,
                    borderWidth: visual.borderWidth,
                    color: rgb(1, 1, 1),
                    opacity: 0.1,
                    borderDashArray,
                });


                page.drawText(defaultOption, {
                    x: x + visual.padding,
                    y: y + visual.padding,
                    size: visual.fontSize,
                    font: helveticaFont,
                    color: fontColor,
                });
            }
        }
    }

    const modifiedPdfBytes = await pdfDoc.save();
    fs.writeFileSync('modified_output.pdf', modifiedPdfBytes);
    console.log("PDF modified and saved as 'modified_output.pdf'");
}

modifyPdf().catch(console.error);
