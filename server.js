const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended: true})); //mozemy odczytywac dane z formularzy

const Document = require('./models/Document');
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/copybin', 
{useNewUrlParser: true, useUnifiedTopology: true}).then(result => {console.log("connected")}).catch(err => console.log(err))

app.get('/', (req, res) => {
    //res.send('Hello World!');
    const name = `Welcome to CopyBin!
This is a simple web app that allows you
to copy and paste code snippets.`
    const lineNumbers = name.split('\n').length;
    res.render('code', {name, lineNumbers, language: 'plaintext'});
})

app.get('/new', (req, res) => {
    res.render('new', {canSave: true});
})

app.post('/save', async (req, res) => {
    const value = req.body.value;
    try{
        const document = await Document.create({value});
        res.redirect(`/${document.id}`);
    }catch (e)
    {
        console.log(e);
        console.log("error");
        res.render('new', {value});
    }
})

app.get('/:id', async (req, res) => {

    const id = req.params.id;

    try{
        const document = await Document.findById(id);
        res.render('code', {name: document.value, lineNumbers: document.value.split('\n').length, id: req.params.id, canDownload: true});
    }catch(e){
        res.redirect('/');
    }

});


app.get('/download/:id', async (req, res) => {

    const id = req.params.id;

    try{
        const document = await Document.findById(id);
        const text = document.value;
        res.setHeader('Content-type', "application/octet-stream");

        res.setHeader('Content-disposition', 'attachment; filename=file.txt');
        res.send(text);
    }catch(e){
        res.redirect('/');
    }

});


app.listen(3000);
