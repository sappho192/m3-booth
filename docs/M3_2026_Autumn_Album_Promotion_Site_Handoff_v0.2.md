# M3 2026 Autumn Album Promotion Site Handoff v0.2

## 0. 문서 목적

이 문서는 2026년 10월 25일 M3 행사에서 공개할 앨범의 프로모션 사이트 `https://m3.sapphosound.com`을 구현하기 위한 handoff 문서입니다.

현재 사이트는 Cloudflare Workers와 GitHub를 연동해 배포할 수 있는 최소 상태까지 준비되어 있으며, 디자인과 인터랙션은 아직 본격적으로 구현하지 않았습니다.

이 문서의 목표는 다음과 같습니다.

- 사이트가 전달해야 하는 감정과 연출 의도를 보존합니다.
- 디자인 방향을 구체적인 화면 구조와 동작으로 변환합니다.
- 멀티트랙 오디오 재생 구조를 안정적으로 구현할 수 있도록 기술 방향을 고정합니다.
- 앨범 재킷과 최종 이미지가 아직 없는 상태에서도 개발을 시작할 수 있도록 합니다.
- 추후 재킷 일러스트가 완성되었을 때 기존 구조를 버리지 않고 자연스럽게 통합할 수 있도록 합니다.
- 최근 작곡 수업에서 정리된 작곡 원리를 시각 연출과 인터랙션 판단 기준에 반영합니다.

---

## 1. 프로젝트 배경

### 1.1 행사와 목적

- 대상 행사: M3 2026 Autumn
- 행사일: 2026-10-25
- 사이트: `https://m3.sapphosound.com`
- 목적: 행사에서 공개할 앨범을 소개하고, 방문자가 짧은 시간 안에 음악의 분위기와 앨범의 정체성을 체험하도록 합니다.
- 배포 기반: Cloudflare Workers + GitHub
- 현재 상태: Hello World 수준의 초기 페이지가 배포된 상태입니다.

이 사이트는 일반적인 정보형 음반 판매 페이지보다, 앨범을 짧게 체험하는 단일 페이지형 인터랙티브 microsite를 지향합니다.

---

## 2. 음악과 시각 콘셉트

### 2.1 음악적 방향

프로모션 사이트에서 사용할 곡은 다음과 같은 방향입니다.

- Emotional Progressive House
- Organic한 질감
- Monstercat Silk 계열의 감성
- Shingo Nakamura를 연상시키는 Progressive House의 정서
- 강한 클럽 연출보다는 따뜻하고 자연스러운 공간감을 중심으로 합니다.

곡을 이미지로 표현하면 다음 문장이 가장 가깝습니다.

> 노을 지는 바다를 바라보고 있는데, 이따금씩 바람이 불어오는 순간.

이 문장을 사이트 디자인의 중심 메타포로 사용합니다.

### 2.2 작곡 수업에서 반영한 핵심 원리

최근 작곡 수업에서 반복적으로 확인한 원리를 사이트의 디자인 원칙으로 다음과 같이 번역합니다.

1. **에너지는 요소의 개수보다 리듬과 밀도의 변화에서 만들어집니다.**  
   소리를 더 크게 하거나 시각 효과를 더 많이 추가하는 방식보다, 반복의 방식·리듬·밀도·보이싱·오스티나토의 변화로 에너지 차이를 만듭니다.

2. **새로운 재료를 계속 추가하기보다 기존 재료를 변형합니다.**  
   새로운 섹션에 들어갈 때마다 전혀 다른 시각 언어를 도입하기보다, 같은 수평선·수면·빛·바람을 유지하면서 배열과 강조점을 바꿉니다.

3. **Entrance와 Hero는 tension → release 구조를 가져야 합니다.**  
   이 전환은 단순한 UI transition이 아니라 짧은 musical phrase처럼 느껴져야 합니다.

4. **오스티나토와 pulse는 화면의 호흡에도 대응할 수 있습니다.**  
   시각 요소는 매 박 직접 반응하는 visualizer가 아니라, 음악 안에 숨어 있는 반복성과 긴 주기를 느슨하게 공유합니다.

이 네 가지 원리는 이후의 시각 디자인과 인터랙션 판단 기준 전반에 적용합니다.

### 2.3 최종 앨범 재킷

최종 재킷에는 일본 애니메이션 스타일의 캐릭터 일러스트가 들어갈 예정입니다.

현재는 재킷이 준비되지 않았으므로 초기 사이트는 재킷에 의존하지 않고 다음 요소만으로 성립해야 합니다.

- 해질녘의 색
- 수평선
- 바다를 연상시키는 낮은 대비의 움직임
- 바람을 연상시키는 느리고 비주기적인 애니메이션
- 여백이 넓은 타이포그래피
- 음악 자체

추후 재킷이 완성되면 Hero의 중심 이미지 또는 배경 레이어에 삽입하되, 사이트 전체 구조를 다시 만들 필요가 없어야 합니다.

---

## 3. 핵심 UX 콘셉트

이 사이트의 가장 중요한 경험은 다음 한 문장으로 정의합니다.

> 방문자는 킥이 빠진 음악이 흐르는 노을빛 입구에서 잠시 머물다가, 사이트 안으로 들어가는 순간 첫 킥과 함께 앨범의 세계가 완성되는 경험을 합니다.

단순히 배경음악을 켜고 끄는 기능이 아니라, 음악의 편곡 자체가 페이지 전환과 연결되어야 합니다.

### 3.1 경험 구조

- Entrance는 tension 구간입니다.
- Hero는 release 지점입니다.
- 첫 킥은 단순한 사운드 효과가 아니라 tension을 해소하는 사건입니다.
- 시각 변화는 그 사건을 보조해야 하며, 첫 킥보다 더 강하게 느껴지면 안 됩니다.

즉, 이 사이트는 “버튼을 누르면 메인 페이지가 보이는 구조”가 아니라, “짧은 도입부를 지나 곡의 세계 안으로 들어가는 구조”를 목표로 합니다.

---

## 4. 진입 플로우

### 4.1 첫 방문 화면

첫 화면은 거의 단독 화면으로 구성합니다.

```text
                         SAPPHO SOUND


                    NEW ALBUM / M3 2026


                   ♪ ENTER WITH SOUND

                      ENTER SILENTLY
```

배경에는 직접적인 사진을 사용하지 않고 추상적인 노을과 수평선만 표현합니다.

초기 상태에서는 스크롤을 잠그거나, 최소한 메인 콘텐츠가 바로 보이지 않도록 합니다.

### 4.2 ENTER WITH SOUND

사용자가 `ENTER WITH SOUND`를 누르면 다음 순서로 동작합니다.

1. 사용자 gesture 안에서 `AudioContext`를 생성하거나 `resume()`합니다.
2. 세 개의 stem을 동일한 `AudioContext.currentTime` 기준으로 동시에 시작합니다.
3. `drums`와 `music`은 들리게 합니다.
4. `kick`도 같은 위치에서 재생하지만 `GainNode`를 0으로 설정합니다.
5. 2마디 또는 4마디 정도의 짧은 entrance 구간을 보여줍니다.
6. 다음 적절한 마디의 첫 박에 맞춰 메인 화면 transition을 시작합니다.
7. `kickGain`을 짧고 자연스럽게 1까지 올립니다.
8. 동시에 Hero의 전체 시각 요소를 완성합니다.
9. 스크롤을 허용하고 사용자가 본문을 탐색하게 합니다.

중요한 원칙은 **킥을 나중에 따로 재생하지 않는 것**입니다.

세 stem을 처음부터 같은 timeline에서 돌리고, 킥의 gain만 0으로 유지해야 sync가 안정적입니다.

추가 원칙은 다음과 같습니다.

- Entrance는 단순 대기 시간이 아니라 짧은 tension 구간이어야 합니다.
- Hero 전환은 “정해진 시간이 지나서 일어나는 효과”보다 “다음 downbeat에서 해소되는 사건”처럼 느껴져야 합니다.
- 시각 전환도 갑작스러운 장면 교체보다 기존 재료가 조금씩 완성되는 방향을 택합니다.

### 4.3 ENTER SILENTLY

사용자가 `ENTER SILENTLY`를 누르면 다음과 같이 동작합니다.

- 오디오를 시작하지 않습니다.
- entrance transition 자체는 동일하거나 조금 짧게 유지합니다.
- 메인 Hero로 이동합니다.
- 우측 하단의 audio control에서 나중에 음악을 켤 수 있도록 합니다.
- 음악을 나중에 켜는 경우에는 현재 사이트 상태와 상관없이 안정적인 루프 시작점에서 full mix를 재생해도 됩니다.

첫 버전에서는 silent mode에서 현재 시각 상태와 음악의 마디 위치를 정밀하게 맞출 필요가 없습니다.

---

## 5. 오디오 설계

### 5.1 Stem 구성

웹용으로 다음 3개의 stem을 준비합니다.

