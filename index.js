const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

const alunos = [];

function alunoExists(request, response, next) {
    const { id } = request.params;
    const aluno = alunos.find(aluno => aluno.id === id);

    if (!aluno) {
        return response.status(404).json({ erro: "Aluno não encontrado" })
    } else {
        request.aluno = aluno;
        return next();
    }
}

// Responsável por listar os alunos.
app.get("/aluno", (request, response) => {
    return response.status(200).json(alunos);
});

// Responsável por listar aluno por ID.
app.get("/aluno/:id", alunoExists, (request, response) => {
    const { aluno } = request;
    return response.status(200).json(aluno);
});

// Responsável por cadastrar um aluno.
app.post("/aluno", (request, response) => {
    const { nome } = request.body;

    alunos.push({
        id: uuidv4(),
        nome: nome
    });

    return response.status(201).json(alunos[alunos.length - 1]);

});

// Responsável por atualizar um aluno.
app.put("/aluno/:id", alunoExists, (request, response) => {
    const { aluno } = request;
    const { nome } = request.body;
    aluno.nome = nome;
    return response.status(200).json(aluno);
});

// Responsável por deletar um aluno.
app.delete("/aluno/:id", alunoExists, (request, response) => {
    const { aluno } = request;
    const indexOfAluno = alunos.indexOf(aluno);
    alunos.splice(indexOfAluno, 1);
    return response.sendStatus(204);
});

module.exports = app;