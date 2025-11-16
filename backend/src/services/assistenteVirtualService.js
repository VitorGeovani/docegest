import connection from '../repository/connection.js';

/**
 * 🤖 ASSISTENTE VIRTUAL INTELIGENTE - DOCEGEST
 * Sistema de IA para atendimento automatizado
 * 
 * Funcionalidades:
 * - Processamento de linguagem natural (NLP)
 * - Base de conhecimento dinâmica
 * - Aprendizado com interações
 * - Integração com WhatsApp
 * - Estatísticas de atendimento
 */

class AssistenteVirtualService {
    constructor() {
        this.baseConhecimento = this.inicializarBaseConhecimento();
        this.historicoConversa = new Map(); // telefone -> mensagens[]
    }

    /**
     * Base de conhecimento do sistema
     */
    inicializarBaseConhecimento() {
        return {
            // 🛒 PEDIDOS E COMPRAS
            pedidos: {
                palavrasChave: ['pedido', 'comprar', 'encomendar', 'reservar', 'fazer pedido', 'quero', 'gostaria', 'consultar', 'status', 'rastrear', 'acompanhar'],
                intencoes: [
                    {
                        // PRIORIDADE 1: Consultar status (antes de "fazer pedido")
                        pergunta: /(consultar|ver|checar|verificar|qual|quero ver|quero consultar|rastrear|acompanhar)?\s*(o\s*)?(status|onde está)/i,
                        resposta: `📦 *Consultar status do pedido:*\n\n` +
                            `Para consultar seu pedido, informe:\n` +
                            `• O código do pedido (ex: #PED000037), OU\n` +
                            `• Seu telefone/email de cadastro\n\n` +
                            `💡 *Dica:* Você pode digitar o código diretamente!\n` +
                            `Exemplo: #PED000037\n\n` +
                            `📱 Dúvidas? (11) 96769-6744`,
                        categoria: 'status',
                        acaoEspecial: 'buscarPedido'
                    },
                    {
                        // PRIORIDADE 2: Fazer pedido
                        pergunta: /como (fazer|realizar|faço).*(pedido|encomenda)/i,
                        resposta: `🛒 *Como fazer um pedido:*\n\n` +
                            `1️⃣ Acesse nosso catálogo: https://segredodosabor.com/catalogo\n` +
                            `2️⃣ Escolha seus produtos favoritos\n` +
                            `3️⃣ Adicione ao carrinho\n` +
                            `4️⃣ Personalize (se desejar)\n` +
                            `5️⃣ Finalize o pedido\n\n` +
                            `💡 Você também pode fazer pedidos pelo WhatsApp!\n` +
                            `📱 (11) 96769-6744`,
                        categoria: 'pedido'
                    },
                    {
                        pergunta: /(cancelar|desistir|não quero).*(pedido|encomenda)/i,
                        resposta: `❌ *Cancelamento de pedido:*\n\n` +
                            `Para cancelar, você precisa:\n` +
                            `1️⃣ Informar o código do pedido\n` +
                            `2️⃣ Solicitar via WhatsApp ou site\n` +
                            `3️⃣ Aguardar confirmação\n\n` +
                            `⚠️ Pedidos em produção podem não ser cancelados.\n\n` +
                            `Fale conosco: 📱 (11) 96769-6744`,
                        categoria: 'cancelamento'
                    }
                ]
            },

            // 🍰 PRODUTOS E CARDÁPIO
            produtos: {
                palavrasChave: ['produto', 'cardápio', 'menu', 'doce', 'sabor', 'bolo', 'sorvete', 'brigadeiro'],
                intencoes: [
                    {
                        pergunta: /(cardápio|menu|produtos|o que tem|que tipo)/i,
                        resposta: `🍰 *Nosso Cardápio:*\n\n` +
                            `🍦 Sorvetes Artesanais (15+ sabores)\n` +
                            `🧁 Bolos Decorados\n` +
                            `🍫 Brigadeiros Gourmet\n` +
                            `🎂 Tortas e Mousses\n` +
                            `🍩 Doces Especiais\n` +
                            `🥧 Opções Sem Açúcar\n\n` +
                            `Veja todos: https://segredodosabor.com/catalogo\n\n` +
                            `💡 *Personalização total disponível!*`,
                        categoria: 'cardapio'
                    },
                    {
                        pergunta: /(preço|valor|custa|quanto|promoção)/i,
                        resposta: `💰 *Preços e Promoções:*\n\n` +
                            `Os preços variam de acordo com:\n` +
                            `• Tipo de produto\n` +
                            `• Tamanho escolhido\n` +
                            `• Personalizações\n\n` +
                            `📱 Consulte valores atualizados em:\n` +
                            `https://segredodosabor.com/catalogo\n\n` +
                            `🎉 *Promoções especiais* toda semana!`,
                        categoria: 'preco'
                    },
                    {
                        pergunta: /(personalizar|customizar|mudar|sem|adicionar|extra)/i,
                        resposta: `✨ *Personalização Total:*\n\n` +
                            `Você pode:\n` +
                            `✅ Remover ingredientes (alergias)\n` +
                            `✅ Adicionar extras\n` +
                            `✅ Escolher tamanhos\n` +
                            `✅ Mudar sabores\n` +
                            `✅ Criar combinações únicas\n\n` +
                            `O preço ajusta automaticamente! 💫\n\n` +
                            `Experimente: https://segredodosabor.com/catalogo`,
                        categoria: 'personalizacao'
                    }
                ]
            },

            // 🚚 ENTREGA E RETIRADA
            entrega: {
                palavrasChave: ['entregar', 'entrega', 'retirar', 'retirada', 'buscar', 'pegar', 'delivery'],
                intencoes: [
                    {
                        pergunta: /(como|onde|quando).*(entregar|entrega|delivery)/i,
                        resposta: `🚚 *Entrega e Retirada:*\n\n` +
                            `📍 *Retirada na loja:* Gratuita!\n` +
                            `Endereço: R. Exemplo, 123 - SP\n` +
                            `Horário: Seg-Sáb 9h-18h\n\n` +
                            `🏠 *Delivery:* Consulte taxa\n` +
                            `Raio de 10km\n` +
                            `Tempo médio: 30-45min\n\n` +
                            `💡 Escolha no checkout!`,
                        categoria: 'entrega'
                    },
                    {
                        pergunta: /(prazo|quanto tempo|demora|quando fica pronto)/i,
                        resposta: `⏱️ *Prazos de Produção:*\n\n` +
                            `🏃 *Produtos prontos:* Retirada imediata\n` +
                            `👨‍🍳 *Sob encomenda:* 24-48h\n` +
                            `🎂 *Bolos decorados:* 48-72h\n` +
                            `🎉 *Eventos:* A combinar\n\n` +
                            `⚡ Pedidos urgentes? Consulte disponibilidade!\n` +
                            `📱 (11) 96769-6744`,
                        categoria: 'prazo'
                    }
                ]
            },

            // 💳 PAGAMENTO
            pagamento: {
                palavrasChave: ['pagar', 'pagamento', 'pix', 'cartão', 'dinheiro', 'parcelar'],
                intencoes: [
                    {
                        pergunta: /(forma|como|aceita).*(pagamento|pagar|pix|cartão)/i,
                        resposta: `💳 *Formas de Pagamento:*\n\n` +
                            `✅ PIX (desconto de 5%)\n` +
                            `✅ Cartão de Crédito/Débito\n` +
                            `✅ Dinheiro\n` +
                            `✅ Vale-Presente\n\n` +
                            `💰 *Parcelamento:* Até 3x sem juros\n\n` +
                            `🎁 *PIX tem desconto especial!*`,
                        categoria: 'pagamento'
                    }
                ]
            },

            // ♿ ACESSIBILIDADE
            acessibilidade: {
                palavrasChave: ['acessibilidade', 'libras', 'deficiente', 'cadeirante', 'surdo', 'cego'],
                intencoes: [
                    {
                        pergunta: /(acessibilidade|libras|deficiente|inclusão)/i,
                        resposta: `♿ *Acessibilidade Total:*\n\n` +
                            `✅ VLibras integrado (LIBRAS)\n` +
                            `✅ Navegação por teclado\n` +
                            `✅ Leitores de tela compatíveis\n` +
                            `✅ Alto contraste\n` +
                            `✅ Textos ampliáveis\n` +
                            `✅ WCAG 2.2 AAA certificado\n\n` +
                            `🎉 *Primeiro e-commerce 100% acessível do Brasil!*\n\n` +
                            `Todos são bem-vindos! 💜`,
                        categoria: 'acessibilidade'
                    }
                ]
            },

            // 📞 CONTATO E SUPORTE
            contato: {
                palavrasChave: ['contato', 'telefone', 'whatsapp', 'email', 'falar', 'atendente', 'ajuda'],
                intencoes: [
                    {
                        pergunta: /(contato|telefone|whatsapp|falar|atendente)/i,
                        resposta: `📞 *Entre em Contato:*\n\n` +
                            `📱 WhatsApp: (11) 96769-6744\n` +
                            `📧 Email: contato@segredodosabor.com\n` +
                            `📍 Endereço: R. Exemplo, 123 - SP\n\n` +
                            `⏰ *Atendimento:*\n` +
                            `Seg-Sáb: 9h às 18h\n\n` +
                            `🤖 Bot automático 24/7\n` +
                            `👨 Atendente humano no horário comercial`,
                        categoria: 'contato'
                    },
                    {
                        pergunta: /(ajuda|dúvida|problema|não|consegui)/i,
                        resposta: `🆘 *Central de Ajuda:*\n\n` +
                            `Estou aqui para ajudar! 💜\n\n` +
                            `📖 Pergunte sobre:\n` +
                            `• Como fazer pedidos\n` +
                            `• Produtos e preços\n` +
                            `• Entrega e retirada\n` +
                            `• Formas de pagamento\n` +
                            `• Status de pedidos\n\n` +
                            `💬 Digite sua dúvida ou escolha um tema!`,
                        categoria: 'ajuda'
                    }
                ]
            },

            // 🏢 SOBRE A EMPRESA
            empresa: {
                palavrasChave: ['empresa', 'história', 'quem somos', 'sobre', 'fundação'],
                intencoes: [
                    {
                        pergunta: /(quem|sobre|história|empresa)/i,
                        resposta: `🏢 *Sobre Nós:*\n\n` +
                            `Somos o *Segredo do Sabor* 🍰\n\n` +
                            `💜 Confeitaria artesanal desde 2020\n` +
                            `👨‍🍳 Receitas exclusivas\n` +
                            `🌿 Ingredientes selecionados\n` +
                            `♿ 100% acessível (WCAG AAA)\n` +
                            `🎂 +5000 clientes satisfeitos\n\n` +
                            `Nossa missão: Levar doçura e inclusão! 💫`,
                        categoria: 'sobre'
                    }
                ]
            },

            // ⏰ HORÁRIOS
            horario: {
                palavrasChave: ['horário', 'aberto', 'funciona', 'abre', 'fecha', 'domingo'],
                intencoes: [
                    {
                        pergunta: /(horário|abre|fecha|funciona|aberto)/i,
                        resposta: `⏰ *Horário de Funcionamento:*\n\n` +
                            `📅 *Segunda a Sexta:*\n` +
                            `9h às 18h\n\n` +
                            `📅 *Sábado:*\n` +
                            `9h às 14h\n\n` +
                            `📅 *Domingo e Feriados:*\n` +
                            `Fechado\n\n` +
                            `🤖 *Pedidos online:* 24/7\n` +
                            `💬 Bot WhatsApp ativo sempre!`,
                        categoria: 'horario'
                    }
                ]
            }
        };
    }

