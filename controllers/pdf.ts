import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import PdfPrinter from "pdfmake";
import { TDocumentDefinitions, TFontDictionary } from "pdfmake/interfaces";

const router = express.Router();
const prisma = new PrismaClient();

const fonts: TFontDictionary = {
  THSarabun: {
    normal: "fonts/THSarabun.ttf",
    bold: "fonts/THSarabun_Bold.ttf",
    italics: "fonts/THSarabun_Italic.ttf",
    bolditalics: "fonts/THSarabun_Bold_Italic.ttf",
  },
};
const printer = new PdfPrinter(fonts);

router.get("/pdf", async (req: Request, res: Response) => {
  const districts = await prisma.districts.findMany({
    include: {
      amphures: {
        include: {
          provinces: true,
        },
      },
    },
    where: {
      NOT: {
        OR: [
          {
            name_th: {
              startsWith: "*",
            },
          },
          {
            name_th: {
              endsWith: "*",
            },
          },
        ],
      },
    },
  });

  // return res.json(districts);

  const docDefinition: TDocumentDefinitions = {
    pageSize: "A4",
    pageMargins: [10, 10, 10, 20],
    styles: {
      icon: { font: "Fontello" },
    },
    defaultStyle: {
      font: "THSarabun",
    },
    footer: (currentPage: number, pageCount: number) => {
      return {
        columns: [
          {
            width: 340,
            text: `หน้าที่ ${currentPage}`,
            margin: [10, 0, 0, 0],
          },
          {
            width: "*",
            text: "เจ้าของอาคาร / ผู้ครอบครอง ลงนาม ................................................................",
          },
        ],
      };
    },
    content: [
      {
        table: {
          widths: ["*", "*", "*", "*", "*"],
          headerRows: 1,
          body: [
            [
              { text: "ลำดับ", bold: true },
              { text: "ตำบล", bold: true },
              { text: "อำเภอ", bold: true },
              { text: "จังหวัด", bold: true },
              { text: "รหัสไปรษณีย์", bold: true },
            ],
            ...districts.map((item, index) => [
              { text: index + 1 },
              { text: item.name_th },
              { text: item.amphures.name_th },
              { text: item.amphures.provinces.name_th },
              { text: item.zip_code },
            ]),
          ],
        },
      },
    ],
  };

  // // for download file
  // res.setHeader("Content-Type", "application/pdf");
  // res.setHeader(
  //   "Content-Disposition",
  //   "attachment; filename=your_file_name_for_client.pdf"
  // );

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(res);
  pdfDoc.end();
});

export default router;
