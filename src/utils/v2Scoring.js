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

function getFallbackFamily(first, second) {
  const firstMoniker = v2TraitMonikers[first.key][first.side];
  const secondMoniker = v2TraitMonikers[second.key][second.side];
  const firstLabel = v2Dimensions[first.key][first.side];
  const secondLabel = v2Dimensions[second.key][second.side];

  return {
    title: {
      ja: `${firstMoniker.ja}・${secondMoniker.ja}`,
      en: `The ${firstMoniker.en}-${secondMoniker.en}`
    },
    tagline: {
      ja: `${firstLabel.ja}と${secondLabel.ja}が重なり、欲望の入り方に独自のリズムが出やすいタイプです。`,
      en: `${firstMoniker.en} instincts meet ${secondMoniker.en} instincts, giving your desire pattern a distinct rhythm.`
    }
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