```text
kick
drums_no_kick
music
```

각 stem은 다음 조건을 만족해야 합니다.

- 같은 sample rate를 사용합니다.
- 정확히 같은 시작 sample을 사용합니다.
- 정확히 같은 종료 sample을 사용합니다.
- 완전히 같은 길이를 가집니다.
- 같은 루프 구간을 공유합니다.
- 세 stem을 합쳤을 때 의도한 웹용 reference mix와 최대한 동일하게 들려야 합니다.

### 5.2 권장 길이

초기 버전은 약 16마디 정도를 권장합니다.

Progressive House가 약 120~124 BPM이라고 가정하면 약 31~32초 정도입니다.

너무 짧으면 반복감이 쉽게 느껴지고, 너무 길면 모바일 브라우저에서 디코딩 메모리와 초기 로딩 비용이 불필요하게 증가합니다.

최초 PoC에서는 16마디를 기준으로 구현한 뒤 실제 음악을 들어보고 조정합니다.

### 5.3 루프 제작 방법

루프 경계에서 reverb나 delay tail이 끊기지 않도록 다음 방식으로 export하는 것을 권장합니다.

```text
|------ 16 bars ------|------ 16 bars ------|------ 16 bars ------|
       pre-roll               USE                   post-roll
```

동일 구간을 여러 번 반복해 렌더링한 뒤, 가운데 반복 구간만 잘라서 사용합니다.

이렇게 하면 앞선 반복에서 생성된 공간계 tail이 이미 존재하므로 loop boundary가 더 자연스럽습니다.

### 5.4 Mastering 주의 사항

DAW에서 개별 stem을 단순 solo export했을 때 세 stem의 합이 원본 master와 동일하지 않을 수 있습니다.

특히 다음 처리가 master bus에 있다면 주의합니다.

- Compressor
- Limiter
- Clipper
- Saturator
- Dynamic EQ
- Bus processing
- Kick에 반응하는 sidechain processing

웹용 stem은 별도의 Web Mix Bus를 기준으로 준비하는 것을 권장합니다.

```text
kick
  \
drums_no_kick  ---> WEB MIX BUS ---> reference
  /
music
```

세 stem의 합이 reference와 가능한 한 동일하게 들려야 합니다.

### 5.5 Sidechain 처리

`music` stem에 킥 sidechain pumping을 bake한 상태라면 entrance에서 킥이 들리지 않더라도 음악은 4-on-the-floor 리듬으로 숨을 쉬게 됩니다.

이는 기술적으로 이상한 상태처럼 보일 수 있지만, 이번 사이트의 연출에서는 오히려 유효할 가능성이 있습니다.

즉, 아직 들리지 않는 킥의 흔적이 음악에 남아 있는 효과가 생깁니다.

최종 판단은 실제 entrance loop를 들어보고 결정합니다.

### 5.6 편곡 관점에서의 판단 기준

웹용 루프와 entrance 구간은 단순히 “소리가 비어 있는 버전”이면 충분하지 않습니다.

다음 질문으로 판단합니다.

- 킥이 빠졌을 때도 곡의 pulse가 남아 있는가?
- drums와 harmonic layer만으로도 기대감이 생기는가?
- 첫 킥이 들어오는 순간 release처럼 느껴지는가?
- 킥이 들어오기 전과 후의 차이가 분명하지만 과장되어 있지는 않은가?

웹 오디오 설계는 기술 구현이지만, 최종 판단 기준은 편곡상의 납득감이어야 합니다.

---

## 6. Web Audio 구현 방향

### 6.1 기본 구조

`<audio>` 태그 세 개를 각각 재생하는 방식보다 Web Audio API를 사용합니다.

```text
AudioBufferSourceNode (kick)
        |
     GainNode
        |
        +--------------------+
                             |
AudioBufferSourceNode (drums)|
        |                    |
     GainNode                |
        |                    |
        +------> masterGain ---> destination
                             |
AudioBufferSourceNode (music)|
        |                    |
     GainNode                |
        |                    |
        +--------------------+
```

### 6.2 동시 시작

세 source는 반드시 같은 `when` 값으로 시작합니다.

```ts
const startAt = ctx.currentTime + 0.1;

kickSource.start(startAt);
drumsSource.start(startAt);
musicSource.start(startAt);
```

초기 gain은 다음과 같이 설정합니다.

```ts
kickGain.gain.value = 0;
drumsGain.gain.value = 1;
musicGain.gain.value = 1;
masterGain.gain.value = 1;
```

### 6.3 킥 진입

킥은 메인 화면으로 전환되는 musical boundary에서 활성화합니다.

즉시 `gain.value = 1`로 바꾸기보다는 아주 짧은 ramp를 사용합니다.

```ts
kickGain.gain.setValueAtTime(0, kickInAt);
kickGain.gain.linearRampToValueAtTime(1, kickInAt + 0.08);
```

실제 ramp 길이는 음악을 들어보고 20~150 ms 사이에서 조정합니다.

목표는 “페이드 인”이 들리는 것이 아니라 click 없이 자연스럽게 킥이 나타나는 것입니다.

### 6.4 BPM 기반 transport

사이트는 최소한 다음 값을 알고 있어야 합니다.

```ts
const BPM = 122;
const BEATS_PER_BAR = 4;

const secondsPerBeat = 60 / BPM;
const secondsPerBar = secondsPerBeat * BEATS_PER_BAR;
```

가능하면 모든 주요 entrance transition을 일반적인 `setTimeout()` 기준이 아니라 AudioContext 시간축에 맞춥니다.

예를 들어 다음 시점을 계산할 수 있도록 합니다.

- 시작 후 4마디
- 다음 bar의 첫 박
- 특정 loop cycle의 첫 박

첫 버전에서는 완전한 DAW 수준 transport가 필요하지 않습니다.

단, `audioEngine.getNextBarTime()` 정도의 추상화는 만들어 두는 편이 좋습니다.

### 6.5 Loop

세 source 모두 동일한 loop range를 사용합니다.

```ts
source.loop = true;
source.loopStart = LOOP_START;
source.loopEnd = LOOP_END;
```

필요하면 전체 파일이 아니라 내부 구간을 loop하도록 구성합니다.

---

## 7. 오디오 파일 포맷

초기 구현에서는 Ogg Opus를 우선 후보로 사용합니다.

```text
/public/audio/kick.opus
/public/audio/drums.opus
/public/audio/music.opus
```

파일 크기와 품질을 실제로 확인한 뒤 bitrate를 정합니다.

초기 목표는 음악 품질을 명확하게 훼손하지 않으면서, 모바일에서도 부담 없이 로드되는 수준입니다.

필요하면 MP3 또는 AAC fallback을 추가할 수 있도록 asset loader를 추상화합니다.

---

## 8. 시각 디자인 방향

### 8.1 핵심 원칙

사이트는 다음 분위기를 가져야 합니다.

- 따뜻합니다.
- 감성적이지만 지나치게 몽환적이지 않습니다.
- Organic합니다.
- 바다와 노을을 직접적인 사진으로 묘사하지 않습니다.
- 클럽 VJ처럼 강하게 반응하지 않습니다.
- Progressive House의 정서를 유지합니다.
- 애니메이션 일러스트와 나중에 결합해도 충돌하지 않아야 합니다.

시각 디자인은 다음 세 가지 규칙을 우선합니다.

1. **음악에 반응하기보다 음악과 같은 호흡을 가집니다.**
2. **새로운 효과보다 기존 재료의 변형을 우선합니다.**
3. **에너지 차이는 rhythm, density, contrast, motion의 차이로 표현합니다.**

### 8.2 초기 색상 후보

아래 색상은 확정값이 아니라 구현 초기의 방향성입니다.

```css
:root {
  --sunset-apricot: #efb08f;
  --sunset-rose: #cf8d98;
  --dusk-violet: #777997;
  --sea-blue: #405667;
  --deep-sea: #1f303a;
  --warm-white: #f5efe7;
}
```

위에서 아래로 길게 흐르는 gradient를 사용합니다.

하늘에서 바다로 자연스럽게 이어지되, 명확한 수평선 한 줄을 둡니다.

### 8.3 움직임

움직임은 매우 느리고 작아야 합니다.

권장 요소:

- 수평선 부근의 약한 shimmer
- 바다의 낮은 대비 움직임
- 아주 느린 gradient drift
- 가끔만 나타나는 수평 방향의 바람 같은 distortion
- 약한 film grain 또는 texture
- Hero 요소의 느린 opacity / translate transition

피해야 할 요소:

- 킥마다 화면 전체가 커지는 효과
- 강한 spectrum visualizer
- 빠른 particle
- 과도한 glow
- 강한 chromatic aberration
- EDM festival 스타일의 flash

### 8.4 움직임의 음악적 대응

시각 움직임은 음악의 리듬과 느슨하게 연결될 수 있습니다.

권장 방식:

- 수면의 아주 약한 밝기 변화는 2마디 또는 4마디 단위의 긴 pulse처럼 움직입니다.
- 바람 distortion은 매 박 반응하지 않고 더 긴 cycle에서 드물게 나타납니다.
- Entrance와 Hero의 분위기 차이는 완전히 다른 애니메이션을 쓰기보다 같은 애니메이션의 밀도와 존재감을 조절하는 방식으로 만듭니다.

즉, 시각 효과는 beat-synced visualizer가 아니라, 음악 안에 숨어 있는 ostinato와 pulse를 느슨하게 번역한 움직임에 가깝습니다.

---

## 9. Entrance와 Hero의 시각 전환

### 9.1 Entrance

```text
             sappho sound


────────────────────────────
             horizon


        NEW ALBUM / M3 2026

          ENTER WITH SOUND
            ENTER SILENTLY
```

킥은 들리지 않습니다.

색 대비가 약하고 화면의 움직임도 매우 작습니다.

Entrance는 “정보를 기다리는 화면”이 아니라 짧은 tension 구간입니다.

### 9.2 Main Hero

킥이 들어오는 순간 다음 변화가 동시에 일어납니다.

- Hero title이 완성됩니다.
- 수평선이 조금 더 선명해집니다.
- 바다의 contrast가 소폭 증가합니다.
- reflection 또는 surface motion이 조금 더 살아납니다.
- 메인 콘텐츠가 스크롤 가능한 상태가 됩니다.
- 화면 하단의 scroll indicator가 나타납니다.

시각적 변화는 음악의 킥보다 강하면 안 됩니다.

킥이 주인공이고 화면은 이를 보조해야 합니다.

### 9.3 Variation, not Replacement

Hero 이후의 각 섹션도 전혀 다른 장면처럼 보이지 않는 편이 좋습니다.

권장 원칙:

- Concept, Tracklist, Credits가 나올 때 배경 언어를 갈아엎지 않습니다.
- 같은 수평선, 같은 바다, 같은 색조를 유지합니다.
- 대신 명암, 질감, 움직임의 밀도, 타이포그래피의 배치만 조금씩 바꿉니다.

페이지 전체가 하나의 장면 안에서 조금씩 전개되는 Progressive House처럼 느껴지는 것이 이상적입니다.

---

## 10. 페이지 정보 구조

사이트는 단일 페이지로 구성합니다.

```text
Entrance
  ↓
Hero
  ↓
Concept
  ↓
Tracklist
  ↓
M3 Information
  ↓
Credits
  ↓
External Links
```

### 10.1 Hero

필수:

- Album title 또는 temporary title
- Sappho Sound
- M3 2026 Autumn
- 필요하면 짧은 subtitle
- 추후 album artwork 삽입 가능 영역

Hero는 “정보 소개”보다 “세계의 입구”에 가까워야 합니다.

### 10.2 Concept

1~3문장 정도로 충분합니다.

장문의 설명보다 음악의 분위기를 전달하는 역할을 합니다.

장르 설명만 반복하기보다, 이 음악이 어떤 감정의 이동을 가지는지 짧고 명확하게 전달하는 편이 좋습니다.

Concept 문구는 다음 성격을 목표로 합니다.

- 정서적 이동을 말합니다.
- 공간감과 온도를 말합니다.
- 해질녘, 바다, 바람 같은 중심 메타포를 과장 없이 사용합니다.

### 10.3 Tracklist

최종 트랙리스트가 준비되면 추가합니다.

초기 개발 중에는 placeholder를 사용해도 됩니다.

추후 실제 수록곡의 감정선이 정리되면, 각 트랙에 짧은 키워드 또는 한 줄 설명을 붙이는 방식을 고려할 수 있습니다.

### 10.4 M3 Information

향후 확정되는 다음 정보를 표시할 수 있도록 합니다.

- Date
- Venue
- Circle space / booth
- Price
- Format
- QR 또는 purchase link

### 10.5 Credits

다음 정보를 지원하도록 합니다.

- Composition
- Arrangement
- Mixing
- Mastering
- Illustration
- Design
- 기타 협업자

### 10.6 External Links

예상 후보:

- X
- BOOTH
- Bandcamp
- SoundCloud
- YouTube
- 기타 Sappho Sound 링크

실제 링크는 확정된 것만 표시합니다.

---

## 11. Floating Audio Control

메인 페이지에 들어간 뒤 우측 하단 또는 하단 중앙에 작은 오디오 컨트롤을 둡니다.

