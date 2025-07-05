// 質問の選択肢の型定義
interface Option {
  id: string
  text: string
  nextQuestionId?: string
  resultTitle?: string
}

// 質問の型定義
interface Question {
  id: string
  text: string
  options: Option[]
}

// 診断結果の型定義
interface Result {
  title: string
  description: string
}

// 質問フロー
export const questionFlow = {
  startQuestionId: 'q0',
  questions: [
    {
      id: 'q0',
      text: 'HackHope国は最初に難民をどう扱いますか？',
      options: [
        { id: 'q0_option1', text: '入管施設に収容する', nextQuestionId: 'q1' },
        { id: 'q0_option2', text: '追い返す', nextQuestionId: 'q2' },
        { id: 'q0_option3', text: '受け入れる', nextQuestionId: 'q3' }
      ]
    },
    {
      id: 'q1',
      text: '収容された Itanzi 難民はどうする？',
      options: [
        { id: 'q1_option1', text: '難民申請をする', nextQuestionId: 'q1a' },
        { id: 'q1_option2', text: '無期限に収容される', nextQuestionId: 'q1b' }
      ]
    },
    {
      id: 'q1a',
      text: '政府は申請を認める？',
      options: [
        { id: 'q1a_option1', text: 'はい', resultTitle: '多文化共生社会' },
        { id: 'q1a_option2', text: 'いいえ', resultTitle: '受け入れ困難社会' }
      ]
    },
    {
      id: 'q1b',
      text: '政府はどの対応を取る？',
      options: [
        { id: 'q1b_option1', text: '支援団体の抗議を受け入れず強硬を貫く', resultTitle: '収容重視社会' },
        { id: 'q1b_option2', text: '生活費など「面倒を見る」負担を選ぶ', resultTitle: '人道的課題社会' }
      ]
    },
    {
      id: 'q2',
      text: '追い返された Itanzi 難民はどう行動する？',
      options: [
        { id: 'q2_option1', text: '強制送還される', nextQuestionId: 'q2a' },
        { id: 'q2_option2', text: '国内に留まり続ける', nextQuestionId: 'q2b' }
      ]
    },
    {
      id: 'q2a',
      text: '強制送還された場合に顕在化する問題は？',
      options: [
        { id: 'q2a_option1', text: '国際イメージ悪化を受容', resultTitle: '排除主義社会' },
        { id: 'q2a_option2', text: '難民の生命危険を承知', resultTitle: '対立助長社会' }
      ]
    },
    {
      id: 'q2b',
      text: '国内に留まり続けた場合、次に起こり得る？',
      options: [
        { id: 'q2b_option1', text: '行き場のない人が増える状態を放置', resultTitle: '抑圧的対応社会' },
        { id: 'q2b_option2', text: '結局 入管に再収容される', resultTitle: '多文化葛藤社会' }
      ]
    },
    {
      id: 'q3',
      text: '受け入れ後、難民の社会適応は？',
      options: [
        { id: 'q3_option1', text: 'H 国になじめない', nextQuestionId: 'q3a' },
        { id: 'q3_option2', text: 'H 国で仕事をする', nextQuestionId: 'q3b' }
      ]
    },
    {
      id: 'q3a',
      text: '政府・社会が直面する課題は？',
      options: [
        { id: 'q3a_option1', text: '国を嫌う人が出る', resultTitle: '孤立社会' },
        { id: 'q3a_option2', text: 'ホームレスが増える', resultTitle: '社会的支援課題社会' }
      ]
    },
    {
      id: 'q3b',
      text: 'その結果、国内では？',
      options: [
        { id: 'q3b_option1', text: '経済が潤う', resultTitle: '経済発展社会' },
        { id: 'q3b_option2', text: '住民の不満が高まる', resultTitle: '社会分断社会' }
      ]
    }
  ]
}

