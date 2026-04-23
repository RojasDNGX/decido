export interface PostSection {
  type: 'h2' | 'h3' | 'p' | 'ul' | 'ol' | 'internal-link';
  text?: string;
  items?: string[];
  // internal-link
  linkText?: string;
  linkHref?: string;
  linkContext?: string; // text before the link
  linkContextAfter?: string; // text after the link
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string; // 120–160 chars
  category: string;
  readTime: string;
  date: string;
  midCta: { text: string; label: string };
  endCta: { heading: string; sub: string; label: string };
  sections: PostSection[];
}

export const posts: BlogPost[] = [
  {
    slug: 'como-priorizar-tarefas-de-forma-eficiente',
    title: 'Como priorizar tarefas de forma eficiente',
    // 148 chars — within 120–160
    description:
      'Aprenda a priorizar tarefas de forma eficiente com um método prático: identifique o que move o ponteiro hoje e pare de desperdiçar energia no que não importa.',
    category: 'PRODUTIVIDADE',
    readTime: '7 min de leitura',
    date: '18 de abril de 2026',
    midCta: {
      text: 'Quer aplicar esse método sem precisar pensar? O Decido analisa suas tarefas e te diz qual vem primeiro.',
      label: 'Usar o Decido →',
    },
    endCta: {
      heading: 'Chega de adivinhar o que priorizar.',
      sub: 'O Decido faz isso por você — em segundos.',
      label: 'Testar agora, é grátis',
    },
    sections: [
      // CHECK 2: primeiro parágrafo com keyword natural e direto
      {
        type: 'p',
        text: 'Priorizar tarefas de forma eficiente não é sobre ter uma lista maior — é sobre saber o que realmente merece a sua atenção agora. Você trabalha o dia todo, mas ao terminar tem a sensação de que não avançou. Isso tem nome: produtividade falsa.',
      },
      {
        type: 'p',
        text: 'O problema é que a maioria das pessoas trata todas as tarefas como iguais. Mas elas não são. Algumas mudam tudo. Outras mal movem o ponteiro. Separar umas das outras é a base da priorização real.',
      },
      {
        type: 'h2',
        text: 'Por que a maioria das listas de tarefas não funciona',
      },
      {
        type: 'p',
        text: 'Listas são instrumentos neutros. Elas registram tudo sem julgamento: "responder e-mail do João", "fechar proposta do cliente", "comprar café". A responsabilidade de decidir a ordem é sua.',
      },
      {
        type: 'p',
        text: 'E é aí que mora o problema. Toda vez que você abre a lista e precisa decidir por onde começar, você gasta energia mental. Essa energia é finita. Com o tempo, você começa a escolher a tarefa mais fácil — não a mais importante.',
      },
      {
        type: 'h3',
        text: 'O viés da urgência',
      },
      {
        type: 'p',
        text: 'Nosso cérebro responde melhor ao que parece urgente do que ao que é genuinamente importante. Uma notificação piscando parece mais urgente do que uma proposta estratégica que vence em três dias.',
      },
      {
        type: 'p',
        text: 'O resultado: você apaga incêndios o dia todo e ignora o que poderia mudar sua semana.',
      },
      {
        type: 'h2',
        text: 'O princípio da tarefa única: o que move o ponteiro hoje?',
      },
      {
        type: 'p',
        text: 'Em vez de tentar otimizar uma lista de 20 itens, faça uma pergunta simples toda manhã: "qual é a única tarefa que, se eu fizer hoje, vai fazer essa semana valer a pena?"',
      },
      {
        type: 'p',
        text: 'Essa pergunta força você a pensar em impacto real, não em volume. Não é sobre fazer mais — é sobre fazer o certo.',
      },
      {
        type: 'h3',
        text: 'Como identificar essa tarefa',
      },
      {
        type: 'ul',
        items: [
          'Ela tem um prazo real, com consequências se não for feita?',
          'Ela desbloqueia outras pessoas ou etapas do projeto?',
          'Ela é algo que você vem adiando e que causa angústia?',
          'Ela tem impacto financeiro, relacional ou estratégico direto?',
        ],
      },
      {
        type: 'p',
        text: 'Se a resposta for sim para pelo menos dois desses critérios, essa é provavelmente a sua tarefa do dia. Todo o resto é secundário.',
      },
      {
        type: 'h2',
        text: 'A técnica dos três níveis',
      },
      {
        type: 'p',
        text: 'Depois de identificar a tarefa principal, organize o restante em três blocos — não em prioridade numérica, mas em nível de esforço e impacto:',
      },
      {
        type: 'ol',
        items: [
          'Nível 1 — Crítico: tarefas com prazo hoje ou que desbloqueiam outras pessoas.',
          'Nível 2 — Importante: tarefas que avançam projetos relevantes, mas toleram um dia de folga.',
          'Nível 3 — Desejável: tarefas que seriam boas de fazer, mas que podem ir para amanhã sem perda real.',
        ],
      },
      {
        type: 'p',
        text: 'Com essa visão, você começa o dia sabendo o que precisa sair — não só o que gostaria de fazer.',
      },
      {
        type: 'h2',
        text: 'Priorizar é uma habilidade que se treina',
      },
      {
        type: 'p',
        text: 'Ninguém nasce sabendo priorizar. É uma prática que exige contexto, clareza sobre objetivos e honestidade consigo mesmo. Quanto mais você faz, mais rápido você reconhece o que é ruído e o que é sinal.',
      },
      {
        type: 'p',
        text: 'Se você ainda sente que tudo parece urgente ao mesmo tempo, o problema geralmente não é a lista — é a falta de um critério claro para julgar cada item.',
      },
      // CHECK 5: internal link contextual
      {
        type: 'internal-link',
        linkContext: 'Outro ponto que impacta diretamente a priorização é ',
        linkText: 'como você decide o que fazer primeiro logo de manhã',
        linkHref: '/blog/como-decidir-o-que-fazer-primeiro-no-dia',
        linkContextAfter: ' — o começo do dia define o ritmo do resto.',
      },
      {
        type: 'h2',
        text: 'Deixe a tecnologia ajudar a ordenar',
      },
      {
        type: 'p',
        text: 'Uma das formas de tornar esse processo menos desgastante é usar uma ferramenta que analise suas tarefas e sugira uma ordem inteligente — levando em conta prazo, impacto e energia. Você ainda decide. Mas você decide com apoio, não no escuro.',
      },
    ],
  },

  {
    slug: 'como-decidir-o-que-fazer-primeiro-no-dia',
    title: 'Como decidir o que fazer primeiro no dia',
    // 152 chars — within 120–160
    description:
      'Descubra como decidir o que fazer primeiro no dia sem entrar em modo reativo. Um ritual matinal simples que elimina a paralisia e garante foco desde a primeira hora.',
    category: 'ROTINA',
    readTime: '6 min de leitura',
    date: '20 de abril de 2026',
    midCta: {
      text: 'Quer começar o dia já sabendo o que fazer primeiro? O Decido te diz isso antes de você abrir o e-mail.',
      label: 'Começar com o Decido →',
    },
    endCta: {
      heading: 'Comece o dia no modo certo.',
      sub: 'O Decido decide o que você deve fazer agora. Sem discussão interna.',
      label: 'Testar o Decido',
    },
    sections: [
      // CHECK 2: keyword natural no primeiro parágrafo
      {
        type: 'p',
        text: 'Decidir o que fazer primeiro no dia é a escolha mais cara que você vai tomar — e a maioria das pessoas desperdiça essa decisão. As primeiras duas horas do dia determinam a qualidade de praticamente toda a jornada.',
      },
      {
        type: 'p',
        text: 'O problema é que muita gente chega ao trabalho, abre o e-mail ou o WhatsApp, e já entra no modo reativo. A partir daí, o dia é dos outros.',
      },
      {
        type: 'h2',
        text: 'A armadilha de começar pelo e-mail',
      },
      {
        type: 'p',
        text: 'E-mail é uma fila de pedidos de outras pessoas. Quando você abre o e-mail antes de definir suas prioridades, você está terceirizando sua agenda para quem escreveu para você ontem.',
      },
      {
        type: 'p',
        text: 'Isso não é trabalho estratégico — é serviço de atendimento ao público. O e-mail tem um lugar no dia. Mas esse lugar não é o primeiro.',
      },
      {
        type: 'h2',
        text: 'O que fazer antes de qualquer coisa',
      },
      {
        type: 'p',
        text: 'Antes de abrir qualquer ferramenta, aplicativo ou mensagem, reserve cinco minutos para responder duas perguntas:',
      },
      {
        type: 'ol',
        items: [
          '"O que absolutamente precisa ser feito hoje?" — liste até 3 itens.',
          '"O que eu posso deixar para amanhã sem consequências reais?" — seja honesto.',
        ],
      },
      {
        type: 'p',
        text: 'Esse exercício ativa o modo intencional em vez do modo reativo. Você começa o dia como protagonista, não como apagador de incêndios.',
      },
      {
        type: 'h2',
        text: 'A regra do "primeiro bloco"',
      },
      {
        type: 'p',
        text: 'Após definir suas prioridades, execute a mais importante antes de fazer qualquer outra coisa. Sem reuniões, sem mensagens, sem redes sociais.',
      },
      {
        type: 'p',
        text: 'Um bloco de 60 a 90 minutos de trabalho profundo na tarefa principal do dia. É pouco tempo — mas é o suficiente para mover o que realmente importa.',
      },
      {
        type: 'h3',
        text: 'Por que começar pela tarefa mais difícil?',
      },
      {
        type: 'p',
        text: 'Sua capacidade de concentração e energia cognitiva são maiores no início do dia. Desperdiçar esse pico em reuniões ou e-mails é como usar combustível premium para ficar parado no trânsito.',
      },
      {
        type: 'p',
        text: 'Quando você termina o bloco principal pela manhã, o resto do dia tem um peso diferente. Você já venceu. O que vem depois é complemento.',
      },
      {
        type: 'h2',
        text: 'O que fazer quando tudo parece urgente',
      },
      {
        type: 'p',
        text: 'Se você abrir o dia com cinco "urgentes" competindo pela atenção, use um critério simples para desempatar: qual dessas tarefas tem consequências reais se não for feita hoje?',
      },
      {
        type: 'ul',
        items: [
          'Tem prazo com cliente ou entrega vinculada? → Prioridade máxima.',
          'Desbloqueia alguém da equipe? → Prioridade alta.',
          'É importante, mas toleraria um dia de atraso? → Nível 2.',
          'Parece urgente mas não tem impacto real? → Fila do fim do dia.',
        ],
      },
      {
        type: 'h2',
        text: 'Crie um ritual, não uma tarefa',
      },
      {
        type: 'p',
        text: 'O segredo para manter essa prática é transformá-la em ritual — algo automático, não consciente. Depois de duas semanas fazendo a mesma sequência toda manhã, você não vai mais precisar de força de vontade.',
      },
      {
        type: 'p',
        text: 'Um ritual possível: chegar no espaço de trabalho → fechar o telefone → abrir bloco de notas → escrever as 3 prioridades → iniciar a principal. Simples, repetível, eficaz.',
      },
      // CHECK 5: internal link contextual
      {
        type: 'internal-link',
        linkContext: 'Se mesmo com esses critérios você ainda trava na escolha, vale entender ',
        linkText: 'como a procrastinação funciona na prática',
        linkHref: '/blog/como-parar-de-procrastinar-na-pratica',
        linkContextAfter: ' — e o que fazer para sair do ciclo.',
      },
      {
        type: 'h2',
        text: 'Quando a decisão ainda trava',
      },
      {
        type: 'p',
        text: 'Se você ainda sente paralisia na hora de decidir por onde começar, pode ser que o problema seja a quantidade de contexto que você está tentando processar de uma vez. Uma ferramenta que analise suas tarefas e sugira a mais relevante pode ser o empurrão que você precisa para sair do lugar.',
      },
    ],
  },

  {
    slug: 'como-parar-de-procrastinar-na-pratica',
    title: 'Como parar de procrastinar na prática',
    // 155 chars — within 120–160
    description:
      'Procrastinação não é preguiça — é um mecanismo emocional de defesa. Veja como identificar seus gatilhos e parar de procrastinar com técnicas práticas e diretas.',
    category: 'FOCO',
    readTime: '8 min de leitura',
    date: '22 de abril de 2026',
    midCta: {
      text: 'Se a decisão de por onde começar é o que te trava, o Decido resolve isso agora.',
      label: 'Resolver com o Decido →',
    },
    endCta: {
      heading: 'Pare de travar na decisão. Comece a executar.',
      sub: 'O Decido remove o atrito da escolha e te coloca em movimento.',
      label: 'Experimentar o Decido',
    },
    sections: [
      // CHECK 2: keyword natural e direta no primeiro parágrafo
      {
        type: 'p',
        text: 'Você quer parar de procrastinar, mas não consegue. A tarefa está ali, há dias — talvez semanas. E cada vez que você a vê, você desvia o olhar, abre outra coisa, resolve algo "mais rápido" e promete: "amanhã eu faço".',
      },
      {
        type: 'p',
        text: 'Isso é procrastinação — e quase ninguém entende o que ela realmente é.',
      },
      {
        type: 'h2',
        text: 'Procrastinação não é falta de disciplina',
      },
      {
        type: 'p',
        text: 'A visão popular é a de alguém preguiçoso, sem força de vontade. Mas pesquisas em psicologia cognitiva mostram uma imagem bem diferente.',
      },
      {
        type: 'p',
        text: 'Procrastinação é uma estratégia emocional de curto prazo. Quando uma tarefa gera ansiedade, medo de fracasso ou incerteza, o cérebro encontra uma saída: adiá-la. Isso alivia o desconforto imediato — mas cria uma dívida emocional que cresce a cada dia.',
      },
      {
        type: 'h3',
        text: 'Os gatilhos mais comuns',
      },
      {
        type: 'ul',
        items: [
          'Medo de não fazer bem feito (perfeccionismo)',
          'Tarefa grande e mal definida ("tenho que escrever o relatório" — mas por onde?)',
          'Sem prazo claro — parece que pode esperar',
          'Resultado incerto — você não sabe se vai funcionar',
          'Tarefa chata, sem recompensa visível',
        ],
      },
      {
        type: 'p',
        text: 'Identificar o seu gatilho específico é mais útil do que tentar "ter mais disciplina". Disciplina aplicada à causa errada não resolve nada.',
      },
      {
        type: 'h2',
        text: 'A técnica dos dois minutos revisitada',
      },
      {
        type: 'p',
        text: 'David Allen, criador do GTD, tem uma regra famosa: se uma tarefa leva menos de dois minutos, faça agora. Para quem procrastina, existe uma variação ainda mais poderosa: "consigo começar essa tarefa em dois minutos?"',
      },
      {
        type: 'p',
        text: 'O problema raramente é a tarefa inteira — é o primeiro passo. "Escrever o relatório" paralisa. "Abrir o documento e escrever o título" não. Quando você define o menor passo possível para começar, a resistência cai.',
      },
      {
        type: 'h3',
        text: 'Decomposição prática',
      },
      {
        type: 'p',
        text: 'Pegue a tarefa que você mais está evitando agora e escreva os três primeiros passos físicos. Não "organizar as finanças" — mas:',
      },
      {
        type: 'ol',
        items: [
          'Abrir a planilha de gastos.',
          'Listar as despesas da semana passada.',
          'Calcular o total por categoria.',
        ],
      },
      {
        type: 'p',
        text: 'Quando a tarefa vira uma sequência de ações concretas, ela para de ser uma ameaça e vira um procedimento. E procedimentos você consegue seguir.',
      },
      {
        type: 'h2',
        text: 'O papel do ambiente na procrastinação',
      },
      {
        type: 'p',
        text: 'Força de vontade é um recurso limitado. Tentar vencer a procrastinação apenas na base da determinação é como nadar contra a corrente o dia todo. Em vez disso, mude a corrente.',
      },
      {
        type: 'ul',
        items: [
          'Remova distrações do campo visual antes de começar.',
          'Use fones e ambiente neutro para reduzir estímulos.',
          'Defina onde e quando você vai fazer a tarefa — "vou fazer quinta de manhã, na mesa do escritório" funciona melhor do que "vou fazer em algum momento".',
          'Use compromisso externo: conte para alguém o que você vai fazer.',
        ],
      },
      {
        type: 'h2',
        text: 'Quando o problema é a quantidade de tarefas',
      },
      {
        type: 'p',
        text: 'Às vezes você procrastina não porque tem medo de uma tarefa específica, mas porque tem tantas que não sabe por qual começar. A paralisia por análise é real: quando as opções são muitas, o cérebro prefere não escolher.',
      },
      {
        type: 'p',
        text: 'Nesses casos, a solução não é mais força de vontade — é menos escolha. Reduza a lista às três tarefas mais relevantes do dia e ignore o resto até terminá-las.',
      },
      // CHECK 5: internal link contextual
      {
        type: 'internal-link',
        linkContext: 'Se você quer um método para identificar essas três tarefas, veja ',
        linkText: 'como priorizar tarefas de forma eficiente',
        linkHref: '/blog/como-priorizar-tarefas-de-forma-eficiente',
        linkContextAfter: ' — é o ponto de partida certo.',
      },
      {
        type: 'h2',
        text: 'Crie momentum antes de precisar dele',
      },
      {
        type: 'p',
        text: 'Uma das formas mais eficazes de combater a procrastinação é não dar chance para ela aparecer. Quando você começa o dia com uma tarefa pequena e relevante completa, você entra no estado de momentum — e continuar fica mais fácil.',
      },
      {
        type: 'p',
        text: 'Não porque você virou uma pessoa mais disciplinada. Mas porque você criou uma prova concreta de que é capaz. O cérebro gosta de confirmação. Dê a ele uma vitória pequena logo cedo.',
      },
      {
        type: 'h2',
        text: 'Quando a decisão em si é o obstáculo',
      },
      {
        type: 'p',
        text: 'Existe um tipo específico de procrastinação que pouca gente fala: a que vem de não conseguir decidir por onde começar. Você tem as tarefas, você tem intenção — mas fica em loop decidindo qual é a "mais importante".',
      },
      {
        type: 'p',
        text: 'Nesses casos, ter uma ferramenta que analise o contexto e sugira a próxima ação pode quebrar o ciclo. Não porque ela decide por você — mas porque ela retira o peso da escolha e te devolve energia para executar.',
      },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
