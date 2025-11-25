/**
 * ============================================================================
 * GERADOR DE ARQUIVO SQL COMPLETO - DOCEGEST V5.0
 * ============================================================================
 * Este script:
 * 1. Lê o arquivo base BANCO_DADOS_COMPLETO.sql
 * 2. Lê o arquivo de adições BANCO_DADOS_COMPLETO_V5_ADICOES.sql
 * 3. Mescla os dois arquivos removendo duplicatas
 * 4. Gera o arquivo final INSTALACAO_BANCO_COMPLETO_V5_FINAL.sql
 * ============================================================================
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔄 INICIANDO GERAÇÃO DO SQL COMPLETO V5.0...\n');

// Caminhos dos arquivos
const BASE_DIR = path.join(__dirname, '..');
const ARQUIVO_BASE = path.join(BASE_DIR, 'BANCO_DADOS_COMPLETO.sql');
const ARQUIVO_ADICOES = path.join(BASE_DIR, 'BANCO_DADOS_COMPLETO_V5_ADICOES.sql');
const ARQUIVO_SAIDA = path.join(BASE_DIR, 'INSTALACAO_BANCO_COMPLETO_V5_FINAL.sql');

try {
    // Ler arquivo base
    console.log('📖 Lendo arquivo base...');
    let sqlBase = fs.readFileSync(ARQUIVO_BASE, 'utf8');
    
    // Ler arquivo de adições
    console.log('📖 Lendo arquivo de adições V5.0...');
    let sqlAdicoes = fs.readFileSync(ARQUIVO_ADICOES, 'utf8');
    
    // Remover cabeçalhos duplicados das adições
    sqlAdicoes = sqlAdicoes.replace(/^-- ={50,}[\s\S]*?-- ={50,}/m, '');
    
    // Encontrar onde inserir as adições (após MÓDULO 6)
    let posicaoInsercao = sqlBase.indexOf('-- VIEWS - CONSULTAS OTIMIZADAS');
    
    if (posicaoInsercao === -1) {
        posicaoInsercao = sqlBase.indexOf('-- =========================================================\n-- STORED PROCEDURES');
    }
    
    if (posicaoInsercao === -1) {
        // Se não encontrar, insere antes das VIEWS
        posicaoInsercao = sqlBase.indexOf('CREATE OR REPLACE VIEW');
    }
    
    if (posicaoInsercao === -1) {
        throw new Error('Não foi possível encontrar o ponto de inserção no arquivo base');
    }
    
    console.log(`✓ Ponto de inserção encontrado na posição ${posicaoInsercao}`);
    
    // Montar SQL final
    console.log('🔨 Montando arquivo SQL final...');
    
    const sqlFinal = 
        sqlBase.substring(0, posicaoInsercao) + 
        '\n' + sqlAdicoes + '\n\n' +
        sqlBase.substring(posicaoInsercao);
    
    // Atualizar cabeçalho com data atual
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    const sqlFinalAtualizado = sqlFinal.replace(
        /-- Data: .*/,
        `-- Data: ${dataAtual}`
    );
    
    // Salvar arquivo
    console.log('💾 Salvando arquivo...');
    fs.writeFileSync(ARQUIVO_SAIDA, sqlFinalAtualizado, 'utf8');
    
    // Estatísticas
    const linhas = sqlFinalAtualizado.split('\n').length;
    const tamanhoKB = (fs.statSync(ARQUIVO_SAIDA).size / 1024).toFixed(2);
    
    console.log('\n✅ ARQUIVO SQL GERADO COM SUCESSO!');
    console.log('='.repeat(80));
    console.log(`📄 Arquivo: ${path.basename(ARQUIVO_SAIDA)}`);
    console.log(`📏 Linhas: ${linhas}`);
    console.log(`📦 Tamanho: ${tamanhoKB} KB`);
    console.log(`📍 Local: ${ARQUIVO_SAIDA}`);
    console.log('='.repeat(80));
    
    // Contar elementos
    const tabelas = (sqlFinalAtualizado.match(/CREATE TABLE IF NOT EXISTS/g) || []).length;
    const views = (sqlFinalAtualizado.match(/CREATE OR REPLACE VIEW/g) || []).length;
    const procedures = (sqlFinalAtualizado.match(/CREATE PROCEDURE/g) || []).length;
    const triggers = (sqlFinalAtualizado.match(/CREATE TRIGGER/g) || []).length;
    
    console.log('\n📊 ELEMENTOS DO BANCO:');
    console.log(`   Tabelas: ${tabelas}`);
    console.log(`   Views: ${views}`);
    console.log(`   Procedures: ${procedures}`);
    console.log(`   Triggers: ${triggers}`);
    console.log();
    
    process.exit(0);
    
} catch (error) {
    console.error('\n❌ ERRO:', error.message);
    process.exit(1);
}
