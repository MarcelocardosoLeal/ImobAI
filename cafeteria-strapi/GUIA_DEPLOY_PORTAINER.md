# Guia de Implantação (Deploy) com Portainer

Este guia explica como implantar a aplicação Strapi `cafeteria-strapi` em um ambiente Docker gerenciado pelo Portainer.

## Resumo do Processo

O processo consiste em usar o Git como ponte entre os arquivos de configuração locais e o Portainer. O Portainer irá clonar um repositório Git, ler o arquivo `docker-compose.yml` e construir a aplicação conforme definido no `Dockerfile`, usando as variáveis de ambiente para configurar os segredos.

## Arquivos Criados

Os seguintes arquivos foram adicionados a este projeto para permitir a implantação com Docker e Portainer:

### 1. `Dockerfile`

*   **O que é?** É uma "receita" que ensina o Docker a construir uma imagem da aplicação Strapi.
*   **O que ele faz?**
    *   Define a versão do Node.js a ser usada.
    *   Copia os arquivos da aplicação para dentro da imagem.
    *   Instala as dependências do projeto com `npm install`.
    *   Executa o comando `npm run build` para compilar a aplicação Strapi para produção.
    *   Expõe a porta `1337` para que a aplicação possa ser acessada.
    *   Define o comando `npm run start` para iniciar o servidor Strapi quando o contêiner for executado.

### 2. `docker-compose.yml`

*   **O que é?** É o arquivo "maestro" que orquestra múltiplos contêineres. O Portainer o utiliza para definir uma "Stack".
*   **O que ele faz?**
    *   Define dois serviços (contêineres) que trabalharão juntos:
        1.  `strapi`: A própria aplicação Strapi, que será construída usando o `Dockerfile`.
        2.  `postgres`: Um banco de dados PostgreSQL, que é mais robusto para produção do que o SQLite original do projeto.
    *   Configura a comunicação de rede entre os dois contêineres.
    *   Mapeia a porta `1337` do contêiner Strapi para a porta `1337` da sua máquina host.
    *   Define volumes para persistir os dados do banco de dados (`postgres-data`) e os uploads do Strapi (`strapi-uploads`), garantindo que você não perca dados se os contêineres forem recriados.
    *   Carrega as variáveis de ambiente do arquivo `.env` para configurar as conexões e segredos.

### 3. `.env`

*   **O que é?** Um arquivo para armazenar variáveis de ambiente, como senhas, chaves de API e outras informações sensíveis.
*   **IMPORTANTE:** **NUNCA, JAMAIS** envie este arquivo para um repositório Git público. Ele contém segredos! O arquivo `.gitignore` já está configurado para ignorá-lo.
*   **O que ele faz?** Fornece ao `docker-compose.yml` todas as informações de configuração necessárias, como:
    *   Credenciais do banco de dados (usuário, senha, nome do banco).
    *   Segredos de segurança do Strapi (JWT Secret, Admin JWT Secret, etc.).

---

## Passo a Passo para Implantação no Portainer

### Passo 1: Preparar o Repositório no GitHub

Como este projeto foi clonado de outro usuário, você precisa enviá-lo para um repositório seu.

1.  **Crie um Fork:** Vá para a página do repositório original (`https://github.com/gabriel-mend/cafeteria-strapi`) e clique em **"Fork"** para criar uma cópia na sua conta do GitHub.
2.  **Envie os Arquivos:** Use os comandos `git` para enviar os novos arquivos (`Dockerfile`, `docker-compose.yml`, `GUIA_DEPLOY_PORTAINER.md`) para o **seu** repositório "forkado".
    *   `git add Dockerfile docker-compose.yml GUIA_DEPLOY_PORTAINER.md`
    *   `git commit -m "Adiciona configuração para deploy com Docker e Portainer"`
    *   `git push origin main` (ou a branch que você estiver usando)

### Passo 2: Configurar a Stack no Portainer

1.  Acesse seu Portainer e vá para **Stacks > Add stack**.
2.  **Name:** Dê um nome para a stack (ex: `cafeteria-strapi`).
3.  **Build method:** Selecione **Repository**.
4.  **Repository URL:** Cole a URL do **SEU** repositório "forkado" (ex: `https://github.com/seu-usuario/cafeteria-strapi.git`).
5.  **Compose path:** Mantenha o padrão `docker-compose.yml`.
6.  **Environment variables:** Esta é a parte crucial para a segurança.
    *   Role a página para baixo até a seção "Environment variables".
    *   Clique em **"Add environment variable"** para cada linha do seu arquivo `.env` local.
    *   Copie o **NOME** e o **VALOR** de cada variável do seu arquivo `.env` para os campos correspondentes no Portainer.
    *   **Lembre-se de usar uma senha forte para o banco de dados.**

### Passo 3: Implantar

1.  Após adicionar todas as variáveis de ambiente, role até o final da página e clique em **Deploy the stack**.
2.  O Portainer irá baixar seu repositório, ler o `docker-compose.yml`, construir a imagem do Strapi e iniciar os contêineres.
3.  Aguarde alguns minutos. Após a conclusão, sua aplicação Strapi estará disponível no endereço `http://<ip-do-seu-servidor-docker>:1337`.

Seguindo estes passos, você terá uma implantação segura e escalável da sua aplicação.