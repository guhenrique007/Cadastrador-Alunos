const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const {Client} = require('pg');
require('dotenv').config();

//console.log(process.env);

const app = express();

const mustache = mustacheExpress();
mustache.cache = null;
app.engine('mustache', mustache);
app.set('view engine','mustache');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended:false}));

app.get('/alunos',(req,res) => {
    
    const client = new Client();
    client.connect()
        .then(() => {
            return client.query('SELECT id,nome FROM aluno');
        })
        .then((results) => {
            console.log('results?',results);
            res.render('aluno-list',results);
        })
        .catch((err) => {
            console.log('error',err);
            res.send('deu ruim aqui');
        });
});

//ultima funcao q eu to mexendo
app.post('/teste',(req,res) => {
    console.log('post body',req.body.id_aluno);
    const client = new Client();
    client.connect()
        .then(() => {
            return client.query('SELECT * FROM aluno WHERE id='+req.body.id_aluno);
        })
        .then((results) => {
            console.log('results?',results);
            res.render('aluno-info',results);
        })
        .catch((err) => {
            console.log('error', err);
            res.send('deu ruim pra printar as infos de um aluno');
        });
   // res.render('aluno-info');
});

app.get('/aluno/add',(req,res) => {
    res.render('aluno-form');
});

app.post('/aluno/add',(req,res) => {
    console.log('post body',req.body.nome);

    const client = new Client();
    client.connect()
        .then(() => {
            console.log('connection complete');
            const sql = 'INSERT INTO aluno (id,nome,matricula,nota,endereco_id) VALUES ($1,$2,$3,$4,$5)'
            const params = [req.body.id_aluno,req.body.nome,req.body.matricula,req.body.nota,req.body.endereco_id];
            return client.query(sql,params);
        })
        .then((result) => {
            console.log('result?',result);
            //res.redirect('/list');
            alert('Cadastrado com sucesso');
        })
        .catch((err) => {
            console.log('err',err);
            //res.redirect('/list');
        });
    //res.redirect('/list');
});

app.listen(process.env.PORT,() => {
    console.log(`Listening on port ${process.env.PORT}.`);
});