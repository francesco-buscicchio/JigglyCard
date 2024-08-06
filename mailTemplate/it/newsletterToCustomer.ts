function newsletterToCustomer(userName: string): string {
    return `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Benvenuto nella Newsletter di Jigglycard!</title>
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
        .footer a {
            color: #006482;
            text-decoration: none;
        }
        .footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Jigglycard</h1>
        </div>
        <div class="content">
            <h2>Benvenuto nella nostra Newsletter!</h2>
            <p>Ciao ${userName},</p>
            <p>Grazie per esserti iscritto alla newsletter di Jigglycard!</p>
            <p>Siamo entusiasti di averti con noi. Riceverai aggiornamenti sulle ultime novità e offerte sui nostri giochi di carte collezionabili preferiti come Pokémon, One Piece, Dragon Ball e molti altri.</p>
            <p>Rimani sintonizzato per ricevere contenuti esclusivi, promozioni speciali e molto altro ancora.</p>
            <p>Grazie per il tuo supporto!</p>
            <p>Il team di Jigglycard</p>
        </div>
        <div class="footer">
            <p>Ricevi questa email perché ti sei iscritto alla nostra newsletter su <a href="https://www.jigglycard.com">Jigglycard</a>.</p>
            <p>Se non desideri più ricevere queste email, puoi <a href="[link_disiscrizione]">disiscriverti qui</a>.</p>
        </div>
    </div>
</body>
</html>`;
}

export default newsletterToCustomer;
