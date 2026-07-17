import { createClient } from '@supabase/supabase-js';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { ADVANCED_COURSES } from '../../lib/allyCourseData';

export default async function handler(req, res) {
  const { courseId, token } = req.query;

  if (!courseId || !token) {
    return res.status(400).json({ error: 'Missing courseId or token' });
  }

  const course = ADVANCED_COURSES.find((c) => c.id === courseId);
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData?.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const user = userData.user;

  const { data: cert, error: certError } = await supabase
    .from('certificates')
    .select('final_score, issued_at')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .maybeSingle();

  if (certError || !cert) {
    return res.status(403).json({ error: 'No certificate found for this course' });
  }

  const recipientName =
    user.user_metadata?.full_name || user.email || 'SafeHaven Learner';
  const issuedDate = new Date(cert.issued_at).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]); // A4 landscape
  const { width, height } = page.getSize();

  const bodyFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const rose = rgb(0.77, 0.12, 0.23);
  const ink = rgb(0.17, 0.1, 0.12);
  const muted = rgb(0.42, 0.35, 0.37);
  const sand = rgb(0.9, 0.82, 0.78);

  // Border
  page.drawRectangle({
    x: 24,
    y: 24,
    width: width - 48,
    height: height - 48,
    borderColor: sand,
    borderWidth: 2,
  });

  const centerText = (text, y, font, size, color) => {
    const textWidth = font.widthOfTextAtSize(text, size);
    page.drawText(text, { x: (width - textWidth) / 2, y, size, font, color });
  };

  centerText('CERTIFICATE OF COMPLETION', height - 110, boldFont, 22, rose);
  centerText('SafeHaven Learning Hub', height - 138, bodyFont, 12, muted);

  centerText('This certifies that', height - 210, italicFont, 14, muted);
  centerText(recipientName, height - 250, boldFont, 28, ink);

  centerText('has successfully completed the course', height - 295, italicFont, 14, muted);
  centerText(course.title, height - 330, boldFont, 20, rose);
  centerText(course.subtitle, height - 355, bodyFont, 12, muted);

  centerText(
    `Final assessment score: ${cert.final_score}/5    ·    Issued ${issuedDate}`,
    height - 410,
    bodyFont,
    11,
    ink
  );

  centerText('SafeHaven', width / 2 - 200, 90, boldFont, 13, ink);
  page.drawLine({
    start: { x: width / 2 - 220, y: 82 },
    end: { x: width / 2 - 40, y: 82 },
    thickness: 1,
    color: sand,
  });

  const pdfBytes = await pdfDoc.save();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${course.id}-certificate.pdf"`
  );
  return res.status(200).send(Buffer.from(pdfBytes));
}
