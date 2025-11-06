import * as clienteService from '../services/clienteService.js';
import * as clienteRepository from '../repository/clienteRepository.js';

// Mock do repository
jest.mock('../repository/clienteRepository.js');

describe('ClienteService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('listarClientes', () => {
        it('deve listar clientes com sucesso', async () => {
            const clientesMock = [
                { id: 1, nome: 'João', email: 'joao@email.com', telefone: '11999999999' },
                { id: 2, nome: 'Maria', email: 'maria@email.com', telefone: '11988888888' }
            ];

            clienteRepository.listar.mockResolvedValue(clientesMock);

            const resultado = await clienteService.listarClientes();

            expect(resultado).toEqual(clientesMock);
            expect(clienteRepository.listar).toHaveBeenCalledTimes(1);
        });

        it('deve lançar erro ao falhar ao listar clientes', async () => {
            clienteRepository.listar.mockRejectedValue(new Error('Erro no banco'));

            await expect(clienteService.listarClientes()).rejects.toThrow('Erro ao listar clientes');
        });
    });

    describe('inserirCliente', () => {
        it('deve inserir cliente com sucesso', async () => {
            const clienteMock = {
                nome: 'João Silva',
                email: 'joao@email.com',
                telefone: '11999999999'
            };

            clienteRepository.inserir.mockResolvedValue(1);

            const resultado = await clienteService.inserirCliente(clienteMock);

            expect(resultado).toBe(1);
            expect(clienteRepository.inserir).toHaveBeenCalledWith(clienteMock);
        });

        it('deve lançar erro quando nome estiver vazio', async () => {
            const clienteInvalido = {
                nome: '',
                email: 'joao@email.com',
                telefone: '11999999999'
            };

            await expect(clienteService.inserirCliente(clienteInvalido))
                .rejects.toThrow('Nome do cliente é obrigatório');
        });

        it('deve lançar erro quando email for inválido', async () => {
            const clienteInvalido = {
                nome: 'João Silva',
                email: 'emailinvalido',
                telefone: '11999999999'
            };

            await expect(clienteService.inserirCliente(clienteInvalido))
                .rejects.toThrow('Email inválido');
        });

        it('deve lançar erro quando telefone estiver vazio', async () => {
            const clienteInvalido = {
                nome: 'João Silva',
                email: 'joao@email.com',
                telefone: ''
            };

            await expect(clienteService.inserirCliente(clienteInvalido))
                .rejects.toThrow('Telefone é obrigatório');
        });
    });

    describe('alterarCliente', () => {
        it('deve alterar cliente com sucesso', async () => {
            const clienteMock = {
                nome: 'João Silva Atualizado',
                email: 'joao@email.com',
                telefone: '11999999999'
            };

            clienteRepository.alterar.mockResolvedValue(1);

            const resultado = await clienteService.alterarCliente(1, clienteMock);

            expect(resultado).toBe(1);
            expect(clienteRepository.alterar).toHaveBeenCalledWith(1, clienteMock);
        });

        it('deve lançar erro quando ID for inválido', async () => {
            const clienteMock = {
                nome: 'João Silva',
                email: 'joao@email.com',
                telefone: '11999999999'
            };

            await expect(clienteService.alterarCliente(null, clienteMock))
                .rejects.toThrow('ID inválido');
        });

        it('deve lançar erro quando cliente não for encontrado', async () => {
            const clienteMock = {
                nome: 'João Silva',
                email: 'joao@email.com',
                telefone: '11999999999'
            };

            clienteRepository.alterar.mockResolvedValue(0);

            await expect(clienteService.alterarCliente(999, clienteMock))
                .rejects.toThrow('Cliente não encontrado');
        });
    });

    describe('removerCliente', () => {
        it('deve remover cliente com sucesso', async () => {
            clienteRepository.remover.mockResolvedValue(1);

            const resultado = await clienteService.removerCliente(1);

            expect(resultado).toBe(1);
            expect(clienteRepository.remover).toHaveBeenCalledWith(1);
        });

        it('deve lançar erro quando ID for inválido', async () => {
            await expect(clienteService.removerCliente(null))
                .rejects.toThrow('ID inválido');
        });

        it('deve lançar erro quando cliente não for encontrado', async () => {
            clienteRepository.remover.mockResolvedValue(0);

            await expect(clienteService.removerCliente(999))
                .rejects.toThrow('Cliente não encontrado');
        });
    });

    describe('verificarOuCriarCliente', () => {
        it('deve retornar cliente existente', async () => {
            const clienteExistente = {
                id: 1,
                nome: 'João Silva',
                email: 'joao@email.com',
                telefone: '11999999999'
            };

            clienteRepository.buscarPorEmailTelefone.mockResolvedValue(clienteExistente);

            const resultado = await clienteService.verificarOuCriarCliente(
                'João Silva',
                'joao@email.com',
                '11999999999'
            );

            expect(resultado).toEqual(clienteExistente);
            expect(clienteRepository.buscarPorEmailTelefone).toHaveBeenCalledWith('joao@email.com', '11999999999');
            expect(clienteRepository.inserirCliente).not.toHaveBeenCalled();
        });

        it('deve criar novo cliente quando não existir', async () => {
            clienteRepository.buscarPorEmailTelefone.mockResolvedValue(null);
            clienteRepository.inserirCliente.mockResolvedValue(10);

            const resultado = await clienteService.verificarOuCriarCliente(
                'João Silva',
                'joao@email.com',
                '11999999999'
            );

            expect(resultado).toEqual({
                id: 10,
                nome: 'João Silva',
                email: 'joao@email.com',
                telefone: '11999999999'
            });
            expect(clienteRepository.inserirCliente).toHaveBeenCalledWith('João Silva', 'joao@email.com', '11999999999');
        });

        it('deve lançar erro ao validar dados inválidos', async () => {
            await expect(clienteService.verificarOuCriarCliente('', 'email@invalido', ''))
                .rejects.toThrow();
        });
    });
});
