# Arquitetura Criptográfica

## Objetivo

Garantir que o servidor MyKeys não possua capacidade de ler os segredos armazenados.

## Hierarquia

1. Senha-mestra
2. KDF Argon2id
3. Key Encryption Key
4. Vault Encryption Key aleatória
5. Chaves por item ou contexto, quando necessário

## Regras

- senha-mestra nunca armazenada;
- hash de autenticação separado de chave de criptografia;
- salt por usuário;
- nonce exclusivo;
- AEAD obrigatório;
- versionamento de algoritmo;
- versionamento de parâmetros;
- rotação;
- migração;
- known-answer tests;
- nenhum algoritmo próprio.

## Payload criptografado

Criptografar:

- nome;
- usuário;
- senha;
- URL;
- notas;
- tags;
- cartões;
- identidades;
- anexos;
- metadados sensíveis.

Persistir no servidor apenas:

- ciphertext;
- nonce;
- versão;
- IDs;
- timestamps estritamente necessários.

## Recuperação

- recovery key obrigatória;
- exibida em fluxo controlado;
- confirmação de armazenamento;
- regeneração com step-up;
- perda da senha e da recovery key implica perda do cofre;
- suporte administrativo não acessa conteúdo.

## Chaves em memória

- nunca localStorage;
- nunca sessionStorage;
- nunca logs;
- nunca Redux persistido;
- nunca Redis;
- minimizar tempo de vida;
- limpar referências quando possível.

## Testes obrigatórios

- vetores conhecidos;
- alteração de bit deve falhar;
- nonce duplicado detectado;
- rotação;
- migração;
- troca de senha-mestra;
- ausência de plaintext no banco;
- ausência de plaintext em logs;
- compatibilidade entre versões.