초기 버전에서는 다음 기능만 있으면 충분합니다.

- mute / unmute
- playing / paused state 표시

```text
♫ PREVIEW
```

또는

```text
❚❚ PREVIEW
```

첫 버전에서는 음량 slider를 필수로 만들지 않습니다.

모바일에서 너무 많은 UI를 차지하지 않도록 합니다.

---

## 12. 기술 구조

현재 사이트 기반이 Astro라면 Astro 구조를 유지하는 것을 권장합니다.

```text
src/
├─ components/
│  ├─ Entrance.astro
│  ├─ Hero.astro
│  ├─ Concept.astro
│  ├─ Tracklist.astro
│  ├─ EventInfo.astro
│  ├─ Credits.astro
│  └─ AudioControl.astro
│
├─ scripts/
│  ├─ audio-engine.ts
│  └─ entrance-controller.ts
│
├─ styles/
│  ├─ global.css
│  ├─ entrance.css
│  └─ ocean.css
│
└─ pages/
   └─ index.astro

public/
├─ audio/
│  ├─ kick.opus
│  ├─ drums.opus
│  └─ music.opus
└─ assets/
   └─ placeholder/
```

클라이언트 상태 관리 라이브러리는 초기에는 사용하지 않습니다.

필요한 상태는 다음 정도입니다.

```ts
type ExperienceState =
  | "idle"
  | "loading-audio"
  | "entrance-playing"
  | "entering"
  | "main"
  | "silent";
```

이 정도라면 vanilla TypeScript로 충분합니다.

---

## 13. AudioEngine 책임 범위

`audio-engine.ts`는 DOM이나 화면 transition을 직접 조작하지 않는 것을 권장합니다.

책임:

```ts
class AudioEngine {
  load(): Promise<void>;
  startKickless(): Promise<void>;
  startFullMix(): Promise<void>;
  bringKickIn(at?: number): void;
  mute(): void;
  unmute(): void;
  pause(): void;
  resume(): Promise<void>;

  getCurrentTime(): number;
  getNextBeatTime(): number;
  getNextBarTime(): number;
}
```

화면 전환은 `entrance-controller.ts`에서 담당하고 AudioEngine의 musical timing만 참조합니다.

이렇게 분리하면 오디오 디버깅과 UI 디버깅을 별도로 할 수 있습니다.

---

## 14. 모바일 우선 고려 사항

M3 현장에서 QR 코드를 통해 스마트폰으로 접속할 가능성이 높으므로 모바일을 우선합니다.

최소 요구 사항:

- iPhone Safari에서 정상 동작해야 합니다.
- Android Chrome에서 정상 동작해야 합니다.
- 첫 화면의 두 버튼은 엄지손가락으로 쉽게 누를 수 있어야 합니다.
- Hero가 세로 화면에서도 자연스럽게 보여야 합니다.
- 오디오 로딩 중 상태를 명확하게 표시해야 합니다.
- 데이터 사용량이 지나치게 크지 않아야 합니다.
- 음악을 선택하지 않은 사용자가 불필요한 전체 오디오 asset을 무조건 다운로드하지 않도록 가능한 범위에서 lazy loading을 고려합니다.

단, 구현 복잡도가 커지면 첫 PoC에서는 단순 preload를 허용합니다.

---

## 15. 접근성 및 사용자 선택

배경음악은 사용자의 명시적인 선택으로 시작해야 합니다.

반드시 다음 선택지를 제공합니다.

- `ENTER WITH SOUND`
- `ENTER SILENTLY`

또한 다음을 지킵니다.

- 언제든 음악을 끌 수 있어야 합니다.
- silent mode를 차별적인 하위 경험으로 만들지 않습니다.
- `prefers-reduced-motion`을 존중합니다.
- 키보드 focus가 보이게 합니다.
- 텍스트 대비를 충분히 확보합니다.

`prefers-reduced-motion: reduce`인 경우에는 수면 애니메이션과 큰 transition을 줄이되 음악 기능은 그대로 유지합니다.

---

## 16. 성능 기준

초기 목표:

- 첫 HTML/CSS는 매우 가볍게 유지합니다.
- 이미지가 없는 상태에서는 LCP가 빠르게 나와야 합니다.
- 오디오 로딩이 실패해도 사이트 자체는 정상적으로 사용할 수 있어야 합니다.
- 오디오 기능과 콘텐츠 표시를 강하게 결합하지 않습니다.
- JavaScript가 부분적으로 실패하더라도 최소 정보는 보이도록 합니다.

오디오 파일은 UI보다 훨씬 크므로 사용자의 `ENTER WITH SOUND` 선택 이후 로드하는 전략도 고려합니다.

다만 entrance에서 즉시 재생해야 하므로 다음 절충안을 검토합니다.

1. 첫 화면 로드 후 idle 시점에 fetch를 시작합니다.
2. 사용자가 Sound를 선택하면 decode를 진행합니다.
3. 준비가 끝날 때까지 `LOADING SOUND...` 상태를 표시합니다.
4. 준비된 뒤 entrance playback을 시작합니다.

---

## 17. 구현 단계

### Phase 1: Visual Skeleton

목표:

- 오디오 없이 전체 단일 페이지 구조를 완성합니다.
- 노을 gradient, 수평선, 바다 움직임을 구현합니다.
- Entrance와 Hero transition을 구현합니다.
- 모바일 layout을 먼저 완성합니다.

완료 조건:

- 사이트를 열면 의도한 분위기가 전달됩니다.
- 이미지가 없어도 빈 placeholder처럼 보이지 않습니다.
- entrance에서 main으로 자연스럽게 이동합니다.
- 아직 오디오가 없어도 tension → release 구조의 의도가 읽힙니다.

### Phase 2: Audio Engine

목표:

- dummy 또는 실제 stem 3개를 로드합니다.
- sample-aligned playback을 구현합니다.
- kickless playback을 구현합니다.
- full mix 전환을 구현합니다.
- mute / unmute를 구현합니다.

완료 조건:

- 세 stem의 sync가 긴 시간 재생해도 어긋나지 않습니다.
- loop boundary가 거슬리지 않습니다.
- 킥을 넣을 때 click이 발생하지 않습니다.

### Phase 3: Musical Entrance

목표:

- BPM 정보를 코드에 반영합니다.
- next bar 계산을 구현합니다.
- 2~4마디 entrance 뒤에 main transition을 예약합니다.
- 킥 진입과 visual transition을 musical boundary에 맞춥니다.

완료 조건:

- 첫 킥과 Hero 완성이 하나의 사건처럼 느껴집니다.
- transition이 프레임 기반 타이머 때문에 눈에 띄게 어긋나지 않습니다.
- entrance가 단순 대기 시간이 아니라 짧은 tension 구간처럼 느껴집니다.

### Phase 4: Real Content

다음을 실제 데이터로 교체합니다.

- 앨범명
- Tracklist
- M3 정보
- Credits
- External links

내용이 아직 미정이면 별도 data object 또는 config 파일로 관리합니다.

### Phase 5: Artwork Integration

재킷이 완성된 뒤 진행합니다.

목표:

- 현재 노을/바다 디자인 위에 artwork를 자연스럽게 통합합니다.
- artwork가 전체 화면의 시각 언어를 압도하지 않도록 조절합니다.
- 필요하면 artwork에서 주요 색상을 추출해 현재 palette를 미세 조정합니다.

### Phase 6: Melody-aware Refinement

최종곡의 핵심 멜로디가 정리된 뒤 선택적으로 진행합니다.

목표:

- 대표적인 melodic contour 하나를 시각 gesture 하나에 대응시킵니다.
- melody를 직접 그리듯 시각화하지 않고 상승·하강·호흡 같은 형태만 번역합니다.
- 이미 구축한 ocean / horizon 언어를 유지하면서 미세하게 반영합니다.

이 단계는 필수가 아닙니다. 다만 사이트를 “Progressive House 분위기의 사이트”에서 “이 곡을 위해 만들어진 사이트”로 발전시키는 데 도움이 됩니다.

---

## 18. 구현 우선순위

우선순위는 다음과 같습니다.

1. 음악 경험
2. 모바일 UX
3. Entrance → Hero 전환
4. 분위기 있는 시각 디자인
5. 정보 전달
6. 세부 애니메이션
7. 부가 기능

시각 효과를 많이 넣는 것보다 핵심 전환 한 번을 완성도 높게 만드는 편이 중요합니다.

또한 새로운 효과를 추가하는 것보다, 기존 시각 재료를 더 음악적으로 변형하는 편을 우선합니다.

---

## 19. 의도적으로 하지 않을 것

첫 버전에서는 다음 기능을 피합니다.

- 복잡한 3D
- Three.js 기반 장면
- 강한 audio spectrum visualizer
- 모든 섹션마다 stem mix를 변경하는 기능
- scroll-driven DJ mix
- 복잡한 state management
- SPA router
- 과도한 particle system
- autoplay 우회
- 필수적인 로그인이나 쿠키
- 대형 영상 배경

