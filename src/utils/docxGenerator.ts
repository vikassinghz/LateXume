import { Document, Packer, Paragraph, TextRun, HeadingLevel, BorderStyle, AlignmentType } from "docx";
import { ResumeData, PageSettings } from "../types";

export async function generateDocx(data: ResumeData, settings: PageSettings): Promise<Blob> {
  const p = data.personalInfo;

  // 1. Font mapping
  let fontName = "Calibri";
  if (settings.fontFamily === "arial") fontName = "Arial";
  else if (settings.fontFamily === "helvetica") fontName = "Helvetica";
  else if (settings.fontFamily === "garamond") fontName = "Garamond";
  else if (settings.fontFamily === "times-new-roman") fontName = "Times New Roman";

  // 2. Margin mapping (1 inch = 1440 dxa)
  let marginTopBottom = 720; // 0.5in default
  let marginLeftRight = 864; // 0.6in default

  if (settings.marginSize === "compact") {
    marginTopBottom = 576; // 0.4in
    marginLeftRight = 576; // 0.4in
  } else if (settings.marginSize === "wide") {
    marginTopBottom = 1080; // 0.75in
    marginLeftRight = 1080; // 0.75in
  }

  // 3. Sizing mapping in half-points (10pt = 20, 11pt = 22, 11.5pt = 23, 12pt = 24, 13pt = 26, 18pt = 36, 24pt = 48)
  let nameSize = 40; // 20pt
  let headingSize = 25; // 12.5pt
  let titleCompanySize = 23; // 11.5pt
  let bodySize = 21; // 10.5pt
  let dateLocSize = 20; // 10pt

  if (settings.fontSize === "sm") {
    nameSize = 36; // 18pt
    headingSize = 24; // 12pt
    titleCompanySize = 22; // 11pt
    bodySize = 20; // 10pt
    dateLocSize = 20; // 10pt
  } else if (settings.fontSize === "lg") {
    nameSize = 48; // 24pt
    headingSize = 26; // 13pt
    titleCompanySize = 23; // 11.5pt
    bodySize = 22; // 11pt
    dateLocSize = 20; // 10pt
  }

  // 1.15 line spacing is 276 dxa (240 dxa is 1.0)
  const lineSpacingDxa = 276;

  // Helper to create Section Headings with a horizontal line border
  const createSectionHeading = (title: string): Paragraph => {
    return new Paragraph({
      spacing: { before: 100, after: 40 },
      border: {
        bottom: {
          color: "666666",
          space: 4,
          style: BorderStyle.SINGLE,
          size: 8,
        },
      },
      children: [
        new TextRun({
          text: title.toUpperCase(),
          font: fontName,
          size: headingSize,
          bold: true,
          color: "000000",
        }),
      ],
    });
  };

  const children: any[] = [];

  // ==========================================
  // SECTION 1: Name + Contact Info
  // ==========================================
  children.push(
    new Paragraph({
      spacing: { before: 0, after: 30 },
      children: [
        new TextRun({
          text: p.fullName || "Vikas Singh Baghel",
          font: fontName,
          size: nameSize,
          bold: true,
          color: "000000",
        }),
      ],
    })
  );

  // Contact items array
  const contactDetails: string[] = [];
  if (p.email) contactDetails.push(p.email);
  if (p.phone) contactDetails.push(p.phone);
  if (p.location) contactDetails.push(p.location);
  if (p.linkedin) contactDetails.push(`linkedin.com/in/${p.linkedin}`);
  if (p.github) contactDetails.push(`github.com/${p.github}`);
  if (p.website) contactDetails.push(p.website);

  if (contactDetails.length > 0) {
    children.push(
      new Paragraph({
        spacing: { before: 0, after: 100 },
        children: [
          new TextRun({
            text: contactDetails.join("  |  "),
            font: fontName,
            size: dateLocSize,
            color: "333333",
          }),
        ],
      })
    );
  }

  // Summary (if exists)
  if (p.summary) {
    children.push(
      new Paragraph({
        spacing: { before: 80, after: 100, line: lineSpacingDxa },
        children: [
          new TextRun({
            text: p.summary,
            font: fontName,
            size: bodySize,
          }),
        ],
      })
    );
  }

  // ==========================================
  // SECTION 2: Skills / Tech Stack
  // ==========================================
  if (data.skills && data.skills.length > 0) {
    children.push(createSectionHeading("Technical Skills"));

    data.skills.forEach((sk) => {
      children.push(
        new Paragraph({
          spacing: { before: 20, after: 40 },
          children: [
            new TextRun({
              text: `${sk.category}: `,
              font: fontName,
              size: bodySize,
              bold: true,
            }),
            new TextRun({
              text: sk.skills.join(", "),
              font: fontName,
              size: bodySize,
            }),
          ],
        })
      );
    });
  }

  // ==========================================
  // SECTION 3: Experience
  // ==========================================
  if (data.experience && data.experience.length > 0) {
    children.push(createSectionHeading("Professional Experience"));

    data.experience.forEach((exp) => {
      // Job title + Company Row
      children.push(
        new Paragraph({
          spacing: { before: 60, after: 10 },
          children: [
            new TextRun({
              text: `${exp.company}  |  `,
              font: fontName,
              size: titleCompanySize,
              bold: true,
            }),
            new TextRun({
              text: exp.position,
              font: fontName,
              size: titleCompanySize,
              bold: true,
              italics: true,
            }),
          ],
        })
      );

      // Dates & Location Row
      children.push(
        new Paragraph({
          spacing: { before: 0, after: 40 },
          children: [
            new TextRun({
              text: `${exp.startDate} – ${exp.endDate}  |  ${exp.location}`,
              font: fontName,
              size: dateLocSize,
              italics: true,
              color: "555555",
            }),
          ],
        })
      );

      // Bullet Highlights (Not paragraphs, left aligned)
      if (exp.highlights && exp.highlights.length > 0) {
        exp.highlights.forEach((bulletText) => {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { before: 10, after: 20, line: lineSpacingDxa },
              children: [
                new TextRun({
                  text: bulletText,
                  font: fontName,
                  size: bodySize,
                }),
              ],
            })
          );
        });
      }
    });
  }

  // ==========================================
  // SECTION 4: Projects
  // ==========================================
  if (data.projects && data.projects.length > 0) {
    children.push(createSectionHeading("Key Projects"));

    data.projects.forEach((proj) => {
      // Project name + role
      children.push(
        new Paragraph({
          spacing: { before: 60, after: 10 },
          children: [
            new TextRun({
              text: `${proj.name}  `,
              font: fontName,
              size: titleCompanySize,
              bold: true,
            }),
            new TextRun({
              text: proj.role ? `|  ${proj.role}` : "",
              font: fontName,
              size: bodySize,
              italics: true,
            }),
          ],
        })
      );

      // Technologies & Dates
      const techText = proj.technologies && proj.technologies.length > 0 ? `Technologies: ${proj.technologies.join(", ")}  |  ` : "";
      children.push(
        new Paragraph({
          spacing: { before: 0, after: 40 },
          children: [
            new TextRun({
              text: `${techText}${proj.startDate} – ${proj.endDate}`,
              font: fontName,
              size: dateLocSize,
              italics: true,
              color: "555555",
            }),
          ],
        })
      );

      // Highlights
      if (proj.highlights && proj.highlights.length > 0) {
        proj.highlights.forEach((bulletText) => {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { before: 10, after: 20, line: lineSpacingDxa },
              children: [
                new TextRun({
                  text: bulletText,
                  font: fontName,
                  size: bodySize,
                }),
              ],
            })
          );
        });
      }
    });
  }

  // ==========================================
  // SECTION 5: Education
  // ==========================================
  if (data.education && data.education.length > 0) {
    children.push(createSectionHeading("Education"));

    data.education.forEach((edu) => {
      children.push(
        new Paragraph({
          spacing: { before: 60, after: 10 },
          children: [
            new TextRun({
              text: `${edu.institution}  `,
              font: fontName,
              size: titleCompanySize,
              bold: true,
            }),
          ],
        })
      );

      children.push(
        new Paragraph({
          spacing: { before: 0, after: 30 },
          children: [
            new TextRun({
              text: `${edu.degree} in ${edu.fieldOfStudy}  |  ${edu.startDate} – ${edu.endDate}  |  ${edu.location}`,
              font: fontName,
              size: bodySize,
              italics: true,
            }),
          ],
        })
      );

      if (edu.description) {
        children.push(
          new Paragraph({
            spacing: { before: 10, after: 40, line: lineSpacingDxa },
            children: [
              new TextRun({
                text: edu.description,
                font: fontName,
                size: bodySize,
                color: "444444",
              }),
            ],
          })
        );
      }
    });
  }

  // ==========================================
  // SECTION 6: Certifications / Achievements
  // ==========================================
  if (data.customSections && data.customSections.length > 0) {
    data.customSections.forEach((sec) => {
      children.push(createSectionHeading(sec.title));

      sec.items.forEach((item) => {
        children.push(
          new Paragraph({
            spacing: { before: 60, after: 10 },
            children: [
              new TextRun({
                text: `${item.title}  `,
                font: fontName,
                size: titleCompanySize,
                bold: true,
              }),
              new TextRun({
                text: item.subtitle ? `|  ${item.subtitle}` : "",
                font: fontName,
                size: bodySize,
                italics: true,
              }),
            ],
          })
        );

        if (item.startDate || item.endDate || item.location) {
          const dateStr = [item.startDate, item.endDate].filter(Boolean).join(" – ");
          children.push(
            new Paragraph({
              spacing: { before: 0, after: 30 },
              children: [
                new TextRun({
                  text: [dateStr, item.location].filter(Boolean).join("  |  "),
                  font: fontName,
                  size: dateLocSize,
                  italics: true,
                  color: "555555",
                }),
              ],
            })
          );
        }

        if (item.description) {
          children.push(
            new Paragraph({
              spacing: { before: 10, after: 40, line: lineSpacingDxa },
              children: [
                new TextRun({
                  text: item.description,
                  font: fontName,
                  size: bodySize,
                }),
              ],
            })
          );
        }
      });
    });
  }

  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: marginTopBottom,
              bottom: marginTopBottom,
              left: marginLeftRight,
              right: marginLeftRight,
            },
          },
        },
        children: children,
      },
    ],
  });

  return await Packer.toBlob(doc);
}
