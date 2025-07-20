# CRUD API NestJS

API CRUD desenvolvida com NestJS.

## Requisitos

- Docker instalado  
[Link para download do Docker](https://www.docker.com/)

## Como executar o projeto

Após clonar o repositório, execute o seguinte comando na raiz do projeto:

```bash
docker compose up -d
```

### Links

- Links úteis do projeto

[Collecion Postman](https://www.postman.com/altimetry-specialist-72965033/workspace/crud-nestjs-api-rest/collection/31846039-bd639523-fdc0-4cce-895b-bcbbfe49543d?action=share&source=copy-link&creator=31846039)

[Documentação das Rotas com Swagger *Necessário rodar projeto*](http://localhost:3000/api-docs)


### Comandos

- Testes unitátios:

Após rodar o projeto, execute o seguinte comando na raiz:

```bash
docker exec -it nest_app sh
```

E então, dentro do contianer execute o comando:

```bash
npm run test
```
