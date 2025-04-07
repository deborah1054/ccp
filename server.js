const http = require('http');
const fs = require('fs');
//To include mongoose module in node js program
const mongoose = require('mongoose');
//Connecting to the mongodb database
mongoose.connect('mongodb://127.0.0.1:27017/Theatre')

    .then(function () {
        console.log('DB Connected')
    })

//Defining the Structure of mongodb document
const customerSchema = new mongoose.Schema({
    movieName: String,
    date: Date,
    time: Number,
    tickets: Number,
    email: String,
    mobile: Number,
    payment: String});
//Create collection model
const customermodel = mongoose.model('ticket', customerSchema);

const server = http.createServer(function (req, res) {
    if (req.url === '/') {
        res.writeHead('200', { 'Content-Type': 'text/html' });
        fs.createReadStream('index.html').pipe(res);
    }
    else if (req.url === '/server' && req.method ==='POST') {
        var rawdata = '';
        req.on('data', function (data) {
            rawdata += data;
        })
        req.on('end', function () {
            var formdata = new URLSearchParams(rawdata);
            res.writeHead('200', { 'Content-Type': 'text/html' });
            customermodel.create({
                movieName:formdata.get('movieName'),
                date:formdata.get('date'),
                time:formdata.get('time'),
                tickets:formdata.get('tickets'),
                email:formdata.get('email'),
                mobile:formdata.get('mobile'),
                payment:formdata.get('payment')
            })

            res.write('Data Saved Successfully');
            res.end();
        })
    }
});
server.listen('8000', function () {
    console.log('Server started at port http://127.0.0.1:8000');
})