import React from 'react';
import './index.scss';
import HeaderSimples from '../../components/headerSimples';
import Footer from '../../components/footer';
import BotaoVoltarTopo from '../../components/botaoVoltarTopo';
import { FaFileContract, FaShoppingCart, FaUndoAlt, FaGavel, FaExclamationTriangle, FaHandshake } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function TermosUso() {
  return (
    <div className="pagina-termos-uso">
      <HeaderSimples />
      <BotaoVoltarTopo />
      
      <div className="termos-container">
        {/* Hero Section */}
        <section className="termos-hero">
          <div className="hero-icon">
            <FaFileContract />
          </div>
          <h1>Termos de Uso</h1>
          <p className="hero-subtitle">
            Leia atentamente os termos e condições para uso de nossos serviços.
          </p>
          <p className="ultima-atualizacao">
            <strong>Última atualização:</strong> 11 de outubro de 2025
          </p>
        </section>

        {/* Conteúdo */}
        <div className="termos-content">
          
          {/* Seção 1 */}
          <section className="termos-secao">
            <div className="secao-header">
              <FaHandshake className="secao-icon" />
              <h2>1. Aceitação dos Termos</h2>
            </div>
            <div className="secao-content">
              <p>
                Bem-vindo ao <strong>Segredo do Sabor</strong>! Ao acessar e usar nosso site, 
                fazer pedidos ou utilizar qualquer um de nossos serviços, você concorda em cumprir 
                e estar vinculado aos seguintes termos e condições de uso.
              </p>
              <div className="destaque-box">
                <p>
                  📋 <strong>Importante:</strong> Se você não concordar com qualquer parte destes termos, 
                  não deve usar nosso site ou serviços.
                </p>
              </div>
              <p>
                Estes Termos de Uso aplicam-se a todos os usuários do site, incluindo, mas não se 
                limitando a, navegadores, clientes, comerciantes e contribuintes de conteúdo.
              </p>
            </div>
          </section>

          {/* Seção 2 */}
          <section className="termos-secao">
            <div className="secao-header">
              <FaShoppingCart className="secao-icon" />
              <h2>2. Uso do Site e Serviços</h2>
            </div>
            <div className="secao-content">
              <h3>2.1 Cadastro de Usuário</h3>
              <p>
                Para realizar pedidos, você deve fornecer informações precisas, completas e atualizadas. 
                Você é responsável por:
              </p>
              <ul>
                <li>Manter a confidencialidade de suas credenciais de acesso</li>
                <li>Todas as atividades que ocorrem sob sua conta</li>
                <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
                <li>Garantir que tem mais de 18 anos ou autorização de responsável legal</li>
              </ul>

              <h3>2.2 Uso Permitido</h3>
              <p>Você concorda em usar nosso site apenas para:</p>
              <ul>
                <li>Realizar compras legítimas de produtos para consumo pessoal</li>
                <li>Navegar pelo catálogo e visualizar informações sobre produtos</li>
                <li>Entrar em contato com nosso atendimento para dúvidas e suporte</li>
                <li>Acessar informações sobre pedidos realizados</li>
              </ul>

              <h3>2.3 Uso Proibido</h3>
              <p>É expressamente proibido:</p>
              <ul>
                <li>Usar o site para fins fraudulentos ou ilegais</li>
                <li>Transmitir vírus, malware ou códigos maliciosos</li>
                <li>Tentar obter acesso não autorizado a sistemas ou dados</li>
                <li>Fazer engenharia reversa ou extrair dados do site automaticamente</li>
                <li>Usar informações para fins comerciais sem autorização</li>
                <li>Criar contas falsas ou fornecer informações incorretas</li>
                <li>Interferir no funcionamento adequado do site</li>
              </ul>
            </div>
          </section>

          {/* Seção 3 */}
          <section className="termos-secao">
            <div className="secao-header">
              <FaShoppingCart className="secao-icon" />
              <h2>3. Pedidos e Pagamentos</h2>
            </div>
            <div className="secao-content">
              <h3>3.1 Processo de Pedido</h3>
              <p>
                Ao fazer um pedido através do nosso site, você:
              </p>
              <ul>
                <li>Faz uma oferta para comprar os produtos selecionados</li>
                <li>Recebe uma confirmação automática do pedido por e-mail ou WhatsApp</li>
                <li>Aguarda a confirmação final da disponibilidade dos produtos</li>
                <li>Concorda com os valores, quantidades e especificações informadas</li>
              </ul>

              <h3>3.2 Confirmação e Disponibilidade</h3>
              <p>
                Reservamos o direito de recusar ou cancelar pedidos a qualquer momento por:
              </p>
              <ul>
                <li>Indisponibilidade de produtos</li>
                <li>Erros de preço ou descrição no site</li>
                <li>Suspeita de fraude ou atividade não autorizada</li>
                <li>Impossibilidade de entrega no endereço informado</li>
              </ul>

              <h3>3.3 Preços e Pagamento</h3>
              <ul>
                <li>Todos os preços são em Reais (R$) e incluem impostos quando aplicável</li>
                <li>Preços podem ser alterados sem aviso prévio</li>
                <li>Ofertas e promoções têm validade limitada</li>
                <li>Aceitamos pagamento via PIX, cartão de crédito/débito e dinheiro na entrega</li>
                <li>Pedidos são processados após confirmação do pagamento</li>
              </ul>

              <h3>3.4 Taxas de Entrega</h3>
              <p>
                Taxas de entrega são calculadas com base no endereço de entrega e valor do pedido. 
                O valor da taxa será informado claramente antes da finalização do pedido.
              </p>
            </div>
          </section>

          {/* Seção 4 */}
          <section className="termos-secao">
            <div className="secao-header">
              <FaUndoAlt className="secao-icon" />
              <h2>4. Política de Entrega</h2>
            </div>
            <div className="secao-content">
              <h3>4.1 Prazos de Entrega</h3>
              <ul>
                <li>Estimativas de entrega são fornecidas no momento do pedido</li>
                <li>Prazos podem variar conforme disponibilidade e localização</li>
                <li>Entregas estão sujeitas a condições climáticas e tráfego</li>
                <li>Informaremos você sobre atrasos significativos</li>
              </ul>

              <h3>4.2 Área de Cobertura</h3>
              <p>
                Realizamos entregas em regiões específicas de São Paulo. Verifique se seu 
                endereço está na nossa área de cobertura durante o checkout.
              </p>

              <h3>4.3 Responsabilidade na Entrega</h3>
              <ul>
                <li>É necessário que haja alguém no endereço para receber o pedido</li>
                <li>Produtos perecíveis devem ser refrigerados imediatamente após o recebimento</li>
                <li>Verifique o pedido no ato da entrega</li>
                <li>Informe problemas imediatamente através do WhatsApp</li>
              </ul>
            </div>
          </section>

          {/* Seção 5 */}
          <section className="termos-secao">
            <div className="secao-header">
              <FaUndoAlt className="secao-icon" />
              <h2>5. Cancelamento e Reembolso</h2>
            </div>
            <div className="secao-content">
              <h3>5.1 Cancelamento pelo Cliente</h3>
              <p>Você pode cancelar seu pedido:</p>
              <ul>
                <li><strong>Antes do preparo:</strong> Reembolso integral</li>
                <li><strong>Durante o preparo:</strong> Avaliação caso a caso</li>
                <li><strong>Após despacho:</strong> Cancelamento não disponível</li>
              </ul>
              <p>
                Para cancelar, entre em contato imediatamente via WhatsApp: 
                <a href="https://wa.me/5511967696744">(11) 96769-6744</a>
              </p>

              <h3>5.2 Cancelamento pela Empresa</h3>
              <p>Podemos cancelar pedidos por:</p>
              <ul>
                <li>Indisponibilidade de ingredientes ou produtos</li>
                <li>Problemas com pagamento</li>
                <li>Impossibilidade de entrega</li>
                <li>Suspeita de fraude</li>
              </ul>
              <p>Em caso de cancelamento, você será notificado e reembolsado integralmente.</p>

              <h3>5.3 Política de Reembolso</h3>
              <ul>
                <li>Reembolsos são processados no mesmo método de pagamento original</li>
                <li>Prazo de 5 a 10 dias úteis para processamento</li>
                <li>Produtos devem estar em condições originais para devolução</li>
                <li>Produtos personalizados não são elegíveis para reembolso</li>
              </ul>

              <h3>5.4 Direito de Arrependimento (Código de Defesa do Consumidor)</h3>
              <p>
                Conforme o CDC, você tem até 7 dias após o recebimento para desistir da compra, 
                exceto para produtos perecíveis ou personalizados.
              </p>
            </div>
          </section>

          {/* Seção 6 */}
          <section className="termos-secao">
            <div className="secao-header">
              <FaExclamationTriangle className="secao-icon" />
              <h2>6. Qualidade e Reclamações</h2>
            </div>
            <div className="secao-content">
              <h3>6.1 Garantia de Qualidade</h3>
              <p>
                Garantimos que todos os nossos produtos são preparados com ingredientes frescos e 
                seguindo rigorosos padrões de higiene e segurança alimentar.
              </p>

              <h3>6.2 Reclamações</h3>
              <p>Se você não estiver satisfeito com seu pedido:</p>
              <ul>
                <li>Entre em contato em até 24 horas após o recebimento</li>
                <li>Forneça fotos e descrição detalhada do problema</li>
                <li>Guarde o produto em condições adequadas até resolução</li>
                <li>Aguarde nossa análise e proposta de solução</li>
              </ul>

              <h3>6.3 Alergias e Restrições Alimentares</h3>
              <div className="destaque-box warning">
                <p>
                  ⚠️ <strong>Atenção:</strong> Nossos produtos podem conter ou ter tido contato com 
                  alérgenos como glúten, lactose, nozes e ovos. Informe-nos sobre restrições alimentares 
                  antes de fazer seu pedido.
                </p>
              </div>
            </div>
          </section>

          {/* Seção 7 */}
          <section className="termos-secao">
            <div className="secao-header">
              <FaGavel className="secao-icon" />
              <h2>7. Propriedade Intelectual</h2>
            </div>
            <div className="secao-content">
              <p>
                Todo o conteúdo do site, incluindo textos, imagens, logos, receitas, vídeos e design, 
                é de propriedade exclusiva da <strong>Segredo do Sabor</strong> ou de nossos parceiros 
                licenciados e está protegido por leis de direitos autorais.
              </p>
              <p>É proibido:</p>
              <ul>
                <li>Reproduzir, distribuir ou modificar conteúdo sem autorização</li>
                <li>Usar logos ou marcas comerciais para fins não autorizados</li>
                <li>Criar obras derivadas baseadas em nosso conteúdo</li>
                <li>Remover avisos de direitos autorais ou marcas registradas</li>
              </ul>
            </div>
          </section>

          {/* Seção 8 */}
          <section className="termos-secao">
            <div className="secao-header">
              <FaExclamationTriangle className="secao-icon" />
              <h2>8. Limitação de Responsabilidade</h2>
            </div>
            <div className="secao-content">
              <p>
                O <strong>Segredo do Sabor</strong> não se responsabiliza por:
              </p>
              <ul>
                <li>Problemas decorrentes de informações incorretas fornecidas pelo cliente</li>
                <li>Atrasos causados por fatores externos (trânsito, clima, greves)</li>
                <li>Reações alérgicas não informadas previamente</li>
                <li>Danos indiretos, incidentais ou consequenciais</li>
                <li>Perda de dados ou problemas técnicos do dispositivo do usuário</li>
                <li>Conteúdo de sites de terceiros linkados</li>
              </ul>
              <div className="destaque-box">
                <p>
                  💡 <strong>Nossa responsabilidade máxima</strong> está limitada ao valor pago 
                  pelo produto ou serviço específico que gerou a reclamação.
                </p>
              </div>
            </div>
          </section>

          {/* Seção 9 */}
          <section className="termos-secao">
            <div className="secao-header">
              <FaGavel className="secao-icon" />
              <h2>9. Lei Aplicável e Jurisdição</h2>
            </div>
            <div className="secao-content">
              <p>
                Estes Termos de Uso são regidos pelas leis brasileiras, incluindo:
              </p>
              <ul>
                <li>Código de Defesa do Consumidor (CDC)</li>
                <li>Lei Geral de Proteção de Dados (LGPD)</li>
                <li>Marco Civil da Internet</li>
                <li>Código Civil Brasileiro</li>
              </ul>
              <p>
                Fica eleito o foro da Comarca de São Paulo - SP para dirimir quaisquer dúvidas ou 
                controvérsias oriundas destes Termos de Uso.
              </p>
            </div>
          </section>

          {/* Seção 10 */}
          <section className="termos-secao">
            <div className="secao-header">
              <FaFileContract className="secao-icon" />
              <h2>10. Alterações nos Termos</h2>
            </div>
            <div className="secao-content">
              <p>
                Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. 
                Alterações significativas serão comunicadas através de:
              </p>
              <ul>
                <li>Aviso destacado no site</li>
                <li>Notificação por e-mail ou WhatsApp</li>
                <li>Pop-up no próximo acesso</li>
              </ul>
              <p>
                O uso continuado do site após as alterações constitui aceitação dos novos termos. 
                Caso não concorde com as mudanças, você deve descontinuar o uso de nossos serviços.
              </p>
            </div>
          </section>

          {/* Seção 11 */}
          <section className="termos-secao">
            <div className="secao-header">
              <FaHandshake className="secao-icon" />
              <h2>11. Contato</h2>
            </div>
            <div className="secao-content">
              <p>
                Para dúvidas, sugestões ou reclamações sobre estes Termos de Uso, entre em contato:
              </p>
              <div className="contato-box">
                <h3>Segredo do Sabor Confeitaria</h3>
                <p><strong>E-mail:</strong> <a href="mailto:contato@segredodosabor.com">contato@segredodosabor.com</a></p>
                <p><strong>WhatsApp:</strong> <a href="https://wa.me/5511967696744">(11) 96769-6744</a></p>
                <p><strong>Endereço:</strong> Av. Engenheiro Eusébio Stevaux, 600 - Santo Amaro, São Paulo - SP, 04696-000</p>
                <p><strong>Horário de Atendimento:</strong> Segunda a Sexta, 09:00 - 18:00 | Sábado, 09:00 - 14:00</p>
                <p><strong>CNPJ:</strong> 00.000.000/0001-00 (exemplo)</p>
              </div>
            </div>
          </section>

        </div>

        {/* Call to Action */}
        <section className="termos-cta">
          <h2>Está de acordo? Comece a comprar!</h2>
          <p>Ao usar nossos serviços, você concorda com estes termos.</p>
          <Link to="/catalogo" className="btn-cta">
            Explorar Catálogo
          </Link>
        </section>

      </div>

      <Footer />
    </div>
  );
}
