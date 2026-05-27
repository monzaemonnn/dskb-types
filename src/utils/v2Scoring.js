import { v2Questions } from '../data/v2Questions';
import { v2Dimensions, v2ResultFamilies, v2TraitMonikers } from '../data/v2Profile';

export const v2ScoreKeys = Object.keys(v2Dimensions);

function clampPercentage(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return null;
  return Math.min(100, Math.max(0, Math.round(numericValue)));
}

export function scoreV2Answers(answers) {
  const rawScores = Object.fromEntries(v2ScoreKeys.map((key) => [key, 0]));

  v2Questions.forEach((question) => {
    const answer = answers[question.id] ?? 0;
    rawScores[question.dimension] += answer * question.direction;
  });

  return Object.fromEntries(
    v2ScoreKeys.map((key) => {
      const percentage = Math.round(((rawScores[key] + 12) / 24) * 100);
      return [key, Math.min(100, Math.max(0, percentage))];
    })
  );
}

export function getTraitSide(score) {
  if (score <= 40) return 'left';
  if (score >= 60) return 'right';
  return 'balanced';
}

export function getTypeSide(score) {
  return score <= 50 ? 'left' : 'right';
}

export function getV2TypeCode(scores) {
  return v2ScoreKeys
    .map((key) => {
      const side = getTypeSide(scores[key]);
      return v2Dimensions[key].code[side];
    })
    .join('');
}

export function getV2CodeTraits(scores) {
  return v2ScoreKeys.map((key) => {
    const side = getTypeSide(scores[key]);
    const dimension = v2Dimensions[key];

    return {
      key,
      side,
      code: dimension.code[side],
      name: dimension.codeName[side],
      label: dimension[side],
      score: scores[key]
    };
  });
}

export function getPrimaryTraits(scores) {
  return v2ScoreKeys
    .map((key) => ({
      key,
      score: scores[key],
      side: getTraitSide(scores[key]),
      strength: Math.abs(scores[key] - 50)
    }))
    .sort((a, b) => b.strength - a.strength)
    .slice(0, 2);
}

const v2SideData = {
  fantasyPractice_left: {
    strengths: {
      ja: ['豊かな想像力で親密さのアイデアを育む力', '日常の制約に縛られないクリエイティブな発想'],
      en: ['Ability to nurture intimacy ideas with rich imagination', 'Creative thinking unbound by daily constraints']
    },
    cautions: {
      ja: ['現実的なアプローチに直面した際の気後れ', '空想の完璧さに比べて現実が物足りなく感じること'],
      en: ['Hesitation when facing direct real-world approaches', 'Reality feeling underwhelming compared to perfect fantasies']
    },
    idealConditions: {
      ja: '想像力を否定せず、言葉や演出での表現を面白がってくれる環境。',
      en: 'An environment where imagination is valued and creative expression is welcomed.'
    }
  },
  fantasyPractice_right: {
    strengths: {
      ja: ['現実的な体験としての確かさと安心感を重んじる姿勢', '二人の空間で実際に起きる手触りや反応への集中力'],
      en: ['Value placed on tangible reality and safety in experiences', 'Focus on physical touch and real-time response in shared space']
    },
    cautions: {
      ja: ['未知のシチュエーションに対する慎重すぎる警戒感', '想像力の余白やロマンチックな演出を軽視しがちになること'],
      en: ['Overly cautious stance toward untested scenarios', 'Tendency to overlook creative imagination or romantic setups']
    },
    idealConditions: {
      ja: 'プレッシャーがなく、安全で予測可能な現実のステップ。',
      en: 'Safe, predictable real-life steps free from performance pressure.'
    }
  },
  sparkBrake_left: {
    strengths: {
      ja: ['わずかな変化や魅力的なきっかけに即座に反応できる感度', '親密な時間の立ち上がりが早く、情熱をスムーズに共有できること'],
      en: ['Quick responsiveness to subtle shifts or attractive cues', 'Fast warm-up in intimate moments, sharing passion smoothly']
    },
    cautions: {
      ja: ['ムードの急な変化によって熱が一気に冷めやすいこと', '衝動に任せて進み、お互いの心の準備を確認し忘れるリスク'],
      en: ['Prone to cooling down instantly if the mood shifts abruptly', 'Risk of rushing forward on impulse without checking readiness']
    },
    idealConditions: {
      ja: 'タイミングが良く、気持ちが高まった瞬間にスムーズに呼応できる関係。',
      en: 'Well-timed interactions that respond smoothly when excitement peaks.'
    }
  },
  sparkBrake_right: {
    strengths: {
      ja: ['自分の感情と境界線をしっかりと守れる誠実さ', '時間をかけてゆっくりと深い信頼関係を育てていく慎重さ'],
      en: ['Integrity in protecting personal boundaries and feelings', 'Caution in nurturing deep, long-term trust over time']
    },
    cautions: {
      ja: ['警戒心の強さから、新しい変化やアプローチを受け入れにくいこと', '相手が脈がないと誤解して諦めてしまうほど、心を開くのに時間がかかること'],
      en: ['High guard making it hard to accept new approaches', 'Taking long enough to open up that partners may mistake it for lack of interest']
    },
    idealConditions: {
      ja: '進行を急かされず、安心できるベースが整うまで待ってくれる関係。',
      en: 'Intimacy that is never rushed, allowing safety to establish first.'
    }
  },
  bodyStory_left: {
    strengths: {
      ja: ['肌の触れ合いや身体的な感覚をストレートに楽しむ力', '言葉に頼らず、ノンバーバルな感覚を通じて親密さを伝える技術'],
      en: ['Direct enjoyment of physical touch and sensory input', 'Skill in conveying intimacy non-verbally through touch']
    },
    cautions: {
      ja: ['言葉での対話や精神的な文脈を省略しがちになること', '相手の感情の準備や、その場のストーリー構築を軽視する傾向'],
      en: ['Tendency to skip verbal dialogue or psychological context', 'Overlooking partner\'s emotional readiness or story building']
    },
    idealConditions: {
      ja: '身体感覚の心地よさを共有でき、肌の手触りを大切にする関係。',
      en: 'Shared appreciation for physical comfort and close tactile contact.'
    }
  },
  bodyStory_right: {
    strengths: {
      ja: ['言葉やシチュエーション、二人の関係性に深い意味を見出すロマンチシズム', '対話や空気感のビルドアップを丁寧に楽しむ感受性'],
      en: ['Finding deep meaning in words, setups, and relationship narratives', 'Sensory appreciation for dialogue and gradual build-up of mood']
    },
    cautions: {
      ja: ['設定や雰囲気が完璧でないと、気持ちが乗らないこと', '直接的なアプローチを粗雑または詩的でないと感じて拒絶しがちな点'],
      en: ['Difficulty getting in the mood if the setup or vibe is not perfect', 'Risk of rejecting direct approaches as unpoetic or crude']
    },
    idealConditions: {
      ja: '言葉のやり取りや、そこに至るストーリー・コンテキストがある環境。',
      en: 'Situations rich in verbal exchange, build-up, and clear narrative context.'
    }
  },
  agency_left: {
    strengths: {
      ja: ['二人の空間の方向性を自信を持ってリードする力', '相手の好みや反応を観察し、心地よい体験を設計する当事者意識'],
      en: ['Confident guidance in directing the shared space', 'Sense of responsibility in reading partner\'s cues to tailor experiences']
    },
    cautions: {
      ja: ['自分のやり方に固執し、相手のペースを見落としがちになること', 'リードし続けることに無意識のプレッシャーや疲労を感じること'],
      en: ['Sticking too closely to own plan, losing sight of partner\'s pace', 'Unconscious fatigue from the constant demand to lead and direct']
    },
    idealConditions: {
      ja: 'あなたのリードを信頼し、心地よく受け止めてくれるパートナー。',
      en: 'A partner who trusts your direction and receives it comfortably.'
    }
  },
  agency_right: {
    strengths: {
      ja: ['相手のリードや意思を尊重し、心地よく身を委ねられる柔軟性', '求められている状況に深くシンクロし、その喜びを表現できる素直さ'],
      en: ['Flexibility to yield and comfortably follow a partner\'s direction', 'Ability to synchronize with being desired and express genuine response']
    },
    cautions: {
      ja: ['自分の本当の要望や境界線を相手に伝えるのを遠慮してしまうこと', '相手のリードが曖昧なとき、どう振る舞えばいいか迷ってしまうこと'],
      en: ['Hesitation in asserting personal wishes or boundary limits', 'Feeling lost or passive if the partner\'s guidance is unclear']
    },
    idealConditions: {
      ja: '優しく明確なビジョンを持って、包み込むように導いてくれる環境。',
      en: 'Clear, gentle guidance that walks you through steps with care.'
    }
  },
  depthVariety_left: {
    strengths: {
      ja: ['特定の人との強い信頼関係や、積み重ねた歴史を何よりも重んじること', '深いレベルでの情緒的かつ肉体的な一体感を築く力'],
      en: ['Cherishing a history of trust and exclusive bonding above all', 'Capacity to build deep emotional and sensory connection']
    },
    cautions: {
      ja: ['新しいアプローチや変化を受け入れるのに強い心理的抵抗があること', '関係性がマンネリ化しても、安定にしがみついてしまうこと'],
      en: ['Psychological resistance to introducing changes or novelty', 'Clinging to stability even if the routine becomes stagnant']
    },
    idealConditions: {
      ja: '予測可能で、二人だけのプライベートな絆が深く守られた環境。',
      en: 'A private, exclusive bond that is deeply protected and predictable.'
    }
  },
  depthVariety_right: {
    strengths: {
      ja: ['常に新鮮な風を吹き込み、関係がマンネリ化するのを防ぐ行動力', '新しいアイデアやアプローチに対する高い好奇心と開放性'],
      en: ['Injecting freshness and excitement to keep the relationship from stalling', 'High curiosity and openness to fresh ideas or approaches']
    },
    cautions: {
      ja: ['同じパターンの繰り返しに退屈しやすく、持続的な余韻を楽しみにくいこと', '刺激を求めるあまり、安定した深い結びつきの価値を見落とすこと'],
      en: ['Easily bored by repetition, rushing past the afterglow', 'Chasing novelty at the cost of nurturing stable emotional depth']
    },
    idealConditions: {
      ja: '遊び心があり、新しい変化や実験的なアイデアを一緒に楽しめる環境。',
      en: 'A playful relationship open to trying new variations and ideas.'
    }
  }
};

function getFallbackFamily(first, second) {
  const firstMoniker = v2TraitMonikers[first.key][first.side];
  const secondMoniker = v2TraitMonikers[second.key][second.side];
  const firstLabel = v2Dimensions[first.key][first.side];
  const secondLabel = v2Dimensions[second.key][second.side];

  const firstKey = `${first.key}_${first.side}`;
  const secondKey = `${second.key}_${second.side}`;
  const firstData = v2SideData[firstKey];
  const secondData = v2SideData[secondKey];

  let bestMatch = 'balanced';
  let abyssMatch = 'sparkBrake_right_depthVariety_left';

  if (first.key === 'agency' || second.key === 'agency') {
    const agencySide = first.key === 'agency' ? first.side : second.side;
    if (agencySide === 'left') {
      bestMatch = 'bodyStory_right_agency_right';
    } else {
      bestMatch = 'bodyStory_left_agency_left';
    }
  }

  return {
    title: {
      ja: `${firstMoniker.ja}・${secondMoniker.ja}`,
      en: `The ${firstMoniker.en}-${secondMoniker.en}`
    },
    tagline: {
      ja: `${firstLabel.ja}と${secondLabel.ja}が重なり、欲望の入り方に独自のリズムが出やすいタイプです。`,
      en: `${firstMoniker.en} instincts meet ${secondMoniker.en} instincts, giving your desire pattern a distinct rhythm.`
    },
    description: {
      ja: `${firstMoniker.ja}としての傾向と、${secondMoniker.ja}としての傾向が組み合わさったパーソナリティです。親密さにおいては、${v2Dimensions[first.key].descriptions[first.side].ja} また、${v2Dimensions[second.key].descriptions[second.side].ja}`,
      en: `You combine the qualities of being ${firstMoniker.en}-leaning with those of being ${secondMoniker.en}-leaning. In intimate contexts, ${v2Dimensions[first.key].descriptions[first.side].en} Additionally, ${v2Dimensions[second.key].descriptions[second.side].en}`
    },
    strengths: {
      ja: [...firstData.strengths.ja, ...secondData.strengths.ja],
      en: [...firstData.strengths.en, ...secondData.strengths.en]
    },
    cautions: {
      ja: [...firstData.cautions.ja, secondData.cautions.ja[0]],
      en: [...firstData.cautions.en, secondData.cautions.en[0]]
    },
    idealConditions: {
      ja: `${firstData.idealConditions.ja} ${secondData.idealConditions.ja}`,
      en: `${firstData.idealConditions.en} In addition, ${secondData.idealConditions.en}`
    },
    bestMatch,
    abyssMatch
  };
}

export function getV2FamilyForTraits(first, second) {
  const directKey = `${first.key}_${first.side}_${second.key}_${second.side}`;
  const reverseKey = `${second.key}_${second.side}_${first.key}_${first.side}`;

  return {
    key: v2ResultFamilies[directKey] ? directKey : reverseKey,
    family: v2ResultFamilies[directKey] || v2ResultFamilies[reverseKey] || getFallbackFamily(first, second)
  };
}

export function getV2ResultFamily(scores) {
  const primaryTraits = getPrimaryTraits(scores).filter((trait) => trait.side !== 'balanced');
  if (primaryTraits.length < 2) return v2ResultFamilies.balanced;

  const [first, second] = primaryTraits;
  return getV2FamilyForTraits(first, second).family;
}

export function getV2ArchetypeCatalog() {
  const archetypes = [{
    key: 'balanced',
    family: v2ResultFamilies.balanced,
    traits: [],
    isBalanced: true
  }];

  v2ScoreKeys.forEach((firstKey, firstIndex) => {
    v2ScoreKeys.slice(firstIndex + 1).forEach((secondKey) => {
      ['left', 'right'].forEach((firstSide) => {
        ['left', 'right'].forEach((secondSide) => {
          const first = { key: firstKey, side: firstSide };
          const second = { key: secondKey, side: secondSide };
          const { key, family } = getV2FamilyForTraits(first, second);

          archetypes.push({
            key,
            family,
            traits: [first, second],
            isBalanced: false
          });
        });
      });
    });
  });

  return archetypes;
}

export function encodeV2ResultUrl(scores, lang) {
  const params = new URLSearchParams({ v: '2', lang });

  v2ScoreKeys.forEach((key) => {
    params.set(v2Dimensions[key].param, String(scores[key]));
  });

  return params;
}

export function decodeV2ResultUrl(params) {
  if (params.get('v') !== '2') return null;

  const scores = {};
  for (const key of v2ScoreKeys) {
    const value = clampPercentage(params.get(v2Dimensions[key].param));
    if (value === null) return null;
    scores[key] = value;
  }

  return {
    scores,
    lang: params.get('lang') === 'en' ? 'en' : 'ja'
  };
}
