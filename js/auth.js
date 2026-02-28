/* ========================================
   GESTCARE - AUTENTICAÇÃO
   Validação login + cadastro + máscaras
   ======================================== */

'use strict';

// =============================================
// UTILITÁRIOS
// =============================================

function safeGetElement(id) {
    if (typeof id !== 'string' || !id) return null;
    return document.getElementById(id);
}

function safeGetValue(id) {
    const el = safeGetElement(id);
    if (!el) return '';
    return (el.value || '').trim();
}

// =============================================
// MÁSCARAS
// =============================================

function maskCPF(input) {
    if (!input) return;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 9) value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    else if (value.length > 6) value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    else if (value.length > 3) value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    input.value = value;
}

function maskPhone(input) {
    if (!input) return;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 6) value = value.replace(/(\d{2})(\d{5})(\d{1,4})/, '($1) $2-$3');
    else if (value.length > 2) value = value.replace(/(\d{2})(\d{1,5})/, '($1) $2');
    else if (value.length > 0) value = value.replace(/(\d{1,2})/, '($1');
    input.value = value;
}

// =============================================
// EXIBIR MENSAGENS
// =============================================

function showMessage(elementId, text, type) {
    const el = safeGetElement(elementId);
    if (!el) return;
    el.textContent = String(text);
    el.className = 'message ' + (type === 'success' ? 'success' : 'error');
    el.style.display = 'flex';
    setTimeout(() => { if (el) el.style.display = 'none'; }, 4000);
}

// =============================================
// VALIDAÇÃO DO LOGIN
// =============================================

function setupLoginForm() {
    const form = safeGetElement('login-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = safeGetValue('email');
        const password = safeGetValue('password');

        if (!email || !password) {
            showMessage('login-message', '⚠️ Preencha todos os campos.', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('login-message', '⚠️ Digite um e-mail válido.', 'error');
            return;
        }

        if (password.length < 6) {
            showMessage('login-message', '⚠️ A senha deve ter pelo menos 6 caracteres.', 'error');
            return;
        }

        showMessage('login-message', '✅ Login realizado com sucesso!', 'success');
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 1000);
    });
}

// =============================================
// VALIDAÇÃO DO CADASTRO
// =============================================

function setupCadastroForm() {
    const form = safeGetElement('cadastro-form');
    if (!form) return;

    const cpfInput = safeGetElement('cpf');
    if (cpfInput) cpfInput.addEventListener('input', () => maskCPF(cpfInput));

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nome = safeGetValue('nome');
        const cpf = safeGetValue('cpf');
        const nascimento = safeGetValue('nascimento');
        const email = safeGetValue('email-cadastro');
        const senha = safeGetValue('senha');
        const confirmarSenha = safeGetValue('confirmar-senha');
        const genero = safeGetValue('genero');

        if (!nome || !cpf || !nascimento || !email || !senha || !confirmarSenha || !genero) {
            showMessage('cadastro-message', '⚠️ Preencha todos os campos.', 'error');
            return;
        }

        if (nome.split(/\s+/).filter(Boolean).length < 2) {
            showMessage('cadastro-message', '⚠️ Informe o nome completo (nome e sobrenome).', 'error');
            return;
        }

        const cpfDigits = cpf.replace(/\D/g, '');
        if (cpfDigits.length !== 11) {
            showMessage('cadastro-message', '⚠️ CPF deve conter 11 dígitos.', 'error');
            return;
        }
        if (/^(\d)\1{10}$/.test(cpfDigits)) {
            showMessage('cadastro-message', '⚠️ CPF inválido.', 'error');
            return;
        }

        const birthDate = new Date(nascimento);
        const today = new Date();
        if (isNaN(birthDate.getTime()) || birthDate > today) {
            showMessage('cadastro-message', '⚠️ Data de nascimento inválida.', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('cadastro-message', '⚠️ Digite um e-mail válido.', 'error');
            return;
        }

        if (senha.length < 6) {
            showMessage('cadastro-message', '⚠️ A senha deve ter pelo menos 6 caracteres.', 'error');
            return;
        }

        if (senha !== confirmarSenha) {
            showMessage('cadastro-message', '⚠️ As senhas não coincidem.', 'error');
            return;
        }

        if (!['1', '2', '3'].includes(genero)) {
            showMessage('cadastro-message', '⚠️ Selecione um gênero válido.', 'error');
            return;
        }

        showMessage('cadastro-message', '✅ Cadastro realizado com sucesso! Redirecionando...', 'success');
        form.reset();
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
    });
}

// =============================================
// INICIALIZAÇÃO
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    setupLoginForm();
    setupCadastroForm();
});