    /**
     * Processar mensagem do usuário com IA
     */
    async processarMensagem(mensagem, contexto = {}) {
        try {
            const mensagemLower = mensagem.toLowerCase().trim();
            
            // 1. Verificar saudações
            if (this.ehSaudacao(mensagemLower)) {
                return this.gerarSaudacao(contexto);
            }

            // 2. Verificar menu/ajuda
            if (mensagemLower.includes('menu') || mensagemLower.includes('opções') || mensagemLower === '?') {
                return this.gerarMenuPrincipal();
            }

            // 3. Detectar código de pedido direto (#PED000037 ou PED000037)
            const codigoPedidoMatch = mensagem.match(/#?PED\d{6}/i);
            if (codigoPedidoMatch) {
                const codigoPedido = codigoPedidoMatch[0].replace('#', '').toUpperCase();
                return await this.buscarPedidoPorCodigo(codigoPedido);
            }

            // 4. Processar intenção com NLP
            const intencao = await this.detectarIntencao(mensagemLower);
            
            if (intencao) {
                // Ação especial (buscar pedido, etc)
                if (intencao.acaoEspecial) {
                    return await this.executarAcaoEspecial(intencao.acaoEspecial, contexto);
                }
                
                return {
                    resposta: intencao.resposta,
                    categoria: intencao.categoria,
                    confianca: intencao.confianca || 0.95
                };
            }

            // 4. Buscar por palavras-chave
            const respostaPalavraChave = this.buscarPorPalavrasChave(mensagemLower);
            if (respostaPalavraChave) {
                return respostaPalavraChave;
            }

            // 5. Resposta padrão com sugestões
            return this.gerarRespostaPadrao();

        } catch (error) {
            console.error('Erro ao processar mensagem:', error);
            return {
                resposta: `😔 Desculpe, tive um problema ao processar sua mensagem.\n\n` +
                    `Por favor, tente novamente ou fale com um atendente:\n` +
                    `📱 (11) 96769-6744`,
                categoria: 'erro',
                confianca: 0
            };
        }
    }

    /**
     * Detectar intenção do usuário (NLP básico)
     */
    async detectarIntencao(mensagem) {
        let melhorIntencao = null;
        let maiorConfianca = 0;

        for (const categoria in this.baseConhecimento) {
            const dados = this.baseConhecimento[categoria];
            
            for (const intencao of dados.intencoes) {
                if (intencao.pergunta.test(mensagem)) {
                    const confianca = this.calcularConfianca(mensagem, intencao.pergunta);
                    
                    if (confianca > maiorConfianca) {
                        maiorConfianca = confianca;
                        melhorIntencao = { ...intencao, confianca };
                    }
                }
            }
        }

        return melhorIntencao;
    }

    /**
     * Calcular confiança da resposta (0-1)
     */
    calcularConfianca(mensagem, regex) {
        // Match exato = alta confiança
        if (regex.test(mensagem)) {
            // Quanto mais palavras coincidentes, maior a confiança
            const palavrasMensagem = mensagem.split(' ').length;
            const baseConfianca = 0.85;
            const bonus = Math.min(0.15, palavrasMensagem * 0.02);
            return Math.min(1, baseConfianca + bonus);
        }
        return 0;
    }

    /**
     * Buscar por palavras-chave
     */
    buscarPorPalavrasChave(mensagem) {
        for (const categoria in this.baseConhecimento) {
            const dados = this.baseConhecimento[categoria];
            
            for (const palavra of dados.palavrasChave) {
                if (mensagem.includes(palavra)) {
                    // Retornar primeira intenção da categoria
                    return {
                        resposta: dados.intencoes[0].resposta,
                        categoria: dados.intencoes[0].categoria,
                        confianca: 0.7,
                        metodo: 'palavraChave'
                    };
                }
            }
        }
        return null;
    }

    /**
     * Verificar se é saudação
     */
    ehSaudacao(mensagem) {
        const saudacoes = ['oi', 'olá', 'ola', 'hey', 'bom dia', 'boa tarde', 'boa noite', 'e ai', 'eai'];
        return saudacoes.some(s => mensagem.startsWith(s));
    }

    /**
     * Gerar saudação personalizada
     */
    gerarSaudacao(contexto = {}) {
        const hora = new Date().getHours();
        let saudacao;

        if (hora < 12) saudacao = 'Bom dia';
        else if (hora < 18) saudacao = '  tarde';
        else saudacao = 'Boa noite';

        const nome = contexto.nome || 'amigo(a)';

        return {
            resposta: `${saudacao}, ${nome}! 👋🍰\n\n` +
                `Bem-vindo(a) ao *Segredo do Sabor*!\n\n` +
                `Sou seu assistente virtual e estou aqui para ajudar! 🤖💜\n\n` +
                `${this.gerarMenuPrincipal().resposta}`,
            categoria: 'saudacao',
            confianca: 1
        };
    }

    /**
     * Gerar menu principal
     */
    gerarMenuPrincipal() {
        return {
            resposta: `📋 *Como posso ajudar?*\n\n` +
                `1️⃣ 🛒 *Fazer um pedido*\n` +
                `2️⃣ 📦 *Consultar status*\n` +
                `3️⃣ 🍰 *Ver cardápio*\n` +
                `4️⃣ 💳 *Formas de pagamento*\n` +
                `5️⃣ 🚚 *Entrega e retirada*\n` +
                `6️⃣ ♿ *Acessibilidade*\n` +
                `7️⃣ 📞 *Falar com atendente*\n\n` +
                `💬 Ou digite sua dúvida diretamente!`,
            categoria: 'menu',
            confianca: 1
        };
    }

    /**
     * Resposta padrão com sugestões
     */
    gerarRespostaPadrao() {
        return {
            resposta: `🤔 Desculpe, não entendi sua pergunta.\n\n` +
                `💡 *Tente perguntar:*\n` +
                `• "Como fazer um pedido?"\n` +
                `• "Qual o status do meu pedido?"\n` +
                `• "Quais as formas de pagamento?"\n` +
                `• "Qual o horário de funcionamento?"\n\n` +
                `Ou digite *menu* para ver todas as opções! 📋`,
            categoria: 'naoEntendido',
            confianca: 0,
            sugestoes: [
                'Como fazer um pedido',
                'Ver cardápio',
                'Formas de pagamento',
                'Horário de funcionamento'
            ]
        };
    }

    /**
     * Executar ação especial (buscar pedido, etc)
     */
    async executarAcaoEspecial(acao, contexto) {
        switch (acao) {
            case 'buscarPedido':
                if (contexto.telefone || contexto.email) {
                    return await this.buscarUltimoPedido(contexto);
                } else {
                    return {
                        resposta: `📦 *Para consultar seu pedido, preciso de:*\n\n` +
                            `• Código do pedido, OU\n` +
                            `• Seu telefone/email de cadastro\n\n` +
                            `💬 Por favor, informe um desses dados!`,
                        categoria: 'solicitacaoDados',
                        aguardandoDados: true
                    };
                }
            
            default:
                return this.gerarRespostaPadrao();
        }
    }

    /**
     * Buscar último pedido do cliente
     */
    async buscarUltimoPedido(contexto) {
        try {
            let query, params;

            if (contexto.codigoPedido) {
                query = `
                    SELECT r.*, c.nome as nome_cliente, c.telefone
                    FROM reserva r
                    JOIN cliente c ON r.idcliente_fk = c.idcliente
                    WHERE r.codigo_pedido = ?
                    LIMIT 1
                `;
                params = [contexto.codigoPedido];
            } else if (contexto.telefone) {
                query = `
                    SELECT r.*, c.nome as nome_cliente, c.telefone
                    FROM reserva r
                    JOIN cliente c ON r.idcliente_fk = c.idcliente
                    WHERE c.telefone = ?
                    ORDER BY r.idreserva DESC
                    LIMIT 1
                `;
                params = [contexto.telefone];
            } else if (contexto.email) {
                query = `
                    SELECT r.*, c.nome as nome_cliente, c.email
                    FROM reserva r
                    JOIN cliente c ON r.idcliente_fk = c.idcliente
                    WHERE c.email = ?
                    ORDER BY r.idreserva DESC
                    LIMIT 1
                `;
                params = [contexto.email];
            } else {
                return this.gerarRespostaPadrao();
            }

            const [pedidos] = await connection.execute(query, params);

            if (pedidos.length === 0) {
                return {
                    resposta: `🔍 Não encontrei pedidos com essas informações.\n\n` +
                        `Por favor, verifique:\n` +
                        `• Se o código do pedido está correto\n` +
                        `• Se o telefone/email está correto\n\n` +
                        `💬 Precisa de ajuda? Fale conosco:\n` +
                        `📱 (11) 96769-6744`,
                    categoria: 'pedidoNaoEncontrado',
                    confianca: 1
                };
            }

            const pedido = pedidos[0];
            const statusEmoji = this.getStatusEmoji(pedido.status);
            const dataEntrega = new Date(pedido.data_entrega).toLocaleDateString('pt-BR');

            return {
                resposta: `📦 *Status do Pedido*\n\n` +
                    `🔖 Código: *${pedido.codigo_pedido}*\n` +
                    `${statusEmoji} Status: *${pedido.status}*\n` +
                    `📅 Data da Entrega: ${dataEntrega}\n` +
                    `⏰ Horário: ${pedido.hora_entrega}\n` +
                    `💰 Valor Total: R$ ${parseFloat(pedido.valor_total).toFixed(2)}\n\n` +
                    `${this.getStatusMensagem(pedido.status)}\n\n` +
                    `💬 Dúvidas? Estou aqui! 🤖`,
                categoria: 'statusPedido',
                confianca: 1,
                dadosPedido: pedido
            };

        } catch (error) {
            console.error('Erro ao buscar pedido:', error);
            return {
                resposta: `😔 Desculpe, tive um problema ao buscar seu pedido.\n\n` +
                    `Por favor, tente novamente ou fale com um atendente:\n` +
                    `📱 (11) 96769-6744`,
                categoria: 'erro',
                confianca: 0
            };
        }
    }

    /**
     * Buscar pedido por código específico (#PED000037)
     */
    async buscarPedidoPorCodigo(codigoPedido) {
        try {
            const query = `
                SELECT r.*, c.nome as nome_cliente, c.telefone, c.email
                FROM reserva r
                JOIN cliente c ON r.idcliente_fk = c.idcliente
                WHERE r.codigo_pedido = ?
                LIMIT 1
            `;

            const [pedidos] = await connection.execute(query, [codigoPedido]);

            if (pedidos.length === 0) {
                return {
                    resposta: `🔍 *Pedido não encontrado!*\n\n` +
                        `Não encontrei nenhum pedido com o código *${codigoPedido}*.\n\n` +
                        `Por favor, verifique:\n` +
                        `• Se o código está correto\n` +
                        `• Se há algum erro de digitação\n` +
                        `• Se o pedido realmente existe\n\n` +
                        `💡 *Exemplos de códigos válidos:*\n` +
                        `• #PED000037\n` +
                        `• PED000042\n\n` +
                        `💬 Precisa de ajuda? Fale conosco:\n` +
                        `📱 (11) 96769-6744`,
                    categoria: 'pedidoNaoEncontrado',
                    confianca: 1
                };
            }

            const pedido = pedidos[0];
            const statusEmoji = this.getStatusEmoji(pedido.status);
            const dataEntrega = new Date(pedido.data_entrega).toLocaleDateString('pt-BR');

            return {
                resposta: `📦 *Encontrei seu pedido!*\n\n` +
                    `👤 Cliente: *${pedido.nome_cliente}*\n` +
                    `🔖 Código: *${pedido.codigo_pedido}*\n` +
                    `${statusEmoji} Status: *${pedido.status}*\n` +
                    `📅 Data da Entrega: ${dataEntrega}\n` +
                    `⏰ Horário: ${pedido.hora_entrega}\n` +
                    `💰 Valor Total: R$ ${parseFloat(pedido.valor_total).toFixed(2)}\n\n` +
                    `${this.getStatusMensagem(pedido.status)}\n\n` +
                    `💬 Posso ajudar em algo mais? 🤖`,
                categoria: 'statusPedido',
                confianca: 1,
                dadosPedido: pedido
            };

        } catch (error) {
            console.error('Erro ao buscar pedido por código:', error);
            return {
                resposta: `😔 Desculpe, tive um problema ao buscar o pedido.\n\n` +
                    `Por favor, tente novamente ou fale com um atendente:\n` +
                    `📱 (11) 96769-6744`,
                categoria: 'erro',
                confianca: 0
            };
        }
    }

    /**
     * Obter emoji do status
     */
    getStatusEmoji(status) {
        const emojis = {
            'Pendente': '⏳',
            'Confirmado': '✅',
            'Em Produção': '👨‍🍳',
            'Pronto': '🎉',
            'Saiu para Entrega': '🚚',
            'Entregue': '✨',
            'Cancelado': '❌',
            'Rejeitado': '🚫'
        };
        return emojis[status] || '📦';
    }

    /**
     * Mensagem personalizada por status
     */
    getStatusMensagem(status) {
        const mensagens = {
            'Pendente': '⏳ Aguardando confirmação... Em breve entraremos em contato!',
            'Confirmado': '✅ Pedido confirmado! Começaremos a produção em breve.',
            'Em Produção': '👨‍🍳 Seu pedido está sendo preparado com muito carinho!',
            'Pronto': '🎉 Tudo pronto! Você já pode retirar ou aguardar a entrega.',
            'Saiu para Entrega': '🚚 Pedido a caminho! Aguarde a chegada.',
            'Entregue': '✨ Pedido entregue! Esperamos que tenha adorado! 💜',
            'Cancelado': '❌ Pedido cancelado conforme solicitado.',
            'Rejeitado': '🚫 Pedido não pôde ser processado. Entre em contato.'
        };
        return mensagens[status] || '📦 Pedido em processamento.';
    }

    /**
     * Registrar interação para aprendizado
     */
    async registrarInteracao(mensagem, resposta, feedback = null) {
        try {
            const query = `
                INSERT INTO assistente_interacoes 
                (mensagem_usuario, resposta_assistente, categoria, confianca, feedback, ip_usuario)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            await connection.execute(query, [
                mensagem,
                resposta.resposta,
                resposta.categoria || 'desconhecido',
                resposta.confianca || 0,
                feedback,
                null // IP pode ser capturado no controller
            ]);

        } catch (error) {
            console.error('Erro ao registrar interação:', error);
        }
    }

    /**
     * Registrar feedback do usuário
     */
    async registrarFeedback(mensagem, feedback, contexto = {}) {
        try {
            // Buscar a interação mais recente com essa mensagem
            const [interacoes] = await connection.execute(
                `SELECT idinteracao FROM assistente_interacoes 
                 WHERE mensagem_usuario = ? 
                 ORDER BY data_interacao DESC 
                 LIMIT 1`,
                [mensagem]
            );

            if (interacoes.length > 0) {
                // Atualizar feedback na interação
                await connection.execute(
                    `UPDATE assistente_interacoes 
                     SET feedback = ? 
                     WHERE idinteracao = ?`,
                    [feedback, interacoes[0].idinteracao]
                );

                // Registrar feedback detalhado
                await connection.execute(
                    `INSERT INTO assistente_feedback 
                     (idinteracao, tipo, ip_usuario, data_feedback) 
                     VALUES (?, ?, ?, NOW())`,
                    [interacoes[0].idinteracao, feedback, contexto.ip || null]
                );

                return true;
            } else {
                // Se não encontrou a interação, apenas loga
                console.warn('Interação não encontrada para feedback:', mensagem);
                return false;
            }

        } catch (error) {
            console.error('Erro ao registrar feedback:', error);
            throw error;
        }
    }

    /**
     * Obter estatísticas do assistente
     */
    async obterEstatisticas(periodo = 30) {
        try {
            const query = `
                SELECT 
                    COUNT(*) as total_interacoes,
                    AVG(confianca) as confianca_media,
                    SUM(CASE WHEN feedback = 'positivo' THEN 1 ELSE 0 END) as feedbacks_positivos,
                    SUM(CASE WHEN feedback = 'negativo' THEN 1 ELSE 0 END) as feedbacks_negativos,
                    COUNT(DISTINCT DATE(data_interacao)) as dias_ativos,
                    categoria,
                    COUNT(*) as total_por_categoria
                FROM assistente_interacoes
                WHERE data_interacao >= DATE_SUB(NOW(), INTERVAL ? DAY)
                GROUP BY categoria
                ORDER BY total_por_categoria DESC
            `;

            const [stats] = await connection.execute(query, [periodo]);

            return {
                periodo_dias: periodo,
                estatisticas: stats,
                resumo: {
                    total: stats.reduce((sum, s) => sum + parseInt(s.total_por_categoria), 0),
                    confianciaMedia: stats.length > 0 ? (stats.reduce((sum, s) => sum + parseFloat(s.confianca_media), 0) / stats.length).toFixed(2) : 0,
                    satisfacao: stats.length > 0 ? ((stats[0].feedbacks_positivos / (stats[0].feedbacks_positivos + stats[0].feedbacks_negativos)) * 100).toFixed(1) : 0
                }
            };

        } catch (error) {
            console.error('Erro ao obter estatísticas:', error);
            return null;
        }
    }

    /**
     * Adicionar nova intenção dinamicamente (aprendizado)
     */
    async adicionarIntencao(categoria, pergunta, resposta) {
        try {
            if (!this.baseConhecimento[categoria]) {
                this.baseConhecimento[categoria] = {
                    palavrasChave: [],
                    intencoes: []
                };
            }

            this.baseConhecimento[categoria].intencoes.push({
                pergunta: new RegExp(pergunta, 'i'),
                resposta,
                categoria,
                adicionadoDinamicamente: true
            });

            // Salvar no banco para persistência
            const query = `
                INSERT INTO assistente_intencoes_customizadas 
                (categoria, pergunta_regex, resposta, ativo)
                VALUES (?, ?, ?, 1)
            `;

            await connection.execute(query, [categoria, pergunta, resposta]);

            return true;

        } catch (error) {
            console.error('Erro ao adicionar intenção:', error);
            return false;
        }
    }
}

export default new AssistenteVirtualService();
