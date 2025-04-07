const http = require('http');
const fs = require('fs');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/Theatre')
    .then(() => console.log('DB connected'))
    .catch(err => console.error('DB connection error:', err));

// Define Mongoose schema
const ticketSchema = new mongoose.Schema({
    movieName: String,
    date: Date,
    time: Number,
    tickets: Number,
    email: String,
    mobile: Number,
    payment: String
});

// Create Mongoose model
const Ticket = mongoose.model('Ticket', ticketSchema);

// Create HTTP server
const server = http.createServer((req, res) => {
    if (req.url === '/' && req.method === 'GET') {
        fs.readFile('index.html', 'utf8', (err, htmlContent) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading index.html');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(htmlContent);
        });
    } else if (req.url === '/server' && req.method === "POST") {
        let rawData = '';
        req.on('data', chunk => rawData += chunk);
        req.on('end', () => {
            const params = new URLSearchParams(rawData);
            const ticketData = {
                movieName: params.get('movieName'),
                date: new Date(params.get('date')),
                time: parseInt(params.get('time'), 10),
                tickets: parseInt(params.get('tickets'), 10),
                email: params.get('email'),
                mobile: parseInt(params.get('mobile'), 10),
                payment: params.get('payment')
            };
            Ticket.create(ticketData).then(() => {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write('<h1 style="color: green;">Data saved successfully</h1>');
                Object.entries(ticketData).forEach(([key, value]) => {
                    let color = 'black'; // Default color
                    switch (key) {
                        case 'movieName':
                            color = 'blue';
                            break;
                        case 'date':
                            color = 'purple';
                            break;
                        case 'time':
                            color = 'red';
                            break;
                        case 'tickets':
                            color = 'green';
                            break;
                        case 'email':
                            color = 'navy';
                            break;
                        case 'mobile':
                            color = 'orange';
                            break;
                        case 'payment':
                            color = 'brown';
                            break;
                    }
                    res.write(`<p style="color: ${color};">${key}: ${value}</p>`);
                });
                res.end();
                
            }).catch(err => {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('Error saving data: ' + err.message);
            });
        });
    } else if (req.url === '/view' && req.method === 'GET') {
        Ticket.find().then(tickets => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write("<table border='1' cellspacing='0' style='width: 100%; color:black;border-color:red'><tr><th>Movie Name</th><th>Date</th><th>Time</th><th>Tickets</th><th>Mobile Number</th><th>Email</th><th>Payment Method</th></tr>");
            tickets.forEach(ticket => {
                res.write(`<tr style=color:blue;><td>${ticket.movieName}</td><td>${ticket.date ? ticket.date.toISOString().split('T')[0] : 'N/A'}</td><td>${ticket.time}</td><td>${ticket.tickets}</td><td>${ticket.mobile}</td><td>${ticket.email}</td><td>${ticket.payment}</td></tr>`);
            });
            res.write('</table>');
            res.end();
        }).catch(err => {
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end('Error retrieving data: ' + err.message);
        });
    }
});

server.listen(8000, () => {
    console.log('Server started at http://127.0.0.1:8000');
});
