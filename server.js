const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const {Client} = require('pg');
var async = require('async');
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
app.get('/gerais',async (req,res) => {
    const client = new Client();
    const data = new Object();
    client.connect()
        .then(() => {
            return client.query('SELECT COUNT(nome)alunosporbairro ,AVG(nota) media,'+
            ' bairro FROM aluno INNER JOIN endereco ON aluno.endereco_id = endereco.id GROUP BY bairro');
            //return Promise.all([client.query('SELECT * FROM aluno'),client.query('SELECT * FROM endereco')]);
        })
        .then((results) => {
            console.log('results?',results);
            res.render('geral-info',results);
                //result1:results[0].data,result2:results[1].data});
        })
        .catch((err) => {
            console.log('error',err);
            res.send('deu ruim aqui');
        });

});

app.post('/gerais',(req,res)=>{
    console.log('post body',req.body.id_aluno);
    const client = new Client();
    client.connect()
        .then(() => {
            
            return client.query('SELECT COUNT(nome) qtde FROM aluno');
        })
        .then((results) => {
            console.log('results?',results);
            res.render('geral-info',results);
        })
        .catch((err) => {
            console.log('error', err);
            res.send('deu ruim pra printar as infos de um aluno');
        });
})


app.post('/teste',(req,res) => {
    console.log('post body',req.body.id_aluno);
    const client = new Client();
    client.connect()
        .then(() => {
            
            return client.query('SELECT * FROM aluno INNER JOIN endereco ON aluno.endereco_id = endereco.id WHERE aluno.id='+req.body.id_aluno);
            
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
            let msgErro='oi';
            if(req.body.id_aluno=='' || req.body.nome=='' || req.body.matricula==''||req.body.nota=='',req.body.endereco_id==''){
                msgErro = 'Você deixou um dos campos vazios, não foi possível cadastrar';
            }else{
                msgErro = 'Você tentou cadastrar com um id de aluno já existente, tente um novo id'
                +'<br> Também é possível que você selecionou um endereço que não exista na nossa base de dados.'
                +'Tente cadastrar um novo endereço, ou selecione um endereço já cadastrado.'
            }
            res.send(msgErro);
        });
    //res.redirect('/list');
});

app.post('/endereco/add',(req,res) => {
    console.log('post body',req.body.nome);

    const client = new Client();
    client.connect()
        .then(() => {
            console.log('connection complete');
            const sql = 'INSERT INTO endereco (id,rua,numero,bairro) VALUES ($1,$2,$3,$4)'
            const params = [req.body.id_endereco,req.body.rua,req.body.numero,req.body.bairro];
            return client.query(sql,params);
        })
        .then((result) => {
            console.log('result?',result);
            res.send('SUCESSO');
            alert('Cadastrado com sucesso');
        })
        .catch((err) => {
            console.log('err',err);
            res.send('Você tentou cadastrar com um id já existente, tente um novo id');
        });
    //res.redirect('/list');
});

app.listen(process.env.PORT,() => {
    console.log(`Listening on port ${process.env.PORT}.`);
});

app.post('/endereco-list',(req,res) => {
    
    const client = new Client();
    client.connect()
        .then(() => {
            return client.query('SELECT * FROM endereco');
        })
        .then((results) => {
            console.log('results?',results);
            res.render('endereco-form',results);
        })
        .catch((err) => {
            console.log('error',err);
            res.send('deu ruim aqui');
        });
});

function verificaCampos(){
    alert('Verificando...')
}