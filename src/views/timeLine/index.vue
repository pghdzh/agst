<template>
  <div class="augusta-page" aria-live="polite">
    <main class="container" ref="mainContainer">
      <!-- HERO 区域 -->
      <header class="hero" role="banner">
        <div class="left-col">
          <button class="avatar-card">
            <picture class="avatar-wrap">
              <img
                src="@/assets/images1/agst-slty (14).webp"
                class="avatar"
                loading="lazy"
                decoding="async"
              />
            </picture>
            <div class="avatar-meta">
              <span class="avatar-badge">共鸣能力：未曜的磁律</span>
            </div>
          </button>
        </div>
        <div class="right-col" ref="metaCard">
          <div class="hero-panel">
            <h1 class="name">
              奥古斯塔 <span class="jp">（七丘总督 · 英雄王）</span>
            </h1>
            <p class="subtitle">烈阳所照，皆是征途；荣耀，归于七丘！</p>
            <p class="lead">
              角斗场上的不败冠冕，七丘地区最强大的角斗士，七丘现任总督。
              她以平凡之躯成就辉煌，以剑锋诠释何为力量。从法比亚纳遗孤到英雄王，
              她以非凡的政治手腕和无可匹敌的武力，成为七丘众望所归的领袖。
            </p>
            <div class="hero-tags">
              <span class="tag">七丘总督</span>
              <span class="tag">不败冠军</span>
              <span class="tag">法比亚纳遗孤</span>
            </div>
          </div>
        </div>
      </header>

      <!-- 共鸣状况 -->
      <section id="resonance-status" class="card overview">
        <div class="card-head">
          <h2>共鸣状况 · 磁律掌控者</h2>
        </div>
        <div class="two-col">
          <div class="text-block">
            <p>
              <strong>姓名：奥古斯塔</strong><br />
              该选手共鸣史长，几乎等同于年龄，推测为先天型共鸣者。
              该选手声痕位于左手手背，共鸣后能以自身为中心产生并操控半径约十米的磁场。伴随对共鸣能力的熟练使用，选手可以自由操纵、塑形能力范围内含有铁、钴、镍的物质。
            </p>
            <p>
              但根据选手自述及测试数据推算，该共鸣能力存在开发上限，半径十米似乎就已经是其所能使用能力的极限范围。
              在战斗中，这种能力可以偏转金属武器，制造电磁脉冲干扰敌人，甚至在一定范围内形成磁场护盾。
            </p>
          </div>
          <div class="text-block">
            <p>
              "少见的先天型共鸣者，但她的共鸣能力仅能在一定程度上辅助自己的战斗，平平无奇就是对它最好的描述。这样的选手想要在角斗赛中脱颖而出，就跟让太阳在午夜升起一样，不切实际。"——来自检验医生的评语
            </p>
            <p>
              那道自童年时期就烙印在她手上的声痕，是来自上天的恩赐，同时也像一个恶毒的玩笑。孱弱的共鸣能力曾是她自己设下的枷锁，而如今，她早已熔断这层桎梏。
            </p>
            <p>
              她用自己的脚步上高天，她向世人证明，即便生为无光的尘埃，也能绽放烈阳般的辉煌。未曜的磁律在她手中，已从辅助工具转变为战场上令人胆寒的力量。
            </p>
          </div>
        </div>
      </section>

      <!-- 象征物展示区 -->
      <section id="symbolic-items" class="card special-section">
        <div class="card-head">
          <h2>象征之物 · 记忆与信念</h2>
        </div>

        <section class="item-section">
          <div class="card-head">
            <h3>日与狮鹫之印</h3>
          </div>
          <div class="content two-col">
            <div class="img-area">
              <img src="./img/item1.png" loading="lazy" decoding="async" />
            </div>
            <div class="text-block">
              <p>
                据说雕琢印章所用的石材，取自先祖们初次登上七丘高地时足下所踏的山岩。石岩的质地坚硬而细腻，色泽洁白，其上蜿蜒的纹路，是岁月刻在这片土地上，无可磨灭的痕迹。
              </p>
              <p>
                印章的表面，嵌有以华贵金属铸就的鹰鹫及太阳，前者象征无畏和远见，后者则寓意恒久与辉煌。人们将建立七丘城之初一切美好的愿景，授予这枚小小的印章，时刻提醒着它的所有者：<strong>勿忘初志</strong>。
              </p>
              <p>
                奥古斯塔至今仍记得第一次触碰印章时指尖传来的温度，那种冰冷中带着灼意的触感，是<strong>权力在沉默中沸腾</strong>。她深知这份权柄的背后，并非只有荣耀，一如这枚印章，它轻巧得足以让人毫不费力地抛起，却又沉重地躺在掌心，像压在脊骨上那无从卸下的责任。
              </p>
            </div>
          </div>
        </section>

        <section class="item-section">
          <div class="card-head">
            <h3>旧发带</h3>
          </div>
          <div class="content two-col">
            <div class="img-area">
              <img src="./img/item2.png" loading="lazy" decoding="async" />
            </div>
            <div class="text-block">
              <p>
                曾为无名少女的奥古斯塔，用闲暇时打零工攒下的钱，买下了这条印有七丘传统图案的发带。那会儿的她还只是个活在尘埃里、默默无闻的角斗士，每当上场迎战时，她总会将这条发带系在额间。它见证了她的每一场战斗，也悄悄为她拭去了每一次无言的泪水。
              </p>
              <p>
                在一场血战前夕，奥古斯塔将发带摊平在膝上，她手法笨拙，却仍旧一针一线地在发带的背面绣下了一排小字：
              </p>
              <p>"<strong>愿我流血时，仍不忘为何而举剑。</strong>"</p>
              <p>
                字迹歪斜，针脚生涩，她绣完最后一针，然后站起身，又一次将发带紧绑在额前。
              </p>
              <p>她没有回望向来时的路。</p>
              <p>此刻，她已无需再回头了。</p>
            </div>
          </div>
        </section>

        <section class="item-section">
          <div class="card-head">
            <h3>"小橡斗"</h3>
          </div>
          <div class="content two-col">
            <div class="img-area">
              <img src="./img/item3.png" loading="lazy" decoding="async" />
            </div>
            <div class="text-block">
              <p>
                年少的奥古斯塔用橡果创造出的“玩伴”，它与它那几位其貌不扬又命途多舛的兄弟姐妹有一个共同的来处，法比亚纳的大橡树。
              </p>
              <p>
                那时，奥古斯塔的双手还有些稚拙，她先后摆弄出的好几个歪歪扭扭的橡果角斗士，不是断了腿，就是塌了脑袋，她为那些“短命”的小家伙们一一取了名字，却又不得不挨个将它们埋进院子里。直到她将尚未完工的小橡斗递到父亲面前，在那个有些闷热的夜晚，小橡斗在父亲的手中“活”了下来，它结实、漂亮，像一位了不起的角斗士。
              </p>
              <p>是的，小橡斗是一位战功赫赫的角斗士，它的战绩如下：</p>
              <p>——打败了一只试图在它头盔上结网的小跳蛛。</p>
              <p>——打败了闯进窗户的暴雨。</p>
              <p>——打败了橡果角斗士"大块头"。</p>
              <p>——打败了橡果角斗士"高个子"。</p>
              <p>
                在奥古斯塔童年无垠的想象中，小橡斗才是<strong>“英雄王”</strong>最该有的模样。
              </p>
              <p>
                许多年过去，如今，小橡斗静静地躺在书房的角落，像一位久经沙场、功成身退的年迈角斗士。而那个曾仰望它、渴望成为它的人，依然走在奔赴未来的路上。
              </p>
            </div>
          </div>
        </section>

        <section class="item-section">
          <div class="card-head">
            <h3>甘叶分瓣面包</h3>
          </div>
          <div class="content two-col">
            <div class="img-area">
              <img src="./img/food.png" loading="lazy" decoding="async" />
            </div>
            <div class="text-block">
              <p>
                无甚特别的七丘传统面包，即便在远离城区的法比亚纳，它亦是随处可见的寻常餐食。可似乎是为了区别于其他庸常无奇，法比亚纳当地的师傅总是习惯在面包那层酥脆的面壳上，撒上一小撮香料碎叶，顺便郑重其事地用小刀在面皮上刻下“美味”二字，仿佛这质朴的宣言，多少能赋予面包一些与众不同的体面。
              </p>
              <p>是美味的吧？年少的奥古斯塔从未这么认为。</p>
              <p>
                那不过是玩得筋疲力尽后归家，伸手可得的果腹之物，是母亲日复一日端上餐桌的平淡“注脚”，它干硬、朴素、无需赞美，像水、像阳光，平凡到几乎难以被人察觉。直到多年后，在七丘城住所的炉灶前，奥古斯塔尝试寻回那存在于记忆深处的味道，当熟悉的微香和甘甜再次浮现于齿间，她才终于明白了<strong>“美味”</strong>的含义。
              </p>
              <p>或许，她从未有一刻真正与故乡告别。</p>
            </div>
          </div>
        </section>
      </section>

      <!-- 剧情时间线 -->
      <section
        id="timeline"
        class="card timeline"
        aria-labelledby="timeline-heading"
      >
        <div class="card-head">
          <h2 id="timeline-heading">命运轨迹 · 从遗孤到英雄王</h2>
        </div>
        <div class="tl-wrap" role="list">
          <div class="vl" aria-hidden="true"></div>
          <ol class="tl-list">
            <li
              v-for="(ev, i) in timeline"
              :key="i"
              class="tl-item"
              role="listitem"
              tabindex="0"
            >
              <div class="tl-card">
                <h3 class="tl-title">{{ ev.title }}</h3>
                <p class="tl-desc">{{ ev.desc }}</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <!-- 共鸣链详解 -->
      <section id="resonance-chain" class="card resonance-chain">
        <div class="card-head">
          <h2>共鸣链详解 · 以众愿为冕</h2>
        </div>
        <div class="chain-grid">
          <div
            v-for="(chain, i) in resonanceChains"
            :key="i"
            class="chain-card"
            :class="`chain-${i + 1}`"
          >
            <div class="chain-header">
              <span class="chain-number">第 {{ i + 1 }} 链</span>
              <h3 class="chain-title">{{ chain.title }}</h3>
            </div>
            <div class="chain-content">
              <p>{{ chain.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 奥古斯塔纪事 -->
      <section class="ll-stories" ref="storyRef">
        <div class="card" role="region" aria-labelledby="stories-title">
          <header class="card-head">
            <h2 id="stories-title" class="card-title">奥古斯塔纪事</h2>
          </header>

          <main class="card-body">
            <transition name="fade-slide" mode="out-in">
              <article
                :key="items[current].id"
                :id="`panel-${items[current].id}`"
                class="story"
                role="tabpanel"
              >
                <h3 class="story-head">{{ items[current].title }}</h3>
                <div class="story-content">{{ items[current].content }}</div>
              </article>
            </transition>
          </main>

          <footer class="card-foot">
            <button class="nav-btn" @click="prev" aria-label="上一则故事">
              ‹
            </button>
            <div class="pager">{{ current + 1 }} / {{ items.length }}</div>
            <button class="nav-btn" @click="next" aria-label="下一则故事">
              ›
            </button>
          </footer>
        </div>
      </section>
    </main>

    <!-- 浮动元素 -->
    <div class="floating-elements">
      <div
        v-for="(element, i) in floatingElements"
        :key="i"
        class="floating-element"
        :style="{
          top: element.top + 'px',
          left: element.left + 'px',
          animationDelay: element.delay + 's',
        }"
      >
        {{ element.symbol }}
      </div>
    </div>

    <div class="floating-chibis">
      <img
        v-for="(pet, i) in chibiList"
        :key="i"
        :src="pet.src"
        :style="{ top: pet.top + 'px', left: pet.left + 'px' }"
        class="chibi-img"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// 剧情时间线
const timeline = ref([
  {
    title: "法比亚纳遗孤",
    desc: "出生于法比亚纳，是十六年前黑潮事件的唯一幸存者。幼年时开始听到低语，被错误引导认为这些声音来自死去的英雄王。",
  },
  {
    title: "角斗士之路",
    desc: "从无名角斗士开始，凭借顽强的意志和战斗天赋，在角斗场上屡战屡胜，逐渐崭露头角。",
  },
  {
    title: "击败马格诺",
    desc: "在地下角斗场击败了隐藏身份的七丘总督马格诺，展现了超越传说的实力，引起了总督的注意。",
  },
  {
    title: "总督继任",
    desc: "接受马格诺的托付，成为七丘新任总督。马格诺选择以毒酒结束生命，将未来的希望寄托于奥古斯塔。",
  },
  {
    title: "低语真相",
    desc: "在索诺拉大树洞发现真相——脑海中的声音并非英雄王，而是鸣式利维亚坦的蛊惑，目的是为了未来夺舍她的强大肉身。",
  },
  {
    title: "英雄王的诞生",
    desc: "主动制造'英雄王'，让漂泊者击败自己，以旧王的血为新王加冕。在决战中真正成为预言中的英雄王，一拳打碎宿命。",
  },
]);

// 共鸣链
const resonanceChains = ref([
  {
    title: "于焦壤中蒙垢",
    desc: ` 【以众愿为冕】每层使暴击伤害额外提升15%。

 【以众愿为冕】上限提高至2层。

奥古斯塔施放变奏技能·灼金的巡行时，也可以获得1层【以众愿为冕】
 共鸣技能·不败恒阳·迅击、共鸣技能·不败恒阳·跃空、共鸣技能·不败恒阳·落袭免疫打断。`,
  },
  {
    title: "于血戮中涤尘",
    desc: `【以众愿为冕】获得额外效果：每层使暴击提升20%。
奥古斯塔暴击高于100%时，每多出1%暴击，奥古斯塔暴击伤害提升2%，最高可提升100%暴击伤害。`,
  },
  {
    title: "于朽腐中砺骨",
    desc: `以下技能的伤害倍率提升25%：
·重击·烁雷·后撤、重击·烁雷·旋切、重击·烁雷·升拳。
·共鸣技能·不败恒阳·落袭。
·共鸣解放·赫日威临·烈阳、共鸣解放·赫日威临·不朽者之肃。`,
  },
  {
    title: "于荣辉中孤行",
    desc: `施放变奏技能·灼金的巡行时，队伍中的角色的攻击提升20%，持续30秒。`,
  },
  {
    title: "于怒潮中卓立",
    desc: `施放变奏技能·灼金的巡行时，队伍中的角色的攻击提升20%，持续30秒。`,
  },
  {
    title: "于耀光中刻名",
    desc: `·【以众愿为冕】的上限提升至4层。
·奥古斯塔暴击高于150%时，每多出1%暴击，奥古斯塔暴击伤害提升2%，最高可提升50%暴击伤害。
·奥古斯塔施放重击·烁雷·旋切、重击·烁雷·升拳时，可以获得2层【以众愿为冕】，每1秒仅可通过于耀光中刻名的效果获得2层【以众愿为冕】。
·施放重击·烁雷·旋切、重击·烁雷·升拳过程中，会在原地额外引发【怒霆】，造成两次奥古斯塔攻击100%的导电伤害，此次伤害为重击伤害。`,
  },
]);

// 纪事内容
const items = [
  {
    id: "1",
    title: "低语",
    content: `“啪！”

随着手中的剑被应声击飞，女孩的意识也被击坠至一片混沌之中。

燥热的四肢愈发变得没有知觉，紧绷的神经一根根崩开了弦，浸入冰冷的黑暗里。

她记不清自己已经被击败了多少次，她不知道自己还要挑战多少次。

恐惧从她的心底里蔓延出来，像一颗正在抽丝的茧，温柔地包裹住她正在崩溃的意志。

她很害怕，害怕没有回头路的自己倒在了什么都还没开始的地方。

“接纳这份情绪，奥古斯塔……”

这时，那个声音在她的耳边响起。

仿佛亘古的黑暗中，燃起了一簇孤明的光火。

“学会恐惧，学会害怕，这是你的第一堂课……”

“学会接受自己的弱小，只有明白何为弱小，才能知晓何为强大……”

“只有体会过弱者的滋味，你才会明白力量的可贵……”

“荣光之路并非为你铺设，但对于真正走完那条路的人，无人会在意他是否为冒名顶替者。”

“怀揣成为英雄的愿望，便拥有成为英雄的资格……”

“踏上那条路吧，奥古斯塔……你别无选择，也无需选择……”

“别做趋光的飞蛾，做那轮无人敢直视的烈阳。”

“为此，站起来，奥古斯塔。”

低语熔毁了那层包裹她的外壳，将她再度曝露在那冰冷的黑暗之下。

冰冷刺激着她的意志，随后……她站了起来。

她踏着一瘸一拐的步伐，拾起掉落在地上的剑。

接着，再一次——她向那位名叫卡托的角斗士发起挑战。

那之后——

她用自己的第一次胜利，开启了行尽荣光之路的旅程。`,
  },
  {
    id: "2",
    title: "强者的权利",
    content: `对峙、观察、挥剑，随后便是宣判、掌声与喝彩。

她无视那些炽热的目光，头也不回地转身离开。

不知从何时起，对于这样轻而易举就能取得的胜利，奥古斯塔已经失去了热情。

她渴求能够打磨自己的砥石，但七丘之内，渐渐已找不到这样的对手。

“不够……还远远不够……”

“两招瓦解攻势，一招破除防御，最后一招定下胜负。”

“这种程度的对手，原本只需四招就能制敌……”

休息室内，奥古斯塔反省着自己战斗中的不足。

“不必着急，奥古斯塔……”

“你已经具备了一名强者该有的心态，这很好……”

“从夹缝中寻找胜机，那是属于弱者的战斗方式，而对于强者而言，胜利绝非追求的终点。”

一如既往地，低语自奥古斯塔的耳边响起。

它仿佛一名循循善诱的导师，一位严厉而不失温柔的长辈。它总在奥古斯塔最需要的时候出现，给予她教诲与箴言。

“强者……吗？”奥古斯塔攥紧剑柄，语气中带着一丝不确定。

“我真的……已经成为了一名强者……？”

“毋庸置疑，奥古斯塔。如今的你，已经不再是那个弱小的女孩了。”

“榨干弱者身上的价值，让更强者成为你的养料……”

“你会踩着由他们垒砌而成的长阶，登上属于你的王座……”

“……！”

像是被一道寒刺扎入脊髓，奥古斯塔猛地睁开眼。

“怎么了，奥古斯塔？”

“没什么……我只是……”奥古斯塔捂着自己的脸，皱起眉头，似乎在回忆什么。

“我只是记不起……今天对手的样子了……”

 

数日之后，奥古斯塔收到了一份邀请。这份邀请来自于地下竞技场，原本只是作为角斗士出场的奥古斯塔，如今却被奉为了能和那些看客老爷们同席的座上宾。

“接受这份邀请吧，奥古斯塔，你需要开拓自己的视野，唯有走出那座小小的铁笼，你才有可能站在七丘之巅。”

本想拒绝的奥古斯塔终究还是听从了低语的指引，她坐在自己不习惯的柔软席位上，说着自己不习惯的用语应对上流人士们的寒暄。她感到坐如针毡，只得把注意力投射在下方的竞技场内。

也就在此时，奥古斯塔注意到竞技场的铁栏之后，角斗士的数量已经远超一场角斗赛的规格。

“奥古斯塔，我们竞技场最耀眼的明星！”坐在她身旁的贵族开口了，“所有人都期待着有一名更具资质的挑战者能站在你面前，可惜的是，短时间内，我们恐怕找不到合适的人选了。”

“为此，我们才举办了这次战斗盛典！一场此前从未有过的崭新赛事，一场没有限制、只决生死的大混战！”

一股异样的感觉钻破奥古斯塔的心房，混入她的血液之中。

“看啊奥古斯塔，那些等候入场的角斗士们，他们都是你的手下败将。”

“我们会给予这些失败者第二次机会，让他们再度争夺挑战你的资格。”

“而那个资格，只属于最后一个活着站在这座竞技场上的人。”

奥古斯塔的脑袋嗡嗡作响，她能听到血液正在撞击自己的鼓膜。

“驻目欣赏吧，奥古斯塔……”低语在她的耳畔盘旋。

“欣赏这场为你准备的盛宴，这是你作为强者才能拥有的权利……”

“强者的……权利……”

低语的话语与奥古斯塔的喃喃撞击在一起，如同两颗燧石擦出刺眼的火花。

火花点燃了奥古斯塔的血液，点燃了她一直以来的困惑与思考。

“不必那么麻烦……”

声痕自奥古斯塔手背上亮起，伴随着破风的响声，佩剑旋转着飞来，落入奥古斯塔的手中。

在贵族们的惊愕中，她纵身一跃，落入竞技场的中央。

“想要挑战我，不需要什么所谓的「资格」！”她将剑砸入地面，以所有人都能听到的声量高呼道。

“倘若你们怀揣着共同的愿望，那就把手中的武器，指向你们此时此刻最想指向的人吧！”

随着她话音落下，铁栏缓缓打开，角斗士们陆续入场，将她一圈又一圈地包围起来。

那一瞬间，无数的记忆涌入奥古斯塔的脑海之中。她环顾四周，在那近百双虎视眈眈的眼睛中，她找不到一个陌生的眼神。

她记得他们的名字，记得他们的招式，记得他们的长处，也记得他们的弱点。

她等在那里，静候属于他们的冲锋号响起。

 

那一天，她成了竞技场上最后站着的人，却没有取任何一人的性命。

那一天，她听见无数嘈杂的声音，却唯没有听见那道低语。`,
  },
  {
    id: "3",
    title: "“无瑕”的英雄",
    content: `“他是谁？”

“别开玩笑了，那可是马格诺总督！哪有七丘人不认识他的？”

“总督……”

街角的阴影下，奥古斯塔咬下最后一口干面包，遥遥望向那个正在广场上发表宣讲的高大身影。那人约莫三十岁出头的年纪，他的面容硬朗，如同雕像般线条分明，却带着温和开朗的笑意。宣讲至高潮时，他敞开双臂，民众欢呼的热浪一阵高过一阵。

公开角斗赛未尝一败的绝对王者，不世出的天才角斗士。曾在桑古伊斯狩原斩杀七只蚀脊龙，浴“龙血”而生还，而被冠以「灭龙」的称谓——彼时，七丘还流行着这样的传说。

那是一个不会拒绝民众愿望的倾听者，一个没有私欲的执行者，他是七丘众望所归的总督，同时也是当今世代最符合「英雄王」预言的人选。

曾被奥古斯塔只当成一个遥不可及的愿望而憧憬着的「英雄王」，这是她第一次发现，现实中居然有如此接近那张王座的存在。

奥古斯塔的心中燃起一阵烈火。那些看起来不可思议的事迹，那些振奋人心的传说，在她所诞生的时代里，仍有人能亲身完成——这意味着她的梦想不是一个虚假的白日梦，而是切实能够达成的目标。

可随即，她的思绪渐渐冷却下来，她注视着那个男人的面庞，凝视着那副没有破绽与瑕疵的笑容——

“为什么连这样的人……也没能救下法比亚纳……”

 

很快，奥古斯塔带着这些困惑与思考，站到了那个男人的面前。

“恭喜你，获得亚狮诺索认可的年轻人。你将加冕为新的「冠军」。”

授勋台上，奥古斯塔站在马格诺面前，在等待马格诺为她佩戴勋章的期间，她透过那张努力保持笑容的面孔，看到了一双疲惫而浑浊的眼睛。

那与她想象中的英雄相去甚远，那名被誉为「灭龙」的勇士，瞳孔中的心火已经归于沉寂。

奥古斯塔安静地接受了马格诺的授勋，直到最后，她才以唯有马格诺能听见的声音低语——

“那些关于你的传说，到底是真的吗？”

回应她的仍是沉默的笑容。

 

一段时间过后，地下角斗赛上出现了一个没有名字的角斗士。他戴着遮掩面庞的兜鍪，身披漆黑的甲胄，他如同求死般只挑战最强大的对手，他战斗的方式无所不用其极，毫无节制与尊严可言，仿佛他身处的不是追求荣誉的角斗场，而是只言生死的狩猎之地。

「无名」的胜场迅速累积，很快引起了奥古斯塔的注意。哪怕已经加冕为「冠军」，奥古斯塔仍接受了「无名」的挑战。

然而就在剑戟相交的一瞬间，奥古斯塔便认出了「无名」的真实身份。厚重的面甲可以掩饰容貌，但没能藏住那对疲惫而浑浊的眼睛。

奥古斯塔并不明白，为何那位高高在上的总督，那个早已不需要胜利与荣誉去证明自己的英雄，不惜隐藏身份也要来到地下，参加这种阴暗角落中的铁笼之斗。但奥古斯塔此刻抛去了这些疑问，她所想的唯有如何战胜眼前这名强大的对手。

两柄剑刃仿佛在永无止境地相互碰撞，为了打破这一僵局，「无名」手上的剑开始有电光弹跳，奔走的电弧化作绯红的霓裳，缠绕于「无名」的剑身。雷霆化作利刃，这是他倾注一切的必胜一击。

雷光炸裂的那一瞬间，奥古斯塔仿佛看到了传说的影子，她似乎看到一名勇者立于桑古伊斯狩原，高举利剑，苍红的雷霆贯穿阴云，为他身后的战士们带来胜利的希望。

可紧接着，奥古斯塔手背上的声痕也刺眼地亮起，她当然无法像「无名」那样制造出璀璨的雷霆，她的共鸣能力比起对方而言可谓微不足道。

但就是这看似微不足道的阻力，偏转了一丝雷霆的方向。

奥古斯塔抓住了这一转瞬即逝的胜机，她竭尽全力，挥出最后一剑。

那一天过后，「无名」的身影在地下角斗场彻底消失，人们只知道这是奥古斯塔的又一场胜利，却无人知晓传说已经悄然更迭。

 

不久后，一个寻常日子里，奥古斯塔收到了一封亲笔信，那是来自总督宫的邀请。`,
  },
  {
    id: "4",
    title: "荆棘王座",
    content: `“在你问出许多个‘为什么’之前，请让我先确认一件事吧。”

“你……是不是出身法比亚纳？”

“没错。”

“果然……没想到，来自法比亚纳的遗孤，会成为七丘的「冠军」……”

“你很惊讶？”

“不，我很……遗憾……”

 

总督宫的招待室内，马格诺褪去了他那标志性的笑容。明明相差不过十数岁年纪，可与朝气蓬发的奥古斯塔相比，他的神态却与行将就木的老人无异。

“……那一剑，很漂亮。我想即便是年轻的我，恐怕也依旧会败下阵来。”没来由的，马格诺提起了地下角斗场的那次交锋。

“为什么……？明明大家都称你为「英雄」。”奥古斯塔不禁发问，“但我却只能从你身上看到……自暴自弃。”

“我或许是一名合格的「英雄」，但我却不是一名合格的「总督」。”

“作为「英雄」，我能满足十人的愿望，能满足百人、千人的愿望，可作为「总督」，我却无法为七丘实现任何愿景。”

“明明站在七丘之巅，你却要说自己毫无力量吗？”

“我并非是在为自己开脱，不如说，在接过这份职责之前，我也曾有驾驭万千愿望的信心。”

“可我能欺骗自己，却欺骗不了事实本身。年轻人，我其实早就认出了你，从你被带来七丘的第一天，我就知道你是法比亚纳唯一的幸存者。”

你的存在就像一柄悬在我心头的尖刀，在你成为「冠军」的那一天，这柄尖刀终于刺进了我的心里。我无法再逃避自己过去犯下的错误——我对法比亚纳的惨剧无动于衷，只为了保住这份虚荣的头衔。”

“你和我说这些，是因为心怀愧疚？”

“或许吧……但或许，我心中还藏有一份希望。”马格诺起身，从桌底的储藏柜中取出一只玻璃杯。

“冠冕赐予了我莫大的权力，同时也将我转变为一个平庸的恶人。我不再是配得上七丘的那名英雄。”马格诺捏着空荡荡的玻璃杯，向奥古斯塔致意，“戴上这枚冠冕吧，奥古斯塔，你已经击败了所有看得见的对手，接下来，你该去面对那股看不见的力量了。”

“你对我的信心从何而来，只因我打败了你？”

“不，绝非如此浅显的理由。”马格诺摇摇头，“是因为我听见了你的名字，从七丘之巅至七丘之底，从荣光的殿堂至简陋的街巷。无关贫富、无关强弱、无关阶级与立场，无数人因一个名字联系在一起。我想，在未来，这份联系将成为七丘新的力量。”

“我用自己的剑确认了这个名字的重量，这是我作为总督所能做到的……最后一件事。”

“纵使尸骨化为余薪，也不要安栖于虚假的良夜。”透过玻璃杯，马格诺的眼睛似乎有那么一瞬重新变得明亮。

 

那一天，深夜。

负责打扫的佣人发现马格诺坐在总督宫的主座之上，他面色苍白，嘴唇发紫，明显已经毒发身亡。破碎的玻璃杯中洒出透明的琼浆，一直流至台阶之下。

有人说，那是政敌为了夺权而谋划的刺杀。

有人说，那是元老院所赐的致命佳酿。

而更多的人说，如今的七丘需要一名新的「英雄」。

如同马格诺所预言的那样，渐渐地，奥古斯塔这个名字像风一般在七丘的大地上飘散开来。

春去秋至，总督宫的主座迎来了它新的主人。

奥古斯塔最终站到了她曾经需要仰望的那个位置上。她凝视着眼前这尊吞噬了无数英雄的荆棘王座，她仿佛能想象那天夜里，马格诺向着未来终有一天会抵达此处的她隔空碰杯，随后将杯中的毒药一饮而尽。

奥古斯塔心中并无多少复杂的思绪。她不曾对任何人心怀恨意，她亲身领略过黑暗，却也知晓何为光明。

她的想法很简单——

超越了所有英雄的，才得以被称为「英雄王」。

王座上的荆棘，不过是需要跨越的众多试炼之一。

她坐到了那张主座之上，亲手为自己戴上枷锁与荣冠。

“奥古斯塔总督，有来自元老院的通知，元老们想邀请新上任的总督……商议要事。”台阶下，传令官向奥古斯塔汇报道。

“好啊。”奥古斯塔微笑。

她迫不及待地想去会会这群看不见的「对手」。

“带路吧。”`,
  },
  {
    id: "5",
    title: "某一日，在角斗场……",
    content: `对于奥古斯塔而言，作为「英雄王」的日常，相较于之前并未发生多大的改变。

短暂的盛宴结束后，该处理的文书工作一点也没有变少。胜利的悸动持续再久，最终还是会被生活的琐碎冲散。

奥古斯塔并不厌烦这样平淡的日子，角斗赛仍如火如荼地召开，无论是在什么时代，七丘总是一个如火般热情的国度。

一切都在往更好的趋势发展，所有人都在向未来前进。

可即便如此，奥古斯塔仍有一个小小的困扰。

身为七丘的总督，她自然已做好了为七丘勾勒出一副光明愿景的准备。可作为奥古斯塔，她却在踌躇尾声之后的那个注脚。

从童年走至现在的荣光之路，她已经站在了那条路的终点上。

她实现了古老的预言，成为了自己所憧憬的「英雄王」。

她遇到了命中注定的同伴，跨越了曾以为不可能跨越的障壁。

若是在后世流传的故事里，或许这便是「英雄王」奥古斯塔的结局。

一个完美的结局，一个任谁都不会有怨言的终点。

可人生不是戏剧，不会在高潮结束后就立即谢幕。

她必须思考，她想要思考——

等到七丘不再需要奥古斯塔的时候，等到这片土地开始孕育新的「传说」——

在这个故事彻底结束后，她还能成为什么呢？

带着这些烦恼，奥古斯塔悄悄地离开了总督宫。

她不刻意选择自己的路线，任凭直觉牵引自己的步伐。

踱步途中，她仍在思考——

追求更强大的力量？挑战更棘手的强敌？去向更为广阔的天地，见证与七丘截然不同的风貌？还是等一切安定之后卸甲归田，享受安稳的幸福？

太多太多的可能性，太多太多的道路可供她选择。

等奥古斯塔回过神来时，她已身处那座满载记忆的角斗场。

今天是角斗赛的休息日，角斗场内罕见地空无一人。

不，并非空无一人。

像是彼此有着无声的默契似的，还有一个人闲步至此。

【TA】和奥古斯塔对上了视线，心有灵犀地相视一笑。

那一瞬间，所有烦恼似乎都抛诸奥古斯塔的脑后。

她确实还没有属于自己的答案，但是，她并非没有时间去思考那个答案。

现在烦恼这些……似乎还太早了。

“好久没有活动筋骨了……”

“怎么样，我的挚友——”

“来久违地较量一场吗！？”`,
  },
];

const current = ref(0);

// 浮动元素
const floatingElements = ref([
  { symbol: "⚡", top: 100, left: 50, delay: 0 },
  { symbol: "🛡️", top: 300, left: 85, delay: 1.2 },
  { symbol: "👑", top: 200, left: 90, delay: 2.4 },
  { symbol: "⚔️", top: 400, left: 30, delay: 0.8 },
  { symbol: "🔥", top: 150, left: 70, delay: 1.6 },
]);

const reducedMotion =
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function select(index) {
  current.value = index;
}

const storyRef = ref<HTMLElement | null>(null);

function prev() {
  current.value = (current.value - 1 + items.length) % items.length;
  select(current.value);
  if (storyRef.value) {
    storyRef.value.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function next() {
  current.value = (current.value + 1) % items.length;
  select(current.value);
  if (storyRef.value) {
    storyRef.value.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
interface Chibi {
  src: string;
  top: number;
  left: number;
}

const chibiList = ref<Chibi[]>([]);

onMounted(async () => {
  if (!reducedMotion) {
    // 初始动画
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".avatar-card", {
      duration: 0.8,
      y: 18,
      opacity: 0,
      scale: 0.99,
    }).from(
      ".right-col > .hero-panel .name",
      { duration: 0.9, x: 24, opacity: 0 },
      "-=0.45"
    );

    // 时间线动画
    gsap.utils.toArray(".tl-item").forEach((it: any, idx: number) => {
      gsap.from(it.querySelector(".tl-card"), {
        scrollTrigger: {
          trigger: it,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 22,
        duration: 0.7,
        delay: idx * 0.06,
      });
    });

    // 共鸣链动画
    gsap.utils.toArray(".chain-card").forEach((card: any, idx: number) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        x: idx % 2 === 0 ? -30 : 30,
        duration: 0.8,
        delay: idx * 0.1,
      });
    });

    // 浮动头像动画
    gsap.to(".avatar-card", {
      scale: 1.007,
      duration: 2.8,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });
  } else {
    document.documentElement.classList.add("reduced-motion");
  }

  // 1. 基础配置信息
  const total = 10;
  let pickCount = 3; // 每次抽取 3 张
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const isMobile = window.innerWidth <= 768;
  // 如果已知单张小人图片的宽高，可避免超出边界；
  // 假设小人图片宽 100px、高 100px，按需替换：
  const imgWidth = 100;
  const imgHeight = 100;

  // 2. Fisher–Yates 洗牌函数
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // 3. 随机选出 3 个编号
  const nums = shuffle(Array.from({ length: total }, (_, k) => k + 1));
  if (isMobile) {
    pickCount = 1;
  }
  const picks = nums.slice(0, pickCount);

  // 4. 生成随机位置并填充 chibiList
  chibiList.value = []; // 先清空
  picks.forEach((i) => {
    chibiList.value.push({
      src: `/QImages/1 (${i}).png`,
      left: Math.random() * (vw - imgWidth), // 保证不超出左右边界
      top: Math.random() * (vh - imgHeight), // 保证不超出上下边界
    });
  });

  // 2. 等 img 渲染到 DOM
  await nextTick();

  // 3. 给每个小人绑定 GSAP 动画
  const imgs = document.querySelectorAll<HTMLImageElement>(".chibi-img");
  imgs.forEach((img, index) => {
    const padding = 200; // 边缘预留空间
    // ✅ 初始出场动画（闪现）
    gsap.fromTo(
      img,
      { opacity: 0, scale: 0.5 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "back.out(2)",
        delay: 0.2 * index,
      }
    );

    // ✅ 鼠标靠近闪避
    img.addEventListener("mouseenter", () => {
      gsap.killTweensOf(img);

      gsap.to(img, {
        x: "+=" + ((Math.random() - 0.5) * 400).toFixed(0),
        y: "+=" + ((Math.random() - 0.5) * 400).toFixed(0),
        duration: 1.2,
        ease: "back.out(2)",
        onComplete: () => {
          // 闪避完成后，再重新启用动画
          animate(img);
        },
      });
    });

    const animate = (img: HTMLImageElement) => {
      let { x, y } = img.getBoundingClientRect();
      let deltaX = (Math.random() - 0.5) * 200;
      let deltaY = (Math.random() - 0.5) * 200;

      // 预测一下偏移后的位置
      let nextX = x + deltaX;
      let nextY = y + deltaY;

      // 校正：防漂出左、右、上、下边界
      if (nextX < padding) deltaX = padding - x;
      if (nextX + img.width > window.innerWidth - padding)
        deltaX = window.innerWidth - padding - (x + img.width);
      if (nextY < padding) deltaY = padding - y;
      if (nextY + img.height > window.innerHeight - padding)
        deltaY = window.innerHeight - padding - (y + img.height);

      gsap.to(img, {
        x: `+=${deltaX.toFixed(0)}`,
        y: `+=${deltaY.toFixed(0)}`,
        rotation: `+=${((Math.random() - 0.5) * 60).toFixed(0)}`,
        duration: 2 + Math.random() * 2,
        ease: "power1.inOut",
        onComplete: () => animate(img),
      });
    };
    animate(img);
  });
});
</script>

<style scoped lang="scss">
/* 奥古斯塔主题色板 */
$color-deep-night: #060408; // 主背景：深空夜色
$color-metal-dark: #1a0e14; // 金属暗部
$color-primary-glow: #c64830; // 主辉光 - 暗紫/赤金
$color-secondary-glow: #ffd460; // 次辉光 - 灼金高光
$color-blood-shadow: #8b001a; // 血影深红
$color-text-primary: #fff7ef; // 主文字
$color-text-secondary: #e1d7bd; // 副文字
$color-border-glow: rgba(198, 72, 48, 0.4); // 边框辉光
.floating-chibis {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 99;
}

.chibi-img {
  position: absolute;
  width: 80px;
  user-select: none;
  transform-origin: center center;
  pointer-events: auto;
  z-index: 10;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
}
.augusta-page {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(
    180deg,
    $color-deep-night 0%,
    $color-metal-dark 100%
  );
  font-family: "Noto Sans SC", system-ui, -apple-system, "Segoe UI", Roboto,
    Arial;
  color: $color-text-primary;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: clamp(20px, 4vw, 40px);
  box-sizing: border-box;
  padding-top: 60px;
  overflow-x: hidden;

  &.reduced-motion * {
    transition: none !important;
    animation: none !important;
  }

  .container {
    position: relative;
    z-index: 10;
    max-width: 1200px;
    margin: 0 auto;
    padding: clamp(12px, 2vw, 24px);
  }
}

/* ========== HERO 区域 ========== */
.hero {
  position: relative;
  display: grid;
  grid-template-columns: 500px 1fr;
  gap: 32px;
  align-items: start;
  padding: 20px;
  margin-bottom: 40px;
  border-radius: 20px;
  background: linear-gradient(
    135deg,
    rgba($color-metal-dark, 0.8) 0%,
    rgba($color-deep-night, 0.9) 100%
  );
  border: 1px solid $color-border-glow;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8),
    0 0 40px rgba($color-primary-glow, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      transparent 0%,
      rgba($color-primary-glow, 0.03) 50%,
      transparent 100%
    );
    border-radius: 20px;
    pointer-events: none;
  }

  .left-col {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .avatar-card {
    background: linear-gradient(
      135deg,
      rgba($color-metal-dark, 0.9) 0%,
      rgba($color-deep-night, 0.95) 100%
    );
    border-radius: 20px;
    padding: 20px;
    display: grid;
    justify-items: center;
    gap: 16px;
    border: 1px solid $color-border-glow;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6),
      0 0 30px rgba($color-primary-glow, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    width: 100%;
    position: relative;
    overflow: hidden;

    &::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(
        45deg,
        transparent 30%,
        rgba($color-secondary-glow, 0.05) 50%,
        transparent 70%
      );
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover {
      transform: translateY(-5px) scale(1.02);
      box-shadow: 0 30px 70px rgba(0, 0, 0, 0.7),
        0 0 50px rgba($color-primary-glow, 0.25),
        inset 0 1px 0 rgba(255, 255, 255, 0.15);

      &::after {
        opacity: 1;
      }

      .avatar {
        transform: scale(1.05);
        filter: saturate(1.2) brightness(1.1);
      }
    }
  }

  .avatar-wrap {
    width: 100%;
    display: block;
    position: relative;
    overflow: hidden;
    border-radius: 16px;
  }

  .avatar {
    width: 100%;
    height: auto;
    border-radius: 16px;
    display: block;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5),
      0 0 25px rgba($color-primary-glow, 0.1);
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    background-color: rgba(0, 0, 0, 0.04);
    filter: saturate(0.9) contrast(1.05) brightness(0.95);
  }

  .avatar-meta {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    width: 100%;
  }

  .avatar-badge {
    font-size: 0.85rem;
    color: $color-text-secondary;
    background: linear-gradient(
      90deg,
      rgba($color-primary-glow, 0.15) 0%,
      rgba($color-metal-dark, 0.5) 100%
    );
    padding: 8px 16px;
    border-radius: 20px;
    border: 1px solid rgba($color-primary-glow, 0.2);
    font-weight: 600;
    text-align: center;
    width: 100%;
    transition: all 0.3s ease;

    &:hover {
      background: linear-gradient(
        90deg,
        rgba($color-primary-glow, 0.25) 0%,
        rgba($color-metal-dark, 0.6) 100%
      );
      border-color: rgba($color-primary-glow, 0.4);
      transform: translateX(4px);
    }
  }

  .right-col {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .hero-panel {
    position: relative;
    padding: 30px;
    border-radius: 18px;
    background: linear-gradient(
      135deg,
      rgba($color-metal-dark, 0.7) 0%,
      rgba($color-deep-night, 0.8) 100%
    );
    backdrop-filter: blur(10px);
    border: 1px solid rgba($color-primary-glow, 0.1);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }

  .name {
    font-size: clamp(2.2rem, 4vw, 3.2rem);
    margin: 0 0 10px 0;
    font-weight: 900;
    letter-spacing: 1px;
    line-height: 1.1;
    background: linear-gradient(
      135deg,
      $color-primary-glow 0%,
      $color-secondary-glow 50%,
      $color-primary-glow 100%
    );
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    position: relative;
    text-shadow: 0 10px 30px rgba($color-primary-glow, 0.3);

    &::after {
      content: "";
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 120px;
      height: 3px;
      background: linear-gradient(90deg, $color-primary-glow, transparent);
      border-radius: 2px;
    }
  }

  .jp {
    font-size: 1.1rem;
    color: $color-secondary-glow;
    margin-left: 12px;
    font-weight: 400;
    opacity: 0.9;
  }

  .subtitle {
    margin: 15px 0 0;
    font-size: 1.3rem;
    color: $color-secondary-glow;
    font-weight: 600;
    line-height: 1.4;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  }

  .lead {
    margin: 20px 0 0;
    color: $color-text-secondary;
    opacity: 0.96;
    line-height: 1.8;
    max-width: 72ch;
    font-size: 1.05rem;
  }

  .hero-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 25px;
    padding-top: 20px;
    border-top: 1px solid rgba($color-primary-glow, 0.1);
  }

  .tag {
    font-size: 0.9rem;
    color: $color-text-secondary;
    background: rgba($color-primary-glow, 0.1);
    padding: 6px 12px;
    border-radius: 15px;
    border: 1px solid rgba($color-primary-glow, 0.2);
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover {
      background: rgba($color-primary-glow, 0.2);
      border-color: rgba($color-primary-glow, 0.4);
      transform: translateY(-2px);
    }
  }
}