이 사이트의 핵심은 기술 시연이 아니라 음악의 인상을 강화하는 것입니다.

또한 전개감을 만들기 위해 장면을 계속 갈아엎는 방식도 지양합니다.

---

## 20. 디자인 판단 기준

새로운 효과나 인터랙션을 추가하려고 할 때 다음 질문으로 판단합니다.

> 이 효과가 노을 지는 바다와 이따금씩 불어오는 바람이라는 감정을 강화하는가?

> 이 효과가 첫 킥의 순간보다 더 강하게 느껴지지는 않는가?

> 이 변화는 완전히 새로운 것을 꺼내는가, 아니면 기존 재료의 리듬과 밀도를 더 음악적으로 변형하는가?

> 이 전환은 단순한 화면 효과인가, 아니면 tension 뒤의 release처럼 느껴지는가?

첫 번째 질문에는 가능한 한 `yes`여야 합니다.

두 번째 질문이 `yes`라면 효과를 약하게 만들거나 제거합니다.

세 번째와 네 번째 질문에서는 가능한 한 후자를 선택합니다.

---

## 21. Codex가 우선 확인해야 할 사항

작업 시작 시 다음을 먼저 확인합니다.

1. 현재 repository 구조와 Astro 버전을 확인합니다.
2. Cloudflare 배포 방식과 기존 configuration을 확인합니다.
3. 현재 `index` 페이지와 불필요한 starter 콘텐츠를 확인합니다.
4. CSS reset과 font 설정 상태를 확인합니다.
5. public asset 배포 경로를 확인합니다.
6. 개발 서버와 Cloudflare production 양쪽에서 AudioContext 동작을 확인합니다.

기존 배포 파이프라인은 가능한 한 유지하고, 사이트 구현을 위해 불필요하게 infrastructure를 교체하지 않습니다.

---

## 22. 필요한 임시 asset과 config

재킷이 없어도 다음만 있으면 실제 PoC를 완성할 수 있습니다.

```text
kick.opus
drums.opus
music.opus
```

추가로 다음 값을 임시 config로 둡니다.

```ts
export const album = {
  artist: "Sappho Sound",
  title: "NEW ALBUM",
  event: "M3 2026 Autumn",
  date: "2026-10-25",
  bpm: 122,
  entranceBars: 4,
  visualPulseBars: 2,
};
```

BPM, 제목, `entranceBars`, `visualPulseBars`는 실제 곡과 연출이 확정되는 즉시 수정합니다.

---

## 23. 권장 완료 상태

첫 번째 usable milestone은 다음 경험이 구현된 상태입니다.

1. 모바일에서 사이트를 엽니다.
2. 노을빛 수평선과 최소한의 텍스트가 보입니다.
3. `ENTER WITH SOUND`를 누릅니다.
4. kickless mix가 시작됩니다.
5. 약 2~4마디 동안 entrance가 진행됩니다.
6. 다음 bar의 첫 박에서 킥이 들어옵니다.
7. 동시에 Hero가 완성됩니다.
8. 사용자는 아래로 스크롤하면서 앨범 정보를 봅니다.
9. 우측 하단에서 언제든 음악을 끌 수 있습니다.
10. 약 30초 loop가 끊김 없이 반복됩니다.

이 경험이 안정적으로 동작하면 디자인을 추가로 확장할 가치가 있습니다.

이상적인 상태는 다음과 같습니다.

- 사용자가 시각 효과를 따로 의식하지 않아도 음악과 같은 호흡을 느낍니다.
- 섹션이 바뀌어도 하나의 장면 안에서 전개되는 인상을 받습니다.
- 첫 킥의 순간이 페이지 전체에서 가장 중요한 사건으로 남습니다.

---

## 24. 최종 제품의 핵심 문장

Codex가 구현 중 방향을 잃었을 때는 다음 문장으로 돌아갑니다.

> 이 사이트는 앨범을 설명하는 페이지가 아니라, 방문자가 노을빛 입구를 지나 음악 안으로 들어가는 약 10초의 순간을 만드는 페이지입니다.

세부적인 디자인 판단이 필요할 때는 다음 문장도 함께 기준으로 삼습니다.

> 화면은 새로운 것을 계속 보여주기보다, 같은 재료를 조금씩 변화시키며 음악의 에너지와 함께 호흡해야 합니다.

나머지 UI와 콘텐츠는 이 두 원칙을 방해하지 않도록 설계합니다.
