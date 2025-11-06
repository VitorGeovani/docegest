import axios from 'axios';

async function testar() {
    try {
        console.log('Testando cálculo de acréscimo com Vela de Aniversário...');
        
        const resposta = await axios.post('http://localhost:5000/personalizacao/calcular-acrescimo', {
            personalizacoes: [
                { idvalor: 22, idopcao: 5 }
            ]
        });
        
        console.log('\n✅ Sucesso!');
        console.log('Resposta:', JSON.stringify(resposta.data, null, 2));
    } catch (erro) {
        console.error('\n❌ Erro!');
        console.error('Status:', erro.response?.status);
        console.error('Dados:', erro.response?.data);
        console.error('Mensagem:', erro.message);
    }
}

testar();
