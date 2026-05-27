# V2 Product Spec: Desire Pattern Profile

This spec turns the V2 research note and critique into something buildable. The research note stays as bibliography/context. This file is the product plan.

## Product Decision

V2 should be a new instrument, not a DSKB extension.

V1 remains the DSKB-inspired quiz and can stay live as a legacy/fan/prototype experience. V2 should avoid DSKB letters, copied axes, and copied archetypes. The goal is an original Japanese-first erotic preference profile informed by sexology, relationship science, and internet quiz UX.

Working product name:

**Desire Pattern Profile**

Japanese working name:

**欲望パターン診断**

This is a placeholder, not final branding.

## Non-Goals

- Do not claim clinical validity.
- Do not diagnose attachment style, sexual dysfunction, kink identity, trauma, orientation, or mental health.
- Do not make explicit fetish labels the public result.
- Do not ship a 10-subscale radar chart.
- Do not make the public result a copied DSKB-style code or an opaque suffix code like `DSKBfi`.
- Do not collect sensitive response data until a privacy plan exists.

## Core Product Promise

Tell the user:

> Your result shows how desire tends to activate, what conditions make it feel safe, and whether your fantasies are mainly imagination, real-life preference, or both.

The quiz should feel:

- personal but not invasive;
- adult but not explicit;
- Japanese-social-media native;
- useful for self-understanding and partner conversation;
- fast enough to finish on mobile.

## Instrument Shape

Pilot version:

- 30 items total
- 5 dimensions
- 6 items per dimension
- 5-point Likert scale
- estimated time: 3-4 minutes
- no visible dimension labels during the quiz
- Japanese-first item copy, English secondary

Later validation version:

- A/B test 30-item and 40-item forms.
- Only collect anonymous response data after consent, privacy copy, and APPI/GDPR review.
- Run reliability and factor checks after at least 300 responses, ideally 500+.

## Five Dimensions

### 1. Fantasy-Practice Distance

Measures whether desire is mainly imaginative, enactment-oriented, or both.

Poles:

- **Fantasy-leaning:** enjoys ideas/scenarios as imagination, not necessarily as real-life desire.
- **Practice-leaning:** wants preferences to be possible in real life under safe conditions.

Research base:

- Joyal et al. fantasy prevalence.
- SOI-R distinction between desire, attitude, and behavior.

Product role:

- This is the most important V2 differentiator.
- It prevents the app from treating fantasy as literal intent.

### 2. Spark-Brake Pattern

Measures activation and inhibition together: how quickly desire turns on, and how easily context shuts it down.

Poles:

- **Fast-spark:** desire activates easily from cues, mood, images, words, or situations.
- **Guarded-spark:** desire needs safety, low pressure, trust, timing, or reduced distraction.

Research base:

- Dual Control Model.
- SIS/SES and SESII-W/M.

Product role:

- Adds real sexology backbone.
- Helps explain mismatch without blaming the user.

### 3. Body-Story Focus

Measures whether desire is pulled more by sensory/physical cues or narrative/contextual cues.

Poles:

- **Body-focused:** touch, appearance, movement, sensation, physical immediacy.
- **Story-focused:** situation, language, role, emotional setup, symbolic meaning.

Research base:

- Sexual satisfaction domains.
- Fantasy-content literature.

Product role:

- Replaces the V1 sensory/story concept with broader, safer wording.

### 4. Agency Orientation

Measures whether desire tends to feel better when leading/directing or yielding/following.

Poles:

- **Lead-leaning:** enjoys initiating, guiding, setting rhythm, deciding direction.
- **Yield-leaning:** enjoys being invited, guided, trusted, or carried by another person's lead.

Research base:

- Kink/power-exchange literature, without labeling the user as BDSM.
- Interactional sexual satisfaction research.

Product role:

- Keeps a useful interpersonal dynamic axis without copying DSKB's K/k framing.

### 5. Depth-Variety Orientation

Measures whether desire tends toward focused emotional depth or novelty/exploration.

Poles:

- **Depth-leaning:** stronger desire with trust, familiarity, exclusivity, or a specific person.
- **Variety-leaning:** stronger desire with novelty, playfulness, surprise, or broader exploration.

Research base:

- SOI-R, especially desire/attitude facets.
- Sexual satisfaction and relationship-context literature.

Product role:

- Replaces V1 relational breadth with clearer Japanese-friendly meaning.

## Public Result Model

Show a short 5-letter type code as the social handle, while keeping the archetype title and dimensional meters as the actual interpretation.

Public result should have:

- **type code:** one letter per dimension, always assigned by which side of 50 the score lands on;
- **profile title:** a short moniker that feels like an identity label;
- **two strongest traits:** the two dimensions farthest from 50;
- **private detail:** all five meters.

Example:

- Type: `FSBLD`
- Title: `妄想家`
- Strong traits: Fantasy-leaning + Depth-leaning
- Detail meters: all five dimensions

English can use translated archetype names, but Japanese should drive naming. Prefer short native-feeling labels such as `妄想家`, `仕掛け人`, `受け手`, `火付け役`, or `変幻自在` over katakana copies of English monikers.

### Type Code Letters

- Fantasy-Practice Distance: `F` = Fantasy, `R` = Real
- Spark-Brake Pattern: `S` = Spark, `C` = Caution
- Body-Story Focus: `B` = Body, `M` = Meaning
- Agency Orientation: `L` = Lead, `Y` = Yield
- Depth-Variety Orientation: `D` = Depth, `V` = Variety
The code is meant to be memorable like MBTI, but the app should avoid implying clinical precision. The visible explanation should make clear that the code is a shorthand for dimensional scores.
Near-midpoint axes still receive a letter in the public code, but the detail meters should make their low strength clear.

### Result Families

Rather than 32 fixed lore-heavy types, V2 should start with curated result families generated from the strongest two traits. Every visible result still needs a simple moniker.

Example families:

- Fantasy + Depth: `妄想家` / `The Dreamer`
- Fantasy + Variety: `冒険家` / `The Explorer`
- Practice + Body: `体感派` / `The Sensor`
- Practice + Lead: `仕掛け人` / `The Director`
- Guarded Spark + Depth: `守り手` / `The Gatekeeper`
- Fast Spark + Story: `火付け役` / `The Igniter`
- Balanced: `変幻自在` / `The Switch`

Fallback combinations should use two-part monikers, for example `妄想家・受け手` or `The Dreamer-Receiver`, rather than generic labels like `Fantasy Yield Type`. This avoids forcing every possible binary combination into a brittle MBTI-like taxonomy while still keeping the output memorable. If user response data later shows stable clusters, we can replace these with empirically derived archetypes.

## Scoring

Each item has:

```js
{
  id: 'fp_01',
  dimension: 'fantasyPractice',
  direction: 1,
  text: {
    ja: '...',
    en: '...'
  }
}
```

Likert values:

- Strongly disagree: `-2`
- Disagree: `-1`
- Neutral: `0`
- Agree: `1`
- Strongly agree: `2`

For each dimension:

1. Reverse score items where `direction` is `-1`.
2. Sum item values.
3. Convert from possible range `[-12, 12]` to `[0, 100]`.
4. `0` means left pole, `100` means right pole.
5. Scores from `41-59` are balanced.

Thresholds:

- `0-40`: left pole
- `41-59`: mixed/balanced
- `60-100`: right pole

Trait strength:

```js
strength = Math.abs(score - 50)
```

Primary traits are the two dimensions with highest strength. A result family is selected from those two traits.

## Data Schema

URL result format:

```text
?v=2&fp=37&sb=64&bs=72&ay=45&dv=31&lang=ja
```

Fields:

- `v`: result schema version
- `fp`: fantasy-practice score
- `sb`: spark-brake score
- `bs`: body-story score
- `ay`: agency score
- `dv`: depth-variety score
- `lang`: `ja` or `en`

Local storage:

```js
{
  version: 2,
  currentQuestionIdx: 12,
  answers: {
    fp_01: 1,
    sb_01: -1
  },
  lang: 'ja'
}
```

No server persistence in pilot version.

## Result UI

Top result card:

- archetype title
- short one-line result phrase
- two strongest traits
- share button

Detail report:

- 5 horizontal meters, not radar
- each meter shows both pole labels
- one paragraph explaining each score
- "Fantasy vs real-life comfort" note if fantasy-practice distance is high
- "Conditions that help desire feel safe" note if guarded-spark is high

Share card:

- archetype title
- two trait chips
- app name
- no explicit text
- no raw answer data

## Compatibility

Pilot compatibility should be simple and transparent.

For two profiles A and B:

```js
distance = average(abs(A[dimension] - B[dimension]))
fit = 100 - distance
```

Then add interpretive notes:

- High Body-Story distance: "One person may need more context/language, the other may respond faster to sensory cues."
- High Spark-Brake distance: "Pacing and pressure may matter."
- High Depth-Variety distance: "Novelty vs familiarity may need negotiation."
- High Agency distance can be complementary if one is Lead and one is Yield.

Do not call any pairing "bad." Use "easy fit," "interesting contrast," and "needs conversation."

## Starter Item Bank

These are draft items, not final copy. They are intentionally non-explicit.

### Fantasy-Practice Distance

1. `fp_01`, direction `-1`
   - ja: 想像の中では惹かれることでも、実際にやりたいとは限らない。
   - en: Some things can appeal to me in fantasy without being something I want in real life.

2. `fp_02`, direction `1`
   - ja: 惹かれるシチュエーションは、現実でも安全に試せる形だとより魅力的に感じる。
   - en: If a scenario appeals to me, it feels more exciting when it could safely happen in real life.

3. `fp_03`, direction `-1`
   - ja: 頭の中だけだからこそ楽しめる欲望がある。
   - en: Some desires are enjoyable precisely because they stay in my imagination.

4. `fp_04`, direction `1`
   - ja: 空想だけで終わるより、現実の関係の中で確かめたいと思うことが多い。
   - en: I often want to explore what attracts me within a real relationship, not only in fantasy.

5. `fp_05`, direction `-1`
   - ja: 物語や妄想としては好きでも、現実では距離を置きたいテーマがある。
   - en: There are themes I enjoy as stories or fantasies but would keep distance from in real life.

6. `fp_06`, direction `1`
   - ja: 自分の好みは、空想と現実であまり大きく変わらない。
   - en: My preferences do not change much between fantasy and real life.

### Spark-Brake Pattern

1. `sb_01`, direction `-1`
   - ja: ちょっとした言葉や雰囲気で気持ちが入りやすい。
   - en: A small cue, phrase, or mood can quickly draw me in.

2. `sb_02`, direction `1`
   - ja: 不安や気になることがあると、気持ちがすぐに止まりやすい。
   - en: If I feel worried or distracted, my desire can shut down quickly.

3. `sb_03`, direction `-1`
   - ja: 予定外のきっかけでも、気分が合えば自然に乗れる。
   - en: If the mood is right, I can go along with an unexpected spark.

4. `sb_04`, direction `1`
   - ja: 安心できる場所やタイミングがないと、なかなか気持ちが動かない。
   - en: Without the right safety, timing, or setting, it is hard for me to feel desire.

5. `sb_05`, direction `-1`
   - ja: 視線、声、距離感などの小さな変化に反応しやすい。
   - en: I am sensitive to small shifts in gaze, voice, or closeness.

6. `sb_06`, direction `1`
   - ja: プレッシャーを感じると、魅力的な相手でも気持ちが冷めやすい。
   - en: Pressure can cool my desire even with someone I find attractive.

### Body-Story Focus

1. `bs_01`, direction `-1`
   - ja: 体の感覚や見た目の印象に強く惹かれやすい。
   - en: I am strongly drawn to physical sensation and visual impressions.

2. `bs_02`, direction `1`
   - ja: ただの刺激より、そこに至る流れや意味がある方が惹かれる。
   - en: I am more drawn in when there is a meaningful build-up or story behind the moment.

3. `bs_03`, direction `-1`
   - ja: 言葉よりも、触れ方や距離感の方が気持ちに響く。
   - en: Touch and physical distance affect me more than words.

4. `bs_04`, direction `1`
   - ja: 設定、役割、関係性の空気があると気持ちが入りやすい。
   - en: A scenario, role, or relationship atmosphere helps me get drawn in.

5. `bs_05`, direction `-1`
   - ja: 理屈や物語がなくても、直感的な感覚だけで十分に惹かれる。
   - en: I can be drawn in by immediate sensation without needing much story or explanation.

6. `bs_06`, direction `1`
   - ja: その場の意味や文脈が合わないと、刺激だけでは物足りない。
   - en: Without the right meaning or context, stimulation alone can feel unsatisfying.

### Agency Orientation

1. `ay_01`, direction `-1`
   - ja: 自分から流れを作ったり、相手を導いたりする方が自然に感じる。
   - en: It feels natural for me to shape the flow or guide the other person.

2. `ay_02`, direction `1`
   - ja: 信頼できる相手に流れを任せる方が気持ちが入りやすい。
   - en: I get drawn in more easily when I can trust someone else to guide the flow.

3. `ay_03`, direction `-1`
   - ja: 相手の反応を見ながら、自分でペースを決めたい。
   - en: I like setting the pace while reading the other person's reactions.

4. `ay_04`, direction `1`
   - ja: 自分で決めるより、相手から誘われたり求められたりする方が響く。
   - en: Being invited or wanted by the other person affects me more than deciding everything myself.

5. `ay_05`, direction `-1`
   - ja: 曖昧な状況では、自分が方向性を示したくなる。
   - en: In ambiguous situations, I tend to want to set the direction.

6. `ay_06`, direction `1`
   - ja: 主導権を手放せる安心感があると、より素直に楽しめる。
   - en: When it feels safe to let go of control, I can enjoy myself more freely.

### Depth-Variety Orientation

1. `dv_01`, direction `-1`
   - ja: 特定の相手との信頼や積み重ねがあるほど、気持ちが深まりやすい。
   - en: Trust and shared history with one person make desire deepen for me.

2. `dv_02`, direction `1`
   - ja: 新しさや予想外の展開があると、気持ちが動きやすい。
   - en: Novelty or unexpected turns make desire easier for me to feel.

3. `dv_03`, direction `-1`
   - ja: 広がりよりも、一人との濃い関係の方に惹かれる。
   - en: I am more drawn to depth with one person than broad exploration.

4. `dv_04`, direction `1`
   - ja: 決まった形より、遊びや変化の余地がある関係に惹かれる。
   - en: I am drawn to relationships with room for play, change, and exploration.

5. `dv_05`, direction `-1`
   - ja: 安心できる相手だからこそ、欲望を出しやすい。
   - en: I can express desire more easily with someone who feels safe and familiar.

6. `dv_06`, direction `1`
   - ja: いつも同じ流れだと、気持ちが鈍くなりやすい。
   - en: If things always follow the same pattern, my desire can dull.

## Implementation Plan

### Phase 1: Docs and Data Model

- Add `src/data/v2Questions.js`.
- Add `src/data/v2ResultFamilies.js`.
- Add scoring helper functions:
  - `scoreV2Answers(answers)`
  - `getPrimaryTraits(scores)`
  - `getV2ResultFamily(scores)`
  - `encodeV2ResultUrl(scores, lang)`
  - `decodeV2ResultUrl(params)`

### Phase 2: App Route

- Keep V1 default.
- Add V2 entry from welcome screen as "Try V2 beta".
- Use `?v=2` in URLs to load V2 results.
- Do not break existing `?result=DSKB` URLs.

### Phase 3: UI

- Reuse current quiz shell.
- Add V2 welcome text and disclaimer.
- Add V2 result screen:
  - top archetype card;
  - 5 meter rows;
  - 2 strongest trait chips;
  - share/copy/download controls.

### Phase 4: Quality Pass

- Mobile screenshots at 390px and 430px.
- Check no horizontal overflow.
- Check V1 result URLs still work.
- Check V2 result URLs round-trip.
- `npm run lint`
- `npm run build`

## Open Decisions

1. Final product name.
2. Final Japanese archetype names.
3. Whether V2 beta should be visible on the homepage immediately or hidden behind a query flag.
4. Whether to add anonymous opt-in analytics later.
5. Whether partner comparison is Phase 2 or a separate mini-app.
