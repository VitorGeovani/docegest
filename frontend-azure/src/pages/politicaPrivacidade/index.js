import React from 'react';
import './index.scss';
import HeaderSimples from '../../components/headerSimples';
import Footer from '../../components/footer';
import BotaoVoltarTopo from '../../components/botaoVoltarTopo';
import { FaShieldAlt, FaLock, FaUserShield, FaCookie, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function PoliticaPrivacidade() {
  return (
    <div className="pagina-politica-privacidade">
      <HeaderSimples />
      <BotaoVoltarTopo />
      
      <div className="politica-container">
        {/* Hero Section */}
        <section className="politica-hero">
          <div className="hero-icon">
            <FaShieldAlt />
          </div>
          <h1>Política de Privacidade</h1>
          <p className="hero-subtitle">
            Sua privacidade é importante para nós. Conheça como protegemos seus dados.
          </p>
          <p className="ultima-atualizacao">
            <strong>Última atualização:</strong> 11 de outubro de 2025
          </p>
        </section>

        {/* Conteúdo */}
        <div className="politica-content">
          
          {/* Seção 1 */}
          <section className="politica-secao">
            <div className="secao-header">
              <FaUserShield className="secao-icon" />
              <h2>1. Informações que Coletamos</h2>
            </div>
            <div className="secao-content">
              <p>
                A Segredo do Sabor coleta informações para proporcionar a melhor experiência de compra 
                e entregar nossos produtos com excelência. As informações coletadas incluem:
              </p>
              
              <h3>1.1 Informações Fornecidas por Você</h3>
              <ul>
                <li><strong>Dados de Cadastro:</strong> Nome completo, CPF, e-mail, telefone e endereço</li>
                <li><strong>Dados de Pedido:</strong> Produtos selecionados, preferências e observações especiais</li>
                <li><strong>Dados de Pagamento:</strong> Forma de pagamento escolhida (não armazenamos dados de cartão)</li>
                <li><strong>Comunicação:</strong> Mensagens enviadas através do WhatsApp ou formulários de contato</li>
              </ul>

              <h3>1.2 Informações Coletadas Automaticamente</h3>
              <ul>
                <li><strong>Dados de Navegação:</strong> Páginas visitadas, produtos visualizados e tempo de permanência</li>
                <li><strong>Informações do Dispositivo:</strong> Tipo de navegador, sistema operacional e endereço IP</li>
                <li><strong>Cookies:</strong> Pequenos arquivos armazenados para melhorar sua experiência</li>
              </ul>
            </div>
          </section>

          {/* Seção 2 */}
          <section className="politica-secao">
            <div className="secao-header">
              <FaLock className="secao-icon" />
              <h2>2. Como Usamos Suas Informações</h2>
            </div>
            <div className="secao-content">
              <p>Utilizamos suas informações pessoais para:</p>
              <ul>
                <li><strong>Processar Pedidos:</strong> Confirmar, preparar e entregar seus produtos</li>
                <li><strong>Comunicação:</strong> Enviar atualizações sobre status do pedido via WhatsApp ou e-mail</li>
                <li><strong>Melhorar Serviços:</strong> Analisar preferências para aprimorar nosso catálogo</li>
                <li><strong>Suporte ao Cliente:</strong> Responder dúvidas e resolver problemas</li>
                <li><strong>Marketing:</strong> Enviar ofertas especiais e novidades (apenas com seu consentimento)</li>
                <li><strong>Segurança:</strong> Prevenir fraudes e garantir a segurança das transações</li>
                <li><strong>Obrigações Legais:</strong> Cumprir requisitos fiscais e regulatórios</li>
              </ul>
            </div>
          </section>

          {/* Seção 3 */}
          <section className="politica-secao">
            <div className="secao-header">
              <FaUserShield className="secao-icon" />
              <h2>3. Compartilhamento de Informações</h2>
            </div>
            <div className="secao-content">
              <p>
                A Segredo do Sabor <strong>não vende</strong> suas informações pessoais. 
                Compartilhamos dados apenas quando necessário:
              </p>
              <ul>
                <li><strong>Prestadores de Serviço:</strong> Empresas de entrega e processamento de pagamento</li>
                <li><strong>WhatsApp Business:</strong> Para comunicação e suporte ao cliente</li>
                <li><strong>Autoridades:</strong> Quando exigido por lei ou para proteger direitos legais</li>
                <li><strong>Parceiros de Confiança:</strong> Apenas com sua autorização explícita</li>
              </ul>
              <div className="destaque-box">
                <p>
                  💡 <strong>Importante:</strong> Todos os nossos parceiros são cuidadosamente selecionados 
                  e devem seguir rigorosos padrões de segurança e privacidade.
                </p>
              </div>
            </div>
          </section>

          {/* Seção 4 */}
          <section className="politica-secao">
            <div className="secao-header">
              <FaCookie className="secao-icon" />
              <h2>4. Cookies e Tecnologias Similares</h2>
            </div>
            <div className="secao-content">
              <p>
                Utilizamos cookies para melhorar sua experiência de navegação e personalizar conteúdo:
              </p>
              <h3>Tipos de Cookies Utilizados:</h3>
              <ul>
                <li><strong>Cookies Essenciais:</strong> Necessários para o funcionamento do site (carrinho, login)</li>
                <li><strong>Cookies de Preferência:</strong> Lembram suas escolhas e configurações</li>
                <li><strong>Cookies de Análise:</strong> Nos ajudam a entender como você usa o site</li>
                <li><strong>Cookies de Marketing:</strong> Personalizam anúncios (apenas com seu consentimento)</li>
              </ul>
              <p>
                Você pode gerenciar ou desabilitar cookies através das configurações do seu navegador, 
                mas isso pode afetar algumas funcionalidades do site.
              </p>
            </div>
          </section>

          {/* Seção 5 */}
          <section className="politica-secao">
            <div className="secao-header">
              <FaShieldAlt className="secao-icon" />
              <h2>5. Segurança dos Dados</h2>
            </div>
            <div className="secao-content">
              <p>Implementamos medidas de segurança para proteger suas informações:</p>
              <ul>
                <li><strong>Criptografia:</strong> Conexões HTTPS para transmissão segura de dados</li>
                <li><strong>Acesso Restrito:</strong> Apenas funcionários autorizados têm acesso aos dados</li>
                <li><strong>Armazenamento Seguro:</strong> Servidores protegidos com múltiplas camadas de segurança</li>
                <li><strong>Backups Regulares:</strong> Cópias de segurança para prevenir perda de dados</li>
                <li><strong>Monitoramento:</strong> Vigilância constante contra ameaças e atividades suspeitas</li>
              </ul>
              <div className="destaque-box warning">
                <p>
                  ⚠️ <strong>Atenção:</strong> Nenhum sistema é 100% seguro. Proteja sua senha e 
                  evite compartilhar dados de acesso com terceiros.
                </p>
              </div>
            </div>
          </section>

          {/* Seção 6 */}
          <section className="politica-secao">
            <div className="secao-header">
              <FaUserShield className="secao-icon" />
              <h2>6. Seus Direitos (LGPD)</h2>
            </div>
            <div className="secao-content">
              <p>De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:</p>
              <ul>
                <li><strong>Acesso:</strong> Solicitar quais dados pessoais temos sobre você</li>
                <li><strong>Correção:</strong> Atualizar informações incorretas ou desatualizadas</li>
                <li><strong>Exclusão:</strong> Solicitar a remoção de seus dados (com exceções legais)</li>
                <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
                <li><strong>Revogação:</strong> Retirar consentimento para uso de dados</li>
                <li><strong>Oposição:</strong> Se opor ao tratamento de seus dados em situações específicas</li>
                <li><strong>Informação:</strong> Saber com quem compartilhamos seus dados</li>
              </ul>
              <p>
                Para exercer qualquer um desses direitos, entre em contato conosco através do 
                e-mail: <a href="mailto:privacidade@segredodosabor.com">privacidade@segredodosabor.com</a> 
                ou WhatsApp: <a href="https://wa.me/5511967696744">(11) 96769-6744</a>
              </p>
            </div>
          </section>

          {/* Seção 7 */}
          <section className="politica-secao">
            <div className="secao-header">
              <FaCookie className="secao-icon" />
              <h2>7. Retenção de Dados</h2>
            </div>
            <div className="secao-content">
              <p>Mantemos suas informações pelo tempo necessário para:</p>
              <ul>
                <li>Cumprir as finalidades descritas nesta política</li>
                <li>Atender requisitos legais, fiscais e contábeis</li>
                <li>Resolver disputas e fazer cumprir nossos acordos</li>
              </ul>
              <p>
                <strong>Período de Retenção:</strong> Dados de pedidos são mantidos por até 5 anos 
                (conforme legislação fiscal). Após esse período, são anonimizados ou excluídos.
              </p>
            </div>
          </section>

          {/* Seção 8 */}
          <section className="politica-secao">
            <div className="secao-header">
              <FaEnvelope className="secao-icon" />
              <h2>8. Contato e Dúvidas</h2>
            </div>
            <div className="secao-content">
              <p>
                Se você tiver dúvidas sobre esta Política de Privacidade ou sobre como tratamos 
                seus dados pessoais, entre em contato conosco:
              </p>
              <div className="contato-box">
                <h3>Segredo do Sabor Confeitaria</h3>
                <p><strong>E-mail:</strong> <a href="mailto:privacidade@segredodosabor.com">privacidade@segredodosabor.com</a></p>
                <p><strong>WhatsApp:</strong> <a href="https://wa.me/5511967696744">(11) 96769-6744</a></p>
                <p><strong>Endereço:</strong> Av. Engenheiro Eusébio Stevaux, 600 - Santo Amaro, São Paulo - SP, 04696-000</p>
                <p><strong>Horário de Atendimento:</strong> Segunda a Sexta, 09:00 - 18:00</p>
              </div>
            </div>
          </section>

          {/* Seção 9 */}
          <section className="politica-secao">
            <div className="secao-header">
              <FaShieldAlt className="secao-icon" />
              <h2>9. Alterações nesta Política</h2>
            </div>
            <div className="secao-content">
              <p>
                Podemos atualizar esta Política de Privacidade periodicamente para refletir mudanças 
                em nossas práticas ou por requisitos legais. Quando fizermos alterações significativas, 
                notificaremos você através de:
              </p>
              <ul>
                <li>Aviso destacado em nosso site</li>
                <li>E-mail ou mensagem via WhatsApp</li>
                <li>Notificação no momento do próximo acesso</li>
              </ul>
              <p>
                A continuidade do uso de nossos serviços após as alterações constitui sua 
                aceitação da nova política.
              </p>
            </div>
          </section>

        </div>

        {/* Call to Action */}
        <section className="politica-cta">
          <h2>Pronto para fazer seu pedido?</h2>
          <p>Seus dados estão seguros conosco. Explore nosso catálogo!</p>
          <Link to="/catalogo" className="btn-cta">
            Ver Catálogo Completo
          </Link>
        </section>

      </div>

      <Footer />
    </div>
  );
}
