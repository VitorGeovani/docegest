/**
 * Componente de Input Acessível - WCAG 2.2
 * Exemplo de formulário totalmente acessível
 */

import React, { useState } from 'react';
import './AccessibleForm.scss';

const AccessibleInput = ({ 
    label, 
    id, 
    type = 'text', 
    required = false,
    error = '',
    helpText = '',
    value,
    onChange,
    ...props 
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const helpId = `${id}-help`;
    const errorId = `${id}-error`;

    return (
        <div className="accessible-input-wrapper">
            <label 
                htmlFor={id}
                className={required ? 'required' : ''}
            >
                {label}
                {required && <span aria-label="obrigatório"> *</span>}
            </label>
            
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                aria-required={required}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={`${helpText ? helpId : ''} ${error ? errorId : ''}`.trim() || undefined}
                className={`accessible-input ${error ? 'has-error' : ''} ${isFocused ? 'is-focused' : ''}`}
                {...props}
            />
            
            {helpText && !error && (
                <span id={helpId} className="help-text">
                    {helpText}
                </span>
            )}
            
            {error && (
                <div id={errorId} className="error-message" role="alert">
                    <span aria-hidden="true">⚠️</span>
                    {error}
                </div>
            )}
        </div>
    );
};

const AccessibleSelect = ({ 
    label, 
    id, 
    required = false,
    error = '',
    helpText = '',
    options = [],
    value,
    onChange,
    ...props 
}) => {
    const helpId = `${id}-help`;
    const errorId = `${id}-error`;

    return (
        <div className="accessible-input-wrapper">
            <label 
                htmlFor={id}
                className={required ? 'required' : ''}
            >
                {label}
                {required && <span aria-label="obrigatório"> *</span>}
            </label>
            
            <select
                id={id}
                value={value}
                onChange={onChange}
                aria-required={required}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={`${helpText ? helpId : ''} ${error ? errorId : ''}`.trim() || undefined}
                className={`accessible-input ${error ? 'has-error' : ''}`}
                {...props}
            >
                <option value="">Selecione uma opção</option>
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            
            {helpText && !error && (
                <span id={helpId} className="help-text">
                    {helpText}
                </span>
            )}
            
            {error && (
                <div id={errorId} className="error-message" role="alert">
                    <span aria-hidden="true">⚠️</span>
                    {error}
                </div>
            )}
        </div>
    );
};

const AccessibleTextarea = ({ 
    label, 
    id, 
    required = false,
    error = '',
    helpText = '',
    value,
    onChange,
    maxLength,
    ...props 
}) => {
    const helpId = `${id}-help`;
    const errorId = `${id}-error`;
    const countId = `${id}-count`;
    const charsRemaining = maxLength ? maxLength - (value?.length || 0) : null;

    return (
        <div className="accessible-input-wrapper">
            <label 
                htmlFor={id}
                className={required ? 'required' : ''}
            >
                {label}
                {required && <span aria-label="obrigatório"> *</span>}
            </label>
            
            <textarea
                id={id}
                value={value}
                onChange={onChange}
                aria-required={required}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={`${helpText ? helpId : ''} ${error ? errorId : ''} ${maxLength ? countId : ''}`.trim() || undefined}
                className={`accessible-input ${error ? 'has-error' : ''}`}
                maxLength={maxLength}
                {...props}
            />
            
            {maxLength && (
                <div id={countId} className="char-count" aria-live="polite">
                    {charsRemaining} caracteres restantes
                </div>
            )}
            
            {helpText && !error && (
                <span id={helpId} className="help-text">
                    {helpText}
                </span>
            )}
            
            {error && (
                <div id={errorId} className="error-message" role="alert">
                    <span aria-hidden="true">⚠️</span>
                    {error}
                </div>
            )}
        </div>
    );
};

const AccessibleCheckbox = ({ 
    label, 
    id, 
    checked,
    onChange,
    ...props 
}) => {
    return (
        <div className="accessible-checkbox-wrapper">
            <input
                type="checkbox"
                id={id}
                checked={checked}
                onChange={onChange}
                className="accessible-checkbox"
                {...props}
            />
            <label htmlFor={id} className="checkbox-label">
                {label}
            </label>
        </div>
    );
};

const AccessibleRadioGroup = ({ 
    legend, 
    name, 
    options = [],
    value,
    onChange,
    required = false
}) => {
    return (
        <fieldset className="accessible-radio-group">
            <legend className={required ? 'required' : ''}>
                {legend}
                {required && <span aria-label="obrigatório"> *</span>}
            </legend>
            <div className="radio-options">
                {options.map(option => (
                    <div key={option.value} className="radio-option">
                        <input
                            type="radio"
                            id={`${name}-${option.value}`}
                            name={name}
                            value={option.value}
                            checked={value === option.value}
                            onChange={() => onChange(option.value)}
                            className="accessible-radio"
                        />
                        <label htmlFor={`${name}-${option.value}`} className="radio-label">
                            {option.label}
                        </label>
                    </div>
                ))}
            </div>
        </fieldset>
    );
};

// Exemplo de uso completo
const AccessibleFormExample = () => {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        telefone: '',
        mensagem: '',
        categoria: '',
        newsletter: false,
        contato: 'email'
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Validação
        const newErrors = {};
        if (!formData.nome.trim()) {
            newErrors.nome = 'Por favor, informe seu nome';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Por favor, informe seu email';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Por favor, informe um email válido';
        }
        
        setErrors(newErrors);
        
        if (Object.keys(newErrors).length === 0) {
            // Enviar formulário
            console.log('Formulário válido:', formData);
            // Simular envio
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert('Formulário enviado com sucesso!');
        }
        
        setIsSubmitting(false);
    };

    return (
        <form 
            onSubmit={handleSubmit}
            className="accessible-form"
            noValidate
            aria-label="Formulário de contato"
        >
            <h2>Entre em Contato</h2>
            <p>Preencha o formulário abaixo e entraremos em contato em breve.</p>

            <AccessibleInput
                label="Nome Completo"
                id="nome"
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                error={errors.nome}
                helpText="Digite seu nome completo como preferir ser chamado"
                autoComplete="name"
            />

            <AccessibleInput
                label="Email"
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
                helpText="Utilizaremos este email para responder sua mensagem"
                autoComplete="email"
            />

            <AccessibleInput
                label="Telefone"
                id="telefone"
                type="tel"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                helpText="Opcional. Formato: (XX) XXXXX-XXXX"
                autoComplete="tel"
            />

            <AccessibleSelect
                label="Categoria"
                id="categoria"
                required
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                options={[
                    { value: 'duvida', label: 'Dúvida' },
                    { value: 'pedido', label: 'Fazer Pedido' },
                    { value: 'sugestao', label: 'Sugestão' },
                    { value: 'reclamacao', label: 'Reclamação' }
                ]}
                helpText="Selecione o assunto da sua mensagem"
            />

            <AccessibleTextarea
                label="Mensagem"
                id="mensagem"
                required
                value={formData.mensagem}
                onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                helpText="Descreva sua mensagem em detalhes"
                maxLength={500}
                rows={5}
            />

            <AccessibleRadioGroup
                legend="Como prefere ser contatado?"
                name="contato"
                required
                value={formData.contato}
                onChange={(value) => setFormData({ ...formData, contato: value })}
                options={[
                    { value: 'email', label: 'Por Email' },
                    { value: 'telefone', label: 'Por Telefone' },
                    { value: 'whatsapp', label: 'Por WhatsApp' }
                ]}
            />

            <AccessibleCheckbox
                label="Desejo receber novidades e promoções por email"
                id="newsletter"
                checked={formData.newsletter}
                onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
            />

            <div className="form-actions">
                <button 
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                >
                    {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                </button>
                <button 
                    type="reset"
                    className="btn btn-outline"
                    onClick={() => {
                        setFormData({
                            nome: '',
                            email: '',
                            telefone: '',
                            mensagem: '',
                            categoria: '',
                            newsletter: false,
                            contato: 'email'
                        });
                        setErrors({});
                    }}
                >
                    Limpar Formulário
                </button>
            </div>
        </form>
    );
};

export { 
    AccessibleInput, 
    AccessibleSelect, 
    AccessibleTextarea,
    AccessibleCheckbox,
    AccessibleRadioGroup,
    AccessibleFormExample 
};
