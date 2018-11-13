//Packages que serão usados na aplicação
var express = require('express');
var cors = require('cors')
var bodyParser = require('body-parser');
var mysql = require('mysql');
var multer = require('multer');
var upload = multer({dest: 'images/'}); //onde os arquivos serao gravados

//Instanciando a aplicação de definindo a porta
var app = express();
var port = process.env.PORT || 3000;

//Configuração banco de dados
var connection = {
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'receitas'
};

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Definindo a variavel que armazenará as rotas da aplicação
var router = express.Router();

//Definindo as rotas
//Buscar receitas por ID
router.get('/buscar/:id',function(req,res){
    var id = req.params.id;
    
    //console.log(id); //Pegando o ID enviado na requisição
    var BDconnection = mysql.createConnection(connection); //Criando a conexão com o banco
    BDconnection.connect();
    var sentencaSQL = "SELECT * FROM receita WHERE id = " + id;

    BDconnection.query(sentencaSQL, function(err,rows,fields){
        if(!err){
            res.jsonp(rows);
        }else {
            res.jsonp(err);
        }
    });

    BDconnection.end();
});

//Busca de receita por nome
router.get('/buscarPorNome/:nome',function(req,res){
    var nome = req.params.nome;
    
    //console.log(id); //Pegando o ID enviado na requisição
    var BDconnection = mysql.createConnection(connection); //Criando a conexão com o banco
    BDconnection.connect();
    var sentencaSQL = "SELECT * FROM receita WHERE nome LIKE '" + nome + "%'";

    BDconnection.query(sentencaSQL, function(err,rows,fields){
        if(!err){
            res.jsonp(rows);
        }else {
            res.jsonp(err);
        }
    });

    BDconnection.end();
});

//Remover receitas por ID
router.post('/remover', function(req,res){
    var id = req.body.id; //Pegando o ID enviado na requisição
    var BDconnection = mysql.createConnection(connection); //Criando a conexão com o banco
    BDconnection.connect();
    var sentencaSQL = "DELETE FROM receita WHERE id = " + id;

    BDconnection.query(sentencaSQL, function(err,rows,fields){
        if(!err){
            res.jsonp(rows);
        }else {
            res.jsonp(err);
        }
    });

    BDconnection.end();
});

//Atualizar receita
router.post('/atualizar', function(req,res){
    var id = req.body.id; //Pegando o ID enviado na requisição
    var nome = req.body.nome;
    var ingredientes = req.body.ingredientes;
    var descricao = req.body.descricao;
    var nivel = req.body.nivel;
    var tempo = req.body.tempo;
    var rendimento = req.body.rendimento;

    var BDconnection = mysql.createConnection(connection); //Criando a conexão com o banco
    BDconnection.connect();
    var sentencaSQL = "UPDATE receita SET nome = '" + nome + "', ingredientes = '" + ingredientes +
                         "', descricao = '" + descricao + "', nivel = " + nivel +
                        ", tempo = "+ tempo +", rendimento = " + rendimento + " WHERE id = " + id + ";";

    BDconnection.query(sentencaSQL, function(err,rows,fields){
        if(!err){
            res.jsonp(rows);
        }else {
            res.jsonp(err);
        }
    });

    BDconnection.end();
});

//Adicionar uma receita
router.post('/adicionar', function(req,res){
    var nome = req.body.nome;
    var token = req.body.token;
    var ingredientes = req.body.ingredientes;
    var descricao = req.body.descricao;
    var nivel = req.body.nivel;
    var tempo = req.body.tempo;
    var rendimento = req.body.rendimento;

    console.log(nome);
    console.log(descricao);
    console.log(nivel);
    console.log(tempo);

    var BDconnection = mysql.createConnection(connection);
    
    BDconnection.connect();

    var sentencaSQL = "INSERT INTO receita (nome, ingredientes, token, descricao, nivel, tempo, rendimento) VALUES "
    +"( '" + nome + "','" + ingredientes + "','" + token + "', '" + descricao + "' ," + nivel + "," + tempo + "," + rendimento + ");";

    BDconnection.query(sentencaSQL, function(err,rows,fields){
        if(!err){
            res.jsonp(rows);
        }else {
            res.jsonp(err);
        }
    });
    
    BDconnection.end();
});

router.get('/buscarReceitas',function(req,res){
    var BDconnection = mysql.createConnection(connection); //Criando a conexão com o banco
    BDconnection.connect();
    var sentencaSQL = "SELECT * FROM receita";

    BDconnection.query(sentencaSQL, function(err,rows,fields){
        if(!err){
            res.jsonp(rows);
        }else {
            res.jsonp(err);
        }
    });

    BDconnection.end();
});

app.use('/receitas', router);

app.listen(port); //Indicando ao servidor que ele deve ficar 'ouvindo' a porta
console.log('Iniciando a aplicação na porta ' + port);