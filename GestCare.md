# 🏥 GestCare - Sistema de Gestão de Documentos Médicos

Sistema web REST desenvolvido para gerenciamento de documentos médicos pessoais, permitindo ao paciente cadastrar hospitais, consultas, exames, laudos e armazenar arquivos digitais.

Projeto acadêmico do curso de **Análise e Desenvolvimento de Sistemas (ADS)**.

---

# 📌 1. Objetivo do Sistema

O sistema tem como objetivo permitir que o paciente organize e armazene seus documentos médicos de forma digital, centralizada e estruturada.

---

# 🧠 2. Regras de Negócio

## 🧍‍♂️ Paciente

- **RN01** – O nome do paciente é obrigatório.
- **RN02** – A data de nascimento é obrigatória e não pode ser futura.
- **RN03** – O CPF deve ser único no sistema.
- **RN04** – O e-mail deve ser único no sistema.
- **RN05** – A senha é obrigatória e deve possuir no mínimo 6 caracteres.
- **RN06** – O campo `verified` indica se o paciente confirmou seu cadastro.
- **RN07** – O campo `gender` deve aceitar apenas valores válidos (1, 2 ou 3).
- **RN08** – A data de cadastro (`join_date`) deve ser registrada automaticamente pelo sistema.

---

## 🏥 Hospital

- **RN09** – O nome do hospital é obrigatório.
- **RN10** – Todo hospital deve estar vinculado a um paciente.
- **RN11** – Não é permitido cadastrar hospital sem paciente associado.
- **RN12** – Ao excluir um paciente, todos os hospitais vinculados devem ser excluídos (ON DELETE CASCADE).

---

## 📂 Documento (Consultas, Laudos, Exames, Receitas)

- **RN13** – Todo documento deve estar vinculado a um hospital.
- **RN14** – Todo documento deve possuir um tipo válido.
- **RN15** – A data do documento não pode ser futura.
- **RN16** – O sistema deve aceitar apenas arquivos PDF ou imagem (JPG/PNG).
- **RN17** – O nome do arquivo e caminho devem ser armazenados no banco de dados.
- **RN18** – Ao excluir um documento, o arquivo físico deve ser removido do servidor.
- **RN19** – A data de upload deve ser registrada automaticamente.

---

# 📋 3. Casos de Uso

---

## 🎯 UC01 – Cadastrar Paciente

**Ator:** Paciente  
**Descrição:** Permite registrar um novo paciente no sistema.

### Fluxo Principal

1. O usuário informa nome, CPF, data de nascimento, e-mail, senha e gênero.
2. O sistema valida os dados.
3. O sistema verifica se CPF e e-mail já existem.
4. O sistema salva o paciente.
5. O sistema retorna confirmação de cadastro.

### Fluxo Alternativo

- CPF já cadastrado → sistema exibe erro.
- E-mail já cadastrado → sistema exibe erro.
- Data inválida → sistema exibe erro.

---

## 🎯 UC02 – Cadastrar Hospital

**Ator:** Paciente

### Fluxo Principal

1. O paciente informa nome, telefone e endereço.
2. O sistema valida os dados.
3. O sistema associa o hospital ao paciente.
4. O sistema salva o registro.

---

## 🎯 UC03 – Cadastrar Documento

**Ator:** Paciente

### Fluxo Principal

1. O paciente seleciona o hospital.
2. Informa tipo do documento.
3. Informa data e descrição.
4. Anexa arquivo (PDF ou imagem).
5. O sistema valida formato.
6. O sistema salva registro no banco.
7. O sistema salva arquivo na pasta do servidor.

### Fluxo Alternativo

- Arquivo inválido → erro.
- Data futura → erro.

---

## 🎯 UC04 – Listar Documentos

**Ator:** Paciente

### Fluxo Principal

1. O sistema retorna lista de documentos cadastrados.
2. O paciente pode filtrar por tipo ou data.

---

## 🎯 UC05 – Atualizar Documento

**Ator:** Paciente

### Fluxo Principal

1. O paciente seleciona documento.
2. O sistema exibe dados atuais.
3. O paciente altera informações.
4. O sistema valida e salva alterações.

---

## 🎯 UC06 – Excluir Documento

**Ator:** Paciente

### Fluxo Principal

1. O paciente seleciona documento.
2. O sistema solicita confirmação.
3. O sistema remove registro do banco.
4. O sistema remove arquivo físico.

---

# 📌 4. Requisitos Funcionais

- **RF01** – O sistema deve permitir cadastrar paciente.
- **RF02** – O sistema deve permitir cadastrar hospital.
- **RF03** – O sistema deve permitir cadastrar documentos.
- **RF04** – O sistema deve permitir listar documentos.
- **RF05** – O sistema deve permitir excluir documentos.
- **RF06** – O sistema deve permitir atualizar documentos.

---

# ⚙ 5. Requisitos Não Funcionais

- **RNF01** – A aplicação deve seguir arquitetura REST.
- **RNF02** – A comunicação deve ocorrer via HTTP.
- **RNF03** – Os dados devem ser armazenados em MySQL.
- **RNF04** – O sistema deve validar dados antes de persistir.
- **RNF05** – O sistema deve garantir integridade referencial no banco de dados.
- **RNF06** – O sistema deve aceitar apenas arquivos PDF ou imagem para upload.
- **RNF07** – O sistema deve registrar automaticamente datas de criação e upload.

---

# 🏗 6. Arquitetura

- Backend: Java + Spring Boot (API REST)
- Frontend: HTML, CSS, JavaScript
- Banco de Dados: MySQL

Arquitetura em camadas:

- Controller
- Service
- Repository
- Model

---

# 🎓 7. Considerações Acadêmicas

O sistema foi modelado seguindo princípios de:

- Arquitetura REST
- Modelagem Entidade-Relacionamento
- Normalização de banco de dados
- Integridade referencial
- Separação de responsabilidades
- Boas práticas de desenvolvimento

---

**Curso:** Análise e Desenvolvimento de Sistemas  
**Projeto:** TCC Acadêmico  
**Equipe:** GestCare
