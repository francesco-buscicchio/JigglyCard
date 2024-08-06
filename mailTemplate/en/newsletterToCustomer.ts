function newsletterToCustomer(userName: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to the Jigglycard Newsletter!</title>
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
            <h2>Welcome to our Newsletter!</h2>
            <p>Hello ${userName},</p>
            <p>Thank you for subscribing to the Jigglycard newsletter!</p>
            <p>We are excited to have you with us. You will receive updates on the latest news and offers on our favorite collectible card games like Pokémon, One Piece, Dragon Ball, and many more.</p>
            <p>Stay tuned for exclusive content, special promotions, and much more.</p>
            <p>Thank you for your support!</p>
            <p>The Jigglycard Team</p>
        </div>
        <div class="footer">
            <p>You are receiving this email because you subscribed to our newsletter on <a href="https://www.jigglycard.com">Jigglycard</a>.</p>
            <p>If you no longer wish to receive these emails, you can <a href="[unsubscribe_link]">unsubscribe here</a>.</p>
        </div>
    </div>
</body>
</html>`;
}

export default newsletterToCustomer;
