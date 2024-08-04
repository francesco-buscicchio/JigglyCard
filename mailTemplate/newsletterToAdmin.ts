function newsletterToAdmin(userName: string, userEmail: string): string {
    return `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nuovo Iscritto alla Newsletter</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            background-color: #006482;
            color: white;
            padding: 10px 0;
        }
        .header h1 {
            margin: 0;
        }
        .content {
            padding: 20px;
            text-align: center;
        }
        .content h2 {
            color: #006482;
        }
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Jigglycard Admin Notification</h1>
        </div>
        <div class="content">
            <h2>Nuovo Iscritto alla Newsletter</h2>
            <p>Ciao Admin,</p>
            <p>Un nuovo utente si è iscritto alla newsletter di Jigglycard!</p>
            <p><strong>Nome Utente:</strong> ${userName}</p>
            <p><strong>Email Utente:</strong> ${userEmail}</p>
            <p>Assicurati di dargli il benvenuto e di tenerlo aggiornato sulle ultime novità e offerte.</p>
            <p>Grazie,</p>
            <p>Il sistema di notifiche Jigglycard</p>
        </div>
        <div class="footer">
            <p>Questa è una notifica automatica generata dal sito di Jigglycard.</p>
        </div>
    </div>
</body>
</html>`;
}

export default newsletterToAdmin;