// 診断結果の詳細
export const results: Result[] = [
  {
    title: '多文化共生社会',
    description: '難民申請を多く認定する社会では、多様な文化や価値観が共存し、国際性に富んだ活気ある社会が形成される可能性がある。一方で、受け入れ態勢が不十分なまま進めば、言語や宗教の違いによる摩擦、社会的孤立、雇用や福祉をめぐる競争などの課題も生じる。'
  },
  {
    title: '受け入れ困難社会',
    description: '難民申請をほとんど認定しない社会では、治安や社会秩序が保たれやすく、受け入れに伴う行政負担や社会的摩擦を回避できるという利点がある。一方で、人道的責任を果たさず、国際社会からの信頼を損なう恐れがある。排他的な姿勢が固定化すれば、多様性を受け入れにくい社会風土が広がり、国の柔軟性や国際的な競争力にも影響を与える可能性がある。'
  },
  {
    title: '収容重視社会',
    description: '難民を無期限で施設に収容する社会では、出入国管理の徹底や治安維持がしやすくなる一方、人権侵害との批判を受けやすく、国際的な非難や信頼低下を招く恐れがある。支援団体の反対は、社会に多様な視点をもたらし、制度改善のきっかけにもなるが、政府と市民の対立が深まれば、社会の分断や政策の混乱を招く可能性もある。'
  },
  {
    title: '人道的課題社会',
    description: '難民を無期限で施設に収容する社会では、治安維持や出入国管理の徹底がしやすいという利点がある一方で、長期的な収容によって管理費用が膨大になり、財政負担が増すという課題がある。また、収容される側の精神的・身体的負担が深刻化し、人道的観点からの批判も強まる。'
  },
  {
    title: '排除主義社会',
    description: '難民を追い返して強制送還する社会では、移民管理の厳格さや国の主権を強調できる一方で、人道的配慮に欠けるとして国内外から強い批判を受ける可能性がある。特に、迫害の恐れがある国へ送り返すことは、国際法や人権条約に違反する恐れがあり、国際的な信用の低下につながる。'
  },
  {
    title: '対立助長社会',
    description: '難民を追い返して強制送還する社会では、国境管理の厳格化や一部の国民の不安解消といった短期的な利点がある一方で、帰国した難民が迫害や紛争に巻き込まれ、命の危険にさらされる深刻な問題が生じる。これは国際社会からの批判や、人道的責任の放棄として非難を受ける原因となる。'
  },
  {
    title: '抑圧的対応社会',
    description: '難民を追い返そうとする社会では、自国の治安や経済的負担を抑えられるという利点がある一方、人道的責任を果たせず、国際的な批判を受ける可能性がある。居場所を失った難民が不安定な状況で居座ることで、社会の緊張や治安悪化の原因にもなりかねない。また、支援の届かない人々が増えることで、長期的には社会の分断や不信感が深まり、持続可能な共生の道が閉ざされる恐れもある。'
  },
  {
    title: '多文化葛藤社会',
    description: '難民を追い返そうとする社会では、治安や経済的負担への懸念から国の秩序を守る意識が強まる。一方で、行き場を失った難民が長期にわたり入管に収容されることで、人道的な問題や国際的な批判を招く恐れがある。こうした対応は、国の排他的な姿勢を強め、差別や孤立を生む原因にもなり得る。難民の尊厳や基本的人権をどう守るかが問われ、社会全体の価値観が試される状況となる。'
  },
  {
    title: '孤立社会',
    description: '難民を受け入れる社会では、多様な文化や価値観が共存し、国際的な寛容さが育まれる一方で、言語や生活習慣の違いから地域社会に溶け込めず、摩擦が生じることもある。その結果、偏見や差別が広がり、受け入れ側の不満や不安が増す場合もある。しかし、このような課題に向き合うことで、共生社会のあり方を見直し、より包摂的な社会づくりにつながる可能性もある。'
  },
  {
    title: '社会的支援課題社会',
    description: '難民を受け入れることで多様性が広がり、人道的な支援が実現する一方、言語や文化の壁から社会に馴染めず、仕事や住居を失いホームレスになる人も出てくる。これにより治安や福祉への不安が高まることもあるが、支援体制を整えることで社会の包容力を高める機会にもなり得る。'
  },
  {
    title: '経済発展社会',
    description: '難民を受け入れ、彼らが労働力として社会に参加することで、人手不足の解消や経済の活性化が期待できる。一方で、言語や文化の違いから地域社会との摩擦が生じることもある。制度や支援が不十分だと、差別や孤立を招く可能性もあるため、受け入れ体制の整備が重要となる。'
  },
  {
    title: '社会分断社会',
    description: '難民を受け入れ、彼らが仕事に就く社会は、人手不足の解消や多様性の促進という良い面がある。一方で、地元住民が仕事を奪われたと感じ、不満や差別が生まれることもある。共に働くには理解と制度の整備が必要であり、共生には時間と努力が求められる。'
  }
]

// ヘルパー関数：質問IDから質問オブジェクトを取得
export function getQuestionById(id: string): Question | undefined {
  return questionFlow.questions.find(q => q.id === id)
}

// ヘルパー関数：結果タイトルから結果オブジェクトを取得
export function getResultByTitle(title: string): Result | undefined {
  return results.find(r => r.title === title)
} 