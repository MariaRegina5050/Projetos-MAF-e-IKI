
import { Category, ProgramType } from './types';

export const MAF_CATEGORIES: Category[] = [
  {
    id: 'maf_c1',
    name: 'Alinhamento Setorial e NDC',
    weight: 0.15,
    questions: [
      { id: 'q1', text: 'O projeto está implementado nos setores prioritários (energia, transporte ou indústria)?' },
      { id: 'q2', text: 'Qual o grau de alinhamento explícito com as prioridades climáticas nacionais da NDC?' },
      { id: 'q3', text: 'Há sinergia com JETPs ou Climate Club (quando aplicável)?' },
      { id: 'q4', text: 'O projeto se baseia em planos existentes do NDC Partnership?' }
    ]
  },
  {
    id: 'maf_c2',
    name: 'Ambição e Redução de Emissões',
    weight: 0.20,
    questions: [
      { id: 'q5', text: 'Qual o perfil de redução de emissões do projeto?' },
      { id: 'q6', text: 'Quantas toneladas de GEE/ano o projeto prevê reduzir?' },
      { id: 'q7', text: 'A redução é verificável e mensurável?' },
      { id: 'q8', text: 'O projeto contribui para trajetórias de desenvolvimento carbono-neutro?' }
    ]
  },
  {
    id: 'maf_c3',
    name: 'Governança e Country-Driven',
    weight: 0.15,
    questions: [
      { id: 'q9', text: 'O projeto está incorporado em estratégias e planos nacionais de desenvolvimento?' },
      { id: 'q10', text: 'Há evidência de liderança e ownership do país parceiro?' },
      { id: 'q11', text: 'Existe apoio institucional governamental?' }
    ]
  },
  {
    id: 'maf_c4',
    name: 'Combinação FC + AT',
    weight: 0.15,
    questions: [
      { id: 'q12', text: 'O projeto combina reformas políticas/regulatórias com mecanismos financeiros?' },
      { id: 'q13', text: 'As políticas criam ambiente habilitador adequado?' },
      { id: 'q14', text: 'Os mecanismos financeiros endereçam barreiras de investimento?' },
      { id: 'q15', text: 'Há alavancagem de capital público e/ou privado?' }
    ]
  },
  {
    id: 'maf_c5',
    name: 'Alavancagem Financeira',
    weight: 0.15,
    questions: [
      { id: 'q16', text: 'Qual a razão de alavancagem esperada (funding MAF : outros recursos)?' },
      { id: 'q17', text: 'Existe estratégia clara de phase-out do apoio MAF?' },
      { id: 'q18', text: 'Há previsão de financiamento nacional para sustentabilidade de longo prazo?' },
      { id: 'q19', text: 'O projeto atrai investimento privado adicional?' }
    ]
  },
  {
    id: 'maf_c6',
    name: 'Elegibilidade ODA',
    weight: 0.05,
    questions: [
      { id: 'q20', text: 'Os fundos serão usados exclusivamente para benefício público?' },
      { id: 'q21', text: 'O projeto promove desenvolvimento sustentável em países da lista OECD DAC?' },
      { id: 'q22', text: 'Há impactos sociais e ambientais positivos significativos?' }
    ]
  },
  {
    id: 'maf_c7',
    name: 'Prontidão para Implementação',
    weight: 0.10,
    questions: [
      { id: 'q23', text: 'O projeto pode ser implementado após fase curta de preparação?' },
      { id: 'q24', text: 'O escopo e escala planejados são praticamente viáveis?' },
      { id: 'q25', text: 'Não requer pesquisa ou desenvolvimento conceitual de tecnologias?' }
    ]
  },
  {
    id: 'maf_c8',
    name: 'GESI - Igualdade de Gênero e Inclusão Social',
    weight: 0.05,
    questions: [
      { id: 'q26', text: 'O projeto aplica compreensão interseccional de GESI?' },
      { id: 'q27', text: 'Há medidas concretas para superar desigualdades de gênero e sociais?' },
      { id: 'q28', text: 'A abordagem é gender-responsive e inclusiva?' }
    ]
  }
];

export const IKI_CATEGORIES: Category[] = [
  {
    id: 'iki_c1',
    name: 'Elegibilidade Técnica',
    weight: 0.10,
    questions: [
      { id: 'iq1', text: 'O projeto é tecnicamente adequado para atingir os objetivos da prioridade temática/país?' },
      { id: 'iq2', text: 'Há alinhamento claro com a prioridade IKI selecionada?' }
    ]
  },
  {
    id: 'iki_c2',
    name: 'Relevância NDC/NBSAP/NAP',
    weight: 0.15,
    questions: [
      { id: 'iq3', text: 'O projeto contribui relevantemente para implementação de NDCs?' },
      { id: 'iq4', text: 'Há contribuição para NAPs (Planos Nacionais de Adaptação)?' },
      { id: 'iq5', text: 'Há contribuição para NBSAPs (Estratégias de Biodiversidade)?' }
    ]
  },
  {
    id: 'iki_c3',
    name: 'Conectividade com Políticas Nacionais/Regionais',
    weight: 0.10,
    questions: [
      { id: 'iq6', text: 'O projeto se conecta com frameworks políticos e legais específicos?' },
      { id: 'iq7', text: 'Aproveita parcerias existentes?' },
      { id: 'iq8', text: 'Alinha-se com prioridades políticas do país/região?' }
    ]
  },
  {
    id: 'iki_c4',
    name: 'Relevância para ODSs',
    weight: 0.10,
    questions: [
      { id: 'iq9', text: 'O projeto segue abordagem integrada da Agenda 2030?' },
      { id: 'iq10', text: 'Considera todos os ODS aplicáveis?' },
      { id: 'iq11', text: 'Conflitos potenciais entre objetivos são considerados?' }
    ]
  },
  {
    id: 'iki_c5',
    name: 'Apoio Político / Carta de Endosso',
    weight: 0.05,
    questions: [
      { id: 'iq12', text: 'Há indicação de apoio governamental do país parceiro?' },
      { id: 'iq13', text: 'Cartas de endosso foram obtidas (quando necessário)?' }
    ]
  },
  {
    id: 'iki_c6',
    name: 'Teoria da Mudança / Cadeia de Resultados',
    weight: 0.15,
    questions: [
      { id: 'iq14', text: 'A abordagem de solução é de alta qualidade segundo cadeia OCDE?' },
      { id: 'iq15', text: 'A solução é ambiciosa e realisticamente implementável?' },
      { id: 'iq16', text: 'Orçamento e cronograma são adequados?' }
    ]
  },
  {
    id: 'iki_c7',
    name: 'Ambição e Mensurabilidade',
    weight: 0.10,
    questions: [
      { id: 'iq17', text: 'As metas são ambiciosas para o contexto do projeto?' },
      { id: 'iq18', text: 'O projeto é desenhado para resultados mensuráveis?' },
      { id: 'iq19', text: 'Há consideração direcionada de justiça de gênero?' }
    ]
  },
  {
    id: 'iki_c8',
    name: 'Transformação',
    weight: 0.10,
    questions: [
      { id: 'iq20', text: 'O projeto visa mudanças sistêmicas?' },
      { id: 'iq21', text: 'Busca mudanças permanentes de comportamento em tomadores de decisão?' },
      { id: 'iq22', text: 'Impacta número considerável de indivíduos ou instituições?' }
    ]
  },
  {
    id: 'iki_c9',
    name: 'Inovação',
    weight: 0.05,
    questions: [
      { id: 'iq23', text: 'O projeto oferece solução inovadora para a região específica?' }
    ]
  },
  {
    id: 'iki_c10',
    name: 'Riscos Ambientais e Sociais / Salvaguardas',
    weight: 0.05,
    questions: [
      { id: 'iq24', text: 'Riscos ambientais e sociais são apresentados de forma compreensível?' },
      { id: 'iq25', text: 'Medidas de salvaguarda são apropriadas?' },
      { id: 'iq26', text: 'Há compromisso com Safeguards Standards?' }
    ]
  },
  {
    id: 'iki_c11',
    name: 'Promoção de Justiça de Gênero',
    weight: 0.10,
    questions: [
      { id: 'iq27', text: 'Há medidas específicas contra papéis/relações/normas desiguais de gênero?' },
      { id: 'iq28', text: 'A abordagem gender-responsive é plausível?' },
      { id: 'iq29', text: 'Medidas são reconhecíveis na cadeia de resultados?' }
    ]
  },
  {
    id: 'iki_c12',
    name: 'Participação e Transferência de Conhecimento',
    weight: 0.05,
    questions: [
      { id: 'iq30', text: 'Como grupos-alvo foram/serão incluídos no design?' },
      { id: 'iq31', text: 'Como conhecimento será transferido aos grupos-alvo?' }
    ]
  },
  {
    id: 'iki_c13',
    name: 'Estratégia de Saída',
    weight: 0.05,
    questions: [
      { id: 'iq32', text: 'Como atividades continuarão após fim do financiamento IKI?' },
      { id: 'iq33', text: 'A sustentabilidade é plausível e bem planejada?' }
    ]
  },
  {
    id: 'iki_c14',
    name: 'Replicabilidade',
    weight: 0.05,
    questions: [
      { id: 'iq34', text: 'O projeto pode ser replicado em outros países/regiões?' },
      { id: 'iq35', text: 'Pode ser replicado em outros setores?' }
    ]
  }
];
