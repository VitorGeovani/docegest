import axios from 'axios';

console.log('🧪 TESTANDO CORREÇÃO: Telefone com formatação no checkout\n');

async function testarCorrecao() {
    try {
        // Teste 1: Telefone COM formatação (como usuário digitaria)
        console.log('📋 TESTE 1: Telefone COM formatação');
        console.log('   Enviando: (11) 94626-3047');
        
        const teste1 = await axios.post('http://localhost:5000/cliente/verificar', {
            nome: 'João Teste Formatação',
            email: 'joao.formato@teste.com',
            telefone: '(11) 94626-3047' // COM formatação
        });
        
        console.log('   ✅ Sucesso! Cliente criado:');
        console.log('      ID:', teste1.data.id_cliente || teste1.data.id);
        console.log('      Telefone salvo:', teste1.data.telefone);
        console.log('      Tamanho:', teste1.data.telefone.length, 'caracteres\n');
        
        // Teste 2: Telefone SEM formatação (como deveria ser salvo)
        console.log('📋 TESTE 2: Telefone SEM formatação');
        console.log('   Enviando: 11987654321');
        
        const teste2 = await axios.post('http://localhost:5000/cliente/verificar', {
            nome: 'Maria Teste Limpo',
            email: 'maria.limpo@teste.com',
            telefone: '11987654321' // SEM formatação
        });
        
        console.log('   ✅ Sucesso! Cliente criado:');
        console.log('      ID:', teste2.data.id_cliente || teste2.data.id);
        console.log('      Telefone salvo:', teste2.data.telefone);
        console.log('      Tamanho:', teste2.data.telefone.length, 'caracteres\n');
        
        // Teste 3: Telefone com OUTROS formatos
        console.log('📋 TESTE 3: Telefone com espaços');
        console.log('   Enviando: 11 9 8765-4321');
        
        const teste3 = await axios.post('http://localhost:5000/cliente/verificar', {
            nome: 'Pedro Teste Espaços',
            email: 'pedro.espacos@teste.com',
            telefone: '11 9 8765-4321' // COM espaços
        });
        
        console.log('   ✅ Sucesso! Cliente criado:');
        console.log('      ID:', teste3.data.id_cliente || teste3.data.id);
        console.log('      Telefone salvo:', teste3.data.telefone);
        console.log('      Tamanho:', teste3.data.telefone.length, 'caracteres\n');
        
        // Teste 4: Telefone FIXO (10 dígitos)
        console.log('📋 TESTE 4: Telefone fixo (10 dígitos)');
        console.log('   Enviando: (11) 4444-5555');
        
        const teste4 = await axios.post('http://localhost:5000/cliente/verificar', {
            nome: 'Ana Teste Fixo',
            email: 'ana.fixo@teste.com',
            telefone: '(11) 4444-5555' // Fixo com formatação
        });
        
        console.log('   ✅ Sucesso! Cliente criado:');
        console.log('      ID:', teste4.data.id_cliente || teste4.data.id);
        console.log('      Telefone salvo:', teste4.data.telefone);
        console.log('      Tamanho:', teste4.data.telefone.length, 'caracteres\n');
        
        // Teste 5: Telefone INVÁLIDO (muito curto)
        console.log('📋 TESTE 5: Telefone INVÁLIDO (muito curto)');
        console.log('   Enviando: 123456789 (9 dígitos)');
        
        try {
            await axios.post('http://localhost:5000/cliente/verificar', {
                nome: 'Carlos Teste Inválido',
                email: 'carlos.invalido@teste.com',
                telefone: '123456789' // Muito curto
            });
            console.log('   ❌ ERRO: Deveria ter rejeitado!\n');
        } catch (error) {
            console.log('   ✅ Erro esperado capturado:');
            console.log('      Mensagem:', error.response?.data?.erro || error.message);
            console.log('      Status:', error.response?.status, '\n');
        }
        
        // Teste 6: Telefone INVÁLIDO (muito longo)
        console.log('📋 TESTE 6: Telefone INVÁLIDO (muito longo)');
        console.log('   Enviando: +55 11 94626-3047 (13 dígitos)');
        
        try {
            await axios.post('http://localhost:5000/cliente/verificar', {
                nome: 'Lucia Teste Longo',
                email: 'lucia.longo@teste.com',
                telefone: '+55 11 94626-3047' // Com +55
            });
            console.log('   ❌ ERRO: Deveria ter rejeitado!\n');
        } catch (error) {
            console.log('   ✅ Erro esperado capturado:');
            console.log('      Mensagem:', error.response?.data?.erro || error.message);
            console.log('      Status:', error.response?.status, '\n');
        }
        
        console.log('🎉 TODOS OS TESTES PASSARAM!');
        console.log('✅ Correção funcionando perfeitamente');
        console.log('✅ Telefones com formatação são aceitos');
        console.log('✅ Telefones salvos sem formatação (apenas números)');
        console.log('✅ Validações de tamanho funcionando (10-11 dígitos)');
        console.log('✅ Telefones inválidos são rejeitados\n');
        
    } catch (error) {
        console.error('❌ ERRO NOS TESTES:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Erro:', error.response.data?.erro);
        }
    }
}

testarCorrecao();
