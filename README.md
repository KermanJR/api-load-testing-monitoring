# Projeto de Teste de Carga e Monitoramento de Desempenho de API monolítica com JMeter, Prometheus e Grafana

Este projeto visa implementar um sistema de monitoramento de desempenho para uma API com arquitetura monolítica utilizando Apache JMeter, Prometheus e Grafana. Ele permite realizar testes de carga na API, coletar métricas de desempenho e visualizar essas métricas em tempo real no Grafana.


## Sumário
- Tecnologias utilizadas
- Pré-requisitos
- Arquitetura do Projeto
- Configuração e Execução
- Uso do Grafana para Visualização
- Contribuição
- Licensa


## Pré-requisitos
Antes de começar, certifique-se de ter os seguintes softwares instalados em sua máquina:
- Docker
- Docker Compose
- Apache JMeter

## Tecnologias Utilizadas
Este projeto utiliza as seguintes tecnologias:
- Node.js: Plataforma JavaScript para desenvolvimento de aplicações server-side.
- Express: Framework web para Node.js, utilizado para construir a API.
- PostgreSQL: Banco de dados relacional utilizado pela API.
- Apache JMeter: Ferramenta de teste de carga para medir o desempenho da API.
- Prometheus: Sistema de monitoramento e coleta de métricas.
- Grafana: Plataforma de análise e visualização de métricas.

## Arquitetura do Projeto
O projeto é composto pelos seguintes serviços:
- API: Serviço principal que será testado
- Banco de Dados (PostgreSQL): Banco de dados utilizado pela API.
- Prometheus: Coleta métricas da API e do JMeter 
- Grafana: Visualiza as métricas coletadas pelo Prometheus.
- JMeter: Realiza testes de carga na API e expõe métricas via Prometheus Listener.

## Configuração e Execução
### Passo 1: Configurar Variáveis de Ambiente
#### Crie um arquivo .env na raiz do projeto e defina as variáveis de ambiente necessárias:
- DB_USER=seu_usuario
- DB_PASSWORD=sua_senha
- DB_NAME=nome_do_banco
- DB_HOST=db
- JWT_SECRET=sua_chave_secreta

### Passo 2: Construir e Executar os Contêineres
#### Use o Docker Compose para construir e executar os contêineres:
- $ docker-compose up -d

### Passo 3: Verificar os Serviços
#### Verifique se todos os serviços estão rodando corretamente:
- $ docker-compose ps

### Passo 4: Verificar Logs dos Contêineres
#### Você pode verificar os logs dos contêineres para garantir que não há erros:
- $ docker-compose logs




## Uso do Grafana para Visualização
### Acessar o Grafana
#### Abra o Grafana no navegador:
- $ http://localhost:3001

### Configurar a Fonte de Dados

Vá para Configuration > Data Sources.
Adicione uma nova fonte de dados do tipo Prometheus.
Configure a URL do Prometheus: http://prometheus:9090.
Salve e teste a conexão.

### Criar um Dashboard
Vá para Create > Dashboard.
Adicione painéis para visualizar as métricas coletadas, como latência, taxa de erros e throughput.

### Exemplos de Consultas PromQL
#### Latência das Requisições: 
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[1m])) by (le, method, route, status_code))

#### Taxa de Erros: 
sum(rate(http_errors_total[1m])) by (method, route, status_code)


#### Throughput:
sum(rate(http_requests_total[1m])) by (method, route)






## Contribuição

- Fork este repositório.
- Crie uma branch: git checkout -b minha-nova-feature.
- Faça suas alterações e confirme-as: git commit -m 'Adiciona nova feature'.
- Envie para o branch original: git push origin minha-nova-feature.
- Crie uma solicitação pull.
## Licença

Este projeto está licenciado sob a Licença [MIT](https://choosealicense.com/licenses/mit/).
Veja o arquivo LICENSE para mais detalhes.

