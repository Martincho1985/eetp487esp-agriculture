const express = require('express');
const transporter = require('../utils/mailer');

const router = express.Router();

// Ruta de contacto al Gmail del propietario
router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  //Formato de como te llega la info al correo 
  const mailOptions = {
    from: email,
    to: 'englishcultivatehub@gmail.com',
    subject: `Subject: ${subject}`,
    html: `
        <h3>Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p style="font-size: 16px; font-weight: bold;">${message}</p>
    `
};

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Error sending email' });
  }
});

module.exports = router;
