import { jest } from '@jest/globals';

// Mock do repository antes de importar o service
const mockListarProdutos = jest.fn();
const mockListarProdutosDisponiveis = jest.fn();
const mockListarProdutoPorId = jest.fn();
const mockInserirProduto = jest.fn();
const mockAlterarProduto = jest.fn();
const mockRemoverProduto = jest.fn();

jest.unstable_mockModule('../repository/produtoRepository.js', () => ({
    listarProdutos: mockListarProdutos,
    listarProdutosDisponiveis: mockListarProdutosDisponiveis,
    listarProdutoPorId: mockListarProdutoPorId,
    inserirProduto: mockInserirProduto,
    alterarProduto: mockAlterarProduto,
    removerProduto: mockRemoverProduto
}));

const { 
    listarProdutos, 
    listarProdutosDisponiveis,
    buscarProdutoPorId,
    inserirProduto,
    alterarProduto,
    removerProduto
} = await import('../services/produtoService.js');

describe('ProdutoService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('listarProdutos', () => {
        it('deve listar produtos com sucesso', async () => {
            const produtosMock = [
                { id: 1, nome: 'Produto 1', preco: 10, quantidade: 5 },
                { id: 2, nome: 'Produto 2', preco: 20, quantidade: 10 }
            ];

            mockListarProdutos.mockResolvedValue(produtosMock);

            const resultado = await listarProdutos();

            expect(resultado).toEqual(produtosMock);
            expect(mockListarProdutos).toHaveBeenCalledTimes(1);
        });

        it('deve lançar erro ao falhar ao listar produtos', async () => {
            mockListarProdutos.mockRejectedValue(new Error('Erro no banco'));

            await expect(listarProdutos()).rejects.toThrow('Erro ao listar produtos');
        });
    });

    describe('buscarProdutoPorId', () => {
        it('deve buscar produto por ID com sucesso', async () => {
            const produtoMock = { id: 1, nome: 'Produto 1', preco: 10, quantidade: 5 };
            mockListarProdutoPorId.mockResolvedValue(produtoMock);

            const resultado = await buscarProdutoPorId(1);

            expect(resultado).toEqual(produtoMock);
            expect(mockListarProdutoPorId).toHaveBeenCalledWith(1);
        });

        it('deve lançar erro quando ID for inválido', async () => {
            await expect(buscarProdutoPorId(null)).rejects.toThrow('ID inválido');
            await expect(buscarProdutoPorId('abc')).rejects.toThrow('ID inválido');
        });

        it('deve lançar erro quando produto não for encontrado', async () => {
            mockListarProdutoPorId.mockResolvedValue(null);

            await expect(buscarProdutoPorId(999)).rejects.toThrow('Produto não encontrado');
        });
    });

    describe('inserirProduto', () => {
        it('deve inserir produto com sucesso', async () => {
            const produtoMock = {
                nome: 'Novo Produto',
                descricao: 'Descrição do produto',
                preco: 25.50,
                quantidade: 10,
                caminhoImagem: 'imagem.jpg'
            };

            mockInserirProduto.mockResolvedValue(1);

            const resultado = await inserirProduto(produtoMock);

            expect(resultado).toBe(1);
            expect(mockInserirProduto).toHaveBeenCalledWith(produtoMock);
        });

        it('deve lançar erro quando nome estiver vazio', async () => {
            const produtoInvalido = {
                nome: '',
                descricao: 'Descrição',
                preco: 25.50,
                quantidade: 10
            };

            await expect(inserirProduto(produtoInvalido))
                .rejects.toThrow('Nome do produto é obrigatório');
        });

        it('deve lançar erro quando descrição estiver vazia', async () => {
            const produtoInvalido = {
                nome: 'Produto',
                descricao: '',
                preco: 25.50,
                quantidade: 10
            };

            await expect(inserirProduto(produtoInvalido))
                .rejects.toThrow('Descrição do produto é obrigatória');
        });

        it('deve lançar erro quando preço for inválido', async () => {
            const produtoInvalido = {
                nome: 'Produto',
                descricao: 'Descrição',
                preco: 0,
                quantidade: 10
            };

            await expect(inserirProduto(produtoInvalido))
                .rejects.toThrow('Preço deve ser um número válido maior que zero');
        });

        it('deve lançar erro quando quantidade for inválida', async () => {
            const produtoInvalido = {
                nome: 'Produto',
                descricao: 'Descrição',
                preco: 25.50,
                quantidade: -1
            };

            await expect(inserirProduto(produtoInvalido))
                .rejects.toThrow('Quantidade deve ser um número válido maior ou igual a zero');
        });
    });

    describe('alterarProduto', () => {
        it('deve alterar produto com sucesso', async () => {
            const produtoMock = {
                nome: 'Produto Atualizado',
                descricao: 'Descrição atualizada',
                preco: 30.00,
                quantidade: 15
            };

            mockAlterarProduto.mockResolvedValue(1);

            const resultado = await alterarProduto(1, produtoMock);

            expect(resultado).toBe(1);
            expect(mockAlterarProduto).toHaveBeenCalledWith(1, produtoMock);
        });

        it('deve lançar erro quando ID for inválido', async () => {
            const produtoMock = {
                nome: 'Produto',
                descricao: 'Descrição',
                preco: 25.50,
                quantidade: 10
            };

            await expect(alterarProduto(null, produtoMock))
                .rejects.toThrow('ID inválido');
        });

        it('deve lançar erro quando produto não for encontrado', async () => {
            const produtoMock = {
                nome: 'Produto',
                descricao: 'Descrição',
                preco: 25.50,
                quantidade: 10
            };

            mockAlterarProduto.mockResolvedValue(0);

            await expect(alterarProduto(999, produtoMock))
                .rejects.toThrow('Produto não encontrado');
        });
    });

    describe('removerProduto', () => {
        it('deve remover produto com sucesso', async () => {
            mockRemoverProduto.mockResolvedValue(1);

            const resultado = await removerProduto(1);

            expect(resultado).toBe(1);
            expect(mockRemoverProduto).toHaveBeenCalledWith(1);
        });

        it('deve lançar erro quando ID for inválido', async () => {
            await expect(removerProduto(null))
                .rejects.toThrow('ID inválido');
        });

        it('deve lançar erro quando produto não for encontrado', async () => {
            mockRemoverProduto.mockResolvedValue(0);

            await expect(removerProduto(999))
                .rejects.toThrow('Produto não encontrado');
        });
    });

    describe('listarProdutosDisponiveis', () => {
        it('deve listar apenas produtos disponíveis', async () => {
            const produtosDisponiveis = [
                { id: 1, nome: 'Produto 1', quantidade: 5 },
                { id: 2, nome: 'Produto 2', quantidade: 10 }
            ];

            mockListarProdutosDisponiveis.mockResolvedValue(produtosDisponiveis);

            const resultado = await listarProdutosDisponiveis();

            expect(resultado).toEqual(produtosDisponiveis);
            expect(mockListarProdutosDisponiveis).toHaveBeenCalledTimes(1);
        });
    });
});
