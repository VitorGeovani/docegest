import { describe, it, expect } from '@jest/globals';
import { 
    validarEmail, 
    validarNumeroPositivo, 
    validarNumeroNaoNegativo,
    validarStringNaoVazia,
    validarId,
    validarData,
    validarHorario,
    validarTelefone,
    formatarMoeda,
    formatarDataBR
} from '../utils/validators.js';

describe('Validators - Validações', () => {
    describe('validarEmail', () => {
        it('deve validar email correto', () => {
            expect(validarEmail('teste@email.com')).toBe(true);
            expect(validarEmail('usuario.teste@dominio.com.br')).toBe(true);
        });

        it('deve rejeitar email inválido', () => {
            expect(validarEmail('emailinvalido')).toBe(false);
            expect(validarEmail('email@')).toBe(false);
            expect(validarEmail('@dominio.com')).toBe(false);
            expect(validarEmail('')).toBe(false);
            expect(validarEmail(null)).toBe(false);
        });
    });

    describe('validarNumeroPositivo', () => {
        it('deve validar números positivos', () => {
            expect(validarNumeroPositivo(1)).toBe(true);
            expect(validarNumeroPositivo(10.5)).toBe(true);
            expect(validarNumeroPositivo(100)).toBe(true);
        });

        it('deve rejeitar números não positivos', () => {
            expect(validarNumeroPositivo(0)).toBe(false);
            expect(validarNumeroPositivo(-1)).toBe(false);
            expect(validarNumeroPositivo('abc')).toBe(false);
            expect(validarNumeroPositivo(null)).toBe(false);
        });
    });

    describe('validarNumeroNaoNegativo', () => {
        it('deve validar números não negativos', () => {
            expect(validarNumeroNaoNegativo(0)).toBe(true);
            expect(validarNumeroNaoNegativo(1)).toBe(true);
            expect(validarNumeroNaoNegativo(10.5)).toBe(true);
        });

        it('deve rejeitar números negativos', () => {
            expect(validarNumeroNaoNegativo(-1)).toBe(false);
            expect(validarNumeroNaoNegativo(-10.5)).toBe(false);
            expect(validarNumeroNaoNegativo('abc')).toBe(false);
        });
    });

    describe('validarStringNaoVazia', () => {
        it('deve validar strings não vazias', () => {
            expect(validarStringNaoVazia('texto')).toBe(true);
            expect(validarStringNaoVazia('  texto  ')).toBe(true);
        });

        it('deve rejeitar strings vazias', () => {
            expect(validarStringNaoVazia('')).toBe(false);
            expect(validarStringNaoVazia('   ')).toBe(false);
            expect(validarStringNaoVazia(null)).toBe(false);
        });
    });

    describe('validarId', () => {
        it('deve validar IDs válidos', () => {
            expect(validarId(1)).toBe(true);
            expect(validarId(100)).toBe(true);
            expect(validarId('5')).toBe(true);
        });

        it('deve rejeitar IDs inválidos', () => {
            expect(validarId(0)).toBe(false);
            expect(validarId(-1)).toBe(false);
            expect(validarId('abc')).toBe(false);
            expect(validarId(null)).toBe(false);
        });
    });

    describe('validarData', () => {
        it('deve validar datas válidas', () => {
            expect(validarData('2025-05-15')).toBe(true);
            expect(validarData('2025-01-01')).toBe(true);
        });

        it('deve rejeitar datas inválidas', () => {
            expect(validarData('15/05/2025')).toBe(false);
            expect(validarData('2025-13-01')).toBe(false);
            expect(validarData('data-invalida')).toBe(false);
            expect(validarData('')).toBe(false);
            expect(validarData(null)).toBe(false);
        });
    });

    describe('validarHorario', () => {
        it('deve validar horários válidos', () => {
            expect(validarHorario('14:30')).toBe(true);
            expect(validarHorario('00:00')).toBe(true);
            expect(validarHorario('23:59')).toBe(true);
        });

        it('deve rejeitar horários inválidos', () => {
            expect(validarHorario('25:00')).toBe(false);
            expect(validarHorario('14:60')).toBe(false);
            expect(validarHorario('14h30')).toBe(false);
            expect(validarHorario('')).toBe(false);
            expect(validarHorario(null)).toBe(false);
        });
    });

    describe('validarTelefone', () => {
        it('deve validar telefones válidos', () => {
            expect(validarTelefone('11999999999')).toBe(true);
            expect(validarTelefone('1133334444')).toBe(true);
            expect(validarTelefone('(11) 99999-9999')).toBe(true);
            expect(validarTelefone('(11) 3333-4444')).toBe(true);
        });

        it('deve rejeitar telefones inválidos', () => {
            expect(validarTelefone('123')).toBe(false);
            expect(validarTelefone('abc')).toBe(false);
            expect(validarTelefone('')).toBe(false);
            expect(validarTelefone(null)).toBe(false);
        });
    });
});

describe('Validators - Formatação', () => {
    describe('formatarMoeda', () => {
        it('deve formatar valores corretamente', () => {
            const valor1 = formatarMoeda(10);
            const valor2 = formatarMoeda(10.50);
            const valor3 = formatarMoeda(1000);
            
            expect(valor1).toContain('10,00');
            expect(valor2).toContain('10,50');
            expect(valor3).toContain('1.000,00');
        });
    });

    describe('formatarDataBR', () => {
        it('deve formatar datas corretamente', () => {
            expect(formatarDataBR('2025-05-15')).toBe('15/05/2025');
            expect(formatarDataBR('2025-01-01')).toBe('01/01/2025');
        });

        it('deve retornar string vazia para data inválida', () => {
            expect(formatarDataBR('')).toBe('');
            expect(formatarDataBR(null)).toBe('');
        });
    });
});