/* ========== 通用卡片样式 ========== */
.card {
  margin-top: 30px;
  background: linear-gradient(
    135deg,
    rgba($color-metal-dark, 0.7) 0%,
    rgba($color-deep-night, 0.8) 100%
  );
  border-radius: 18px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6),
    0 0 30px rgba($color-primary-glow, 0.1);
  backdrop-filter: blur(10px);
  color: $color-text-primary;
  border: 1px solid rgba($color-primary-glow, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      transparent 0%,
      rgba($color-primary-glow, 0.03) 50%,
      transparent 100%
    );
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.7),
      0 0 50px rgba($color-primary-glow, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
    border-color: rgba($color-primary-glow, 0.2);

    .card-head h2 {
      &::after {
        width: 100px;
      }
    }
  }

  .card-head {
    margin-bottom: 28px;
    position: relative;

    h2 {
      margin: 0;
      font-size: 1.8rem;
      color: $color-secondary-glow;
      font-weight: 700;
      display: inline-block;
      position: relative;

      &::after {
        content: "";
        position: absolute;
        bottom: -10px;
        left: 0;
        width: 60px;
        height: 3px;
        background: linear-gradient(90deg, $color-primary-glow, transparent);
        border-radius: 2px;
        transition: width 0.4s ease;
      }
    }

    h3 {
      margin: 0;
      font-size: 1.4rem;
      color: $color-secondary-glow;
      font-weight: 600;
    }
  }
}

/* ========== 双栏布局 ========== */
.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-top: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}

.text-block {
  line-height: 1.8;
  color: $color-text-secondary;

  p {
    margin: 0 0 20px 0;

    &:last-child {
      margin-bottom: 0;
    }
  }

  strong {
    color: $color-secondary-glow;
    font-weight: 600;
  }
}

/* ========== 象征物品区域 ========== */
.special-section {
  .item-section {
    margin-bottom: 40px;
    padding-bottom: 40px;
    border-bottom: 1px solid rgba($color-primary-glow, 0.1);

    &:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }

    .content {
      display: grid;
      grid-template-columns: 240px 1fr;
      gap: 40px;
      margin-top: 20px;
      align-items: start;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 30px;
      }
    }

    .img-area {
      position: relative;
      overflow: hidden;
      border-radius: 16px;
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5),
        0 0 25px rgba($color-primary-glow, 0.1);
      border: 1px solid rgba($color-primary-glow, 0.1);
      transition: all 0.4s ease;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.6),
          0 0 40px rgba($color-primary-glow, 0.2);

        img {
          transform: scale(1.05);
        }
      }

      img {
        width: 100%;
        height: auto;
        display: block;
        transition: transform 0.6s ease;
      }
    }
  }
}

/* ========== 剧情时间线 ========== */
.timeline {
  .tl-wrap {
    position: relative;
    padding: 30px 20px;
  }

  .vl {
    position: absolute;
    left: 30px;
    top: 50px;
    bottom: 50px;
    width: 4px;
    background: linear-gradient(
      180deg,
      $color-primary-glow 0%,
      rgba($color-primary-glow, 0.3) 50%,
      transparent 100%
    );
    border-radius: 2px;
    box-shadow: 0 0 20px rgba($color-primary-glow, 0.3);

    @media (max-width: 768px) {
      display: none;
    }
  }

  .tl-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .tl-item {
    position: relative;
    margin: 40px 0;
    padding-left: 80px;

    @media (max-width: 768px) {
      padding-left: 0;
    }

    &::before {
      content: "";
      position: absolute;
      left: 26px;
      top: 10px;
      width: 12px;
      height: 12px;
      background: $color-secondary-glow;
      border-radius: 50%;
      box-shadow: 0 0 20px rgba($color-secondary-glow, 0.5);
      z-index: 2;

      @media (max-width: 768px) {
        display: none;
      }
    }
  }

  .tl-card {
    background: linear-gradient(
      135deg,
      rgba($color-metal-dark, 0.8) 0%,
      rgba($color-deep-night, 0.9) 100%
    );
    border-radius: 16px;
    padding: 24px 30px;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5),
      0 0 25px rgba($color-primary-glow, 0.1);
    border: 1px solid rgba($color-primary-glow, 0.1);
    transition: all 0.4s ease;
    position: relative;
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 4px;
      background: linear-gradient(
        180deg,
        $color-primary-glow,
        $color-secondary-glow
      );
    }

    &:hover {
      transform: translateX(10px);
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.6),
        0 0 40px rgba($color-primary-glow, 0.2);
    }
  }

  .tl-title {
    margin: 0 0 12px 0;
    font-size: 1.3rem;
    color: $color-secondary-glow;
    font-weight: 700;
  }

  .tl-desc {
    margin: 0;
    color: $color-text-secondary;
    line-height: 1.7;
  }
}

/* ========== 共鸣链区域 ========== */
.resonance-chain {
  .chain-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 24px;
    margin-top: 20px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .chain-card {
    background: linear-gradient(
      135deg,
      rgba($color-metal-dark, 0.8) 0%,
      rgba($color-deep-night, 0.9) 100%
    );
    border-radius: 16px;
    padding: 24px;
    border: 1px solid rgba($color-primary-glow, 0.1);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5),
      0 0 25px rgba($color-primary-glow, 0.1);
    transition: all 0.4s ease;
    position: relative;
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(
        135deg,
        rgba($color-primary-glow, 0.05) 0%,
        transparent 50%,
        rgba($color-secondary-glow, 0.05) 100%
      );
      opacity: 0;
      transition: opacity 0.4s ease;
    }

    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.6),
        0 0 40px rgba($color-primary-glow, 0.2);
      border-color: rgba($color-primary-glow, 0.3);

      &::before {
        opacity: 1;
      }
    }

    &.chain-1 {
      border-top: 3px solid $color-primary-glow;
    }
    &.chain-2 {
      border-top: 3px solid $color-secondary-glow;
    }
    &.chain-3 {
      border-top: 3px solid $color-blood-shadow;
    }
    &.chain-4 {
      border-top: 3px solid #ff9a3c;
    }
    &.chain-5 {
      border-top: 3px solid #6a0572;
    }
    &.chain-6 {
      border-top: 3px solid #00b4d8;
    }
  }

  .chain-header {
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .chain-number {
    font-size: 0.9rem;
    color: $color-secondary-glow;
    background: rgba($color-primary-glow, 0.15);
    padding: 4px 12px;
    border-radius: 20px;
    font-weight: 600;
  }

  .chain-title {
    margin: 0;
    font-size: 1.2rem;
    color: $color-text-primary;
    font-weight: 600;
  }

  .chain-content {
    p {
      margin: 0;
      color: $color-text-secondary;
      line-height: 1.7;
      font-size: 0.95rem;
      white-space: pre-wrap;
    }
  }
}

/* ========== 故事纪事区域 ========== */
.ll-stories {
  .card {
    border-radius: 18px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6),
      inset 0 1px 0 rgba($color-primary-glow, 0.05);
    color: $color-text-primary;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background: linear-gradient(
      135deg,
      rgba($color-metal-dark, 0.8) 0%,
      rgba($color-deep-night, 0.9) 100%
    );
    border: 1px solid rgba($color-primary-glow, 0.1);
  }

  .card-head {
    padding: 24px 30px;
    border-bottom: 1px solid rgba($color-primary-glow, 0.1);
    background: linear-gradient(
      135deg,
      rgba($color-primary-glow, 0.05) 0%,
      transparent 100%
    );

    .card-title {
      font-size: 1.8rem;
      font-weight: 700;
      color: $color-secondary-glow;
      letter-spacing: 0.5px;
      margin: 0;
    }
  }

  .card-body {
    padding: 30px;
    min-height: 400px;
    position: relative;
    background: linear-gradient(
      135deg,
      transparent 0%,
      rgba($color-deep-night, 0.3) 100%
    );
  }

  .story {
    color: $color-text-primary;

    .story-head {
      font-size: 1.5rem;
      color: $color-secondary-glow;
      font-weight: 700;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid rgba($color-primary-glow, 0.1);
    }

    .story-content {
      line-height: 1.8;
      color: $color-text-secondary;
      font-size: 1.05rem;

      white-space: pre-wrap;
    }
  }

  .card-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 20px 30px;
    border-top: 1px solid rgba($color-primary-glow, 0.1);
    background: linear-gradient(
      135deg,
      transparent 0%,
      rgba($color-metal-dark, 0.5) 100%
    );

    .nav-btn {
      background: linear-gradient(
        135deg,
        rgba($color-primary-glow, 0.1) 0%,
        rgba($color-metal-dark, 0.5) 100%
      );
      border: 1px solid rgba($color-primary-glow, 0.2);
      color: $color-secondary-glow;
      padding: 12px 24px;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 1.2rem;
      font-weight: 600;
      min-width: 60px;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background: linear-gradient(
          135deg,
          rgba($color-primary-glow, 0.2) 0%,
          rgba($color-metal-dark, 0.6) 100%
        );
        border-color: rgba($color-primary-glow, 0.4);
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba($color-primary-glow, 0.2);
      }

      &:active {
        transform: translateY(0);
      }
    }

    .pager {
      color: $color-text-secondary;
      font-size: 1rem;
      font-weight: 600;
      background: rgba($color-primary-glow, 0.1);
      padding: 8px 20px;
      border-radius: 20px;
      border: 1px solid rgba($color-primary-glow, 0.2);
    }
  }

  /* 切换动画 */
  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition: all 400ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .fade-slide-enter-from {
    opacity: 0;
    transform: translateY(20px);
  }

  .fade-slide-enter-to {
    opacity: 1;
    transform: translateY(0);
  }

  .fade-slide-leave-from {
    opacity: 1;
    transform: translateY(0);
  }

  .fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }
}

/* ========== 浮动元素 ========== */
.floating-elements {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;

  .floating-element {
    position: absolute;
    font-size: 24px;
    opacity: 0.3;
    animation: float 6s ease-in-out infinite;
    filter: drop-shadow(0 0 10px rgba($color-primary-glow, 0.3));

    @media (max-width: 768px) {
      display: none;
    }
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-30px) rotate(10deg);
  }
}

/* ========== 响应式设计 ========== */
@media (max-width: 1024px) {
  .hero {
    grid-template-columns: 240px 1fr;
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .augusta-page {
    padding: 15px;
    padding-top: 40px;
  }

  .hero {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 16px;
    margin-bottom: 30px;
  }

  .avatar-card {
    width: 100%;
    max-width: 280px;
    margin: 0 auto;
  }

  .hero-panel {
    padding: 24px;
  }

  .name {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1.1rem;
  }

  .lead {
    font-size: 1rem;
  }

  .card {
    padding: 24px;
    border-radius: 16px;
    margin-top: 24px;
  }

  .card-head h2 {
    font-size: 1.5rem;
  }

  .timeline {
    .tl-wrap {
      padding: 20px 0;
    }

    .tl-item {
      margin: 30px 0;
      padding-left: 0;
    }

    .tl-card {
      padding: 20px;
    }
  }

  .resonance-chain .chain-grid {
    gap: 20px;
  }

  .ll-stories {
    .card-head {
      padding: 20px;
    }

    .card-body {
      padding: 24px;
      min-height: 300px;
    }

    .card-foot {
      padding: 16px 20px;
    }

    .nav-btn {
      padding: 10px 20px;
      min-width: 50px;
    }
  }
}

@media (max-width: 480px) {
  .hero-panel {
    padding: 20px;
  }

  .name {
    font-size: 1.8rem;
  }

  .card {
    padding: 20px;
  }

  .two-col {
    gap: 24px;
  }

  .special-section .item-section .content {
    gap: 24px;
  }
}
</style>