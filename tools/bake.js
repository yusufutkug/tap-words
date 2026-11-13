#!/usr/bin/env node
// Tap Words — offline tahta üretici (ADR-0005). index.html generator'ının Node kopyası + seed'li RNG.
//
//   node tools/bake.js validate [N]        her test levelı için N üretim; başarısızlık oranı, ortalama deneme
//   node tools/bake.js bake > test-levels.js   test levellarını pre-bake eder (seed'ler sabit; eski leveller birebir aynı kalır)
//   node tools/bake.js check <lists.json> [N]  curve dokümanı için kelime listesi + parametre setini doğrular
//
// Level parametreleri: cols, rows, per, words[],
//   noDiagCross (ops.; true → SE ve SW çaprazlar görsel X yapamaz)
//   rev        (ops.; ters yazım olasılığı 0–1; yoksa eski DIRS dizisi = 0,20)
//   fillMode   (ops.; "freq" TR frekans (varsayılan) | "disjoint" hedefte olmayan harfler | "target" yalnızca hedef harfleri | "bigram" hedef kelimelerin ikili dizileri)
//   diag       (ops.; çapraz eksen olasılığı 0–1; yoksa 0,5 = dört eksen eşit. 0 → yalnızca yatay/dikey, FTUE)

const FILL="AAAAAAAEEEEEEİİİİİNNNNNRRRRLLLLKKKKDDDIIIMMMUUUTTTSSSYYYOOOBBBÜÜŞŞZZGGÇÇHHVVPPÖÖFCĞJ";
const DIRS=[];
[[0,1],[1,0],[1,1],[1,-1]].forEach(d=>{for(let i=0;i<4;i++)DIRS.push(d);DIRS.push([-d[0],-d[1]]);});
const ALL8=[[0,1],[1,0],[1,1],[-1,1],[0,-1],[-1,0],[-1,-1],[1,-1]];

// ---- test levelları (docs/levels/param-tests-v01.md, param-tests-v02.md) ----
// Sıra ve seed mantığı değişmez: T00–T11 2026-11-05 tahtalarıyla birebir aynı üretilir.
const TESTS=[
  {id:"T00",series:"taban",   name:"Okul",      cols:17,rows:18,per:5,words:["KALEM","SİLGİ","KİTAP","TAHTA","SINIF","ÇANTA"]},
  {id:"T01",series:"PER",     name:"Vücut",     cols:17,rows:18,per:2,words:["BURUN","KULAK","BACAK","BOYUN","DUDAK","KALÇA"]},
  {id:"T02",series:"PER",     name:"Deniz",     cols:17,rows:18,per:3,words:["BALIK","DALGA","MARTI","KAYIK","MİDYE","YOSUN"]},
  {id:"T03",series:"PER",     name:"Mobilya",   cols:17,rows:18,per:7,words:["PERDE","LAMBA","DOLAP","TABAK","SEHPA","RANZA"]},
  {id:"T04",series:"uzunluk", name:"Ev",        cols:17,rows:18,per:5,words:["MASA","KAPI","HALI","SOBA","ÇATI","ODUN"]},
  {id:"T05",series:"uzunluk", name:"Hayvanlar", cols:17,rows:18,per:5,words:["KAPLAN","TAVŞAN","KARTAL","MAYMUN","SİNCAP","ZÜRAFA"]},
  {id:"T06",series:"uzunluk", name:"Karışık",   cols:17,rows:18,per:5,words:["TRAKTÖR","GEZEGEN","BAKLAVA","KELEBEK","KARINCA","YUMURTA"]},
  {id:"T07",series:"uzunluk", name:"Mutfak",    cols:17,rows:18,per:5,words:["TAVA","KASE","KAŞIK","ÇATAL","BARDAK","TENCERE"]},
  {id:"T08",series:"board",   name:"Taşıtlar",  cols:17,rows:15,per:5,words:["ARABA","VAPUR","METRO","TAKSİ","MOTOR","ROKET"]},
  {id:"T09",series:"board",   name:"Kuşlar",    cols:17,rows:21,per:5,words:["SERÇE","KARGA","KUMRU","ŞAHİN","TAVUK","HOROZ"]},
  {id:"T10",series:"board",   name:"Doğa",      cols:17,rows:26,per:5,words:["NEHİR","BULUT","ÇAYIR","ORMAN","YAMAÇ","SAHİL"]},
  {id:"T11",series:"kontrol", name:"Giysi",     cols:20,rows:15,per:5,words:["CEKET","ÇORAP","ŞAPKA","KEMER","PALTO","HIRKA"]},
  // ---- v02 (2026-11-11): çapraz kesişme ve K serisi ----
  {id:"T09X",series:"kesişme",name:"Kuşlar",    cols:17,rows:21,per:5,noDiagCross:true,words:["SERÇE","KARGA","KUMRU","ŞAHİN","TAVUK","HOROZ"]},
  {id:"T12",series:"K",       name:"Meyveler",  cols:17,rows:12,per:5,words:["KİRAZ","KAVUN","ARMUT","İNCİR"]},
  {id:"T13",series:"K",       name:"Şehir",     cols:17,rows:24,per:5,words:["SOKAK","CADDE","PAZAR","BANKA","KÖPRÜ","DURAK","FIRIN","HAMAM"]},
  {id:"T14",series:"K",       name:"Yemek",     cols:17,rows:18,per:3,words:["REÇEL","SUCUK","SİMİT","SOSİS","BÖREK","SALAM","PİLAV","ÇORBA","HELVA","LOKUM"]},
  {id:"T15",series:"K",       name:"Karışık",   cols:17,rows:18,per:2,words:["KALEM","BALIK","PERDE","MARTI","LAMBA","DOLAP","KUMRU","HOROZ","ROKET","METRO","TAVUK","KARGA","YOSUN","DALGA","SEHPA"]},
  // ---- v03 (2026-11-13): yeni N gridi 15×21 (ADR-0009); dolgu modu, ters oranı, özel harf ----
  {id:"T00b",series:"taban",  name:"Okul",      cols:15,rows:21,per:5,words:["KALEM","SİLGİ","KİTAP","TAHTA","SINIF","ÇANTA"]},
  {id:"T16",series:"dolgu",   name:"Renkler",   cols:15,rows:21,per:5,fillMode:"disjoint",words:["PEMBE","SİYAH","BEYAZ","YEŞİL","BORDO","KIZIL"]},
  {id:"T17",series:"dolgu",   name:"Meslekler", cols:15,rows:21,per:5,fillMode:"target",  words:["POLİS","ASKER","PİLOT","TERZİ","KASAP","MİMAR"]},
  {id:"T18",series:"dolgu",   name:"Sofra",     cols:15,rows:21,per:5,fillMode:"bigram",  words:["EKMEK","PİLAV","ÇORBA","KAHVE","ŞEKER","LİMON"]},
  {id:"T19",series:"ters",    name:"Hayvanlar", cols:15,rows:21,per:5,rev:0,   words:["ASLAN","YILAN","KOYUN","GEYİK","ZEBRA","TİLKİ"]},
  {id:"T20",series:"ters",    name:"Şehir",     cols:15,rows:21,per:5,rev:0.5, words:["SOKAK","CADDE","PAZAR","BANKA","DURAK","FIRIN"]},
  {id:"T21",series:"özel",    name:"Mobilya",   cols:15,rows:21,per:5,words:["PERDE","LAMBA","DOLAP","TABAK","SEHPA","RANZA"]},
  {id:"T22",series:"özel",    name:"Karışık",   cols:15,rows:21,per:5,words:["ÇİÇEK","GÜNEŞ","KÖPRÜ","ÖRDEK","YÜZÜK","ÇİLEK"]},
];
const SPECIAL=new Set([..."İŞĞÇÖÜ"]);
const AXES=[[0,1],[1,0],[1,1],[1,-1]];

// Dolgu alfabesi (ağırlıklı dizi) — mod'a göre
function fillAlphabet(L){
  const mode=L.fillMode||"freq", tgt=[...L.words.join("")], set=new Set(tgt);
  if(mode==="freq")return [...FILL];
  if(mode==="disjoint"){const a=[...FILL].filter(ch=>!set.has(ch));return a.length?a:[...FILL]}
  return tgt; // "target" ve "bigram": hedef harflerinin hedefteki frekansıyla
}
// Bigram modu: dolgu hücresi, soldaki/üstteki komşuyla hedef kelimelerde geçen bir ikili oluşturacak harf alır (ileri ve ters okunuşlar dahil)
function bigramMap(words){
  const m=new Map();
  for(const w of words){const c=[...w];for(let i=0;i<c.length-1;i++){
    (m.get(c[i])??m.set(c[i],[]).get(c[i])).push(c[i+1]);
    (m.get(c[i+1])??m.set(c[i+1],[]).get(c[i+1])).push(c[i]);}}
  return m;
}

function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}

// Hücre paylaşmayan ama görsel X yapan iki çapraz: (r,c)→(r+1,c+1) ile (r,c+1)→(r+1,c).
// Yerleşim adayının her ardışık hücre çifti için, çaprazlayan karşı köşegen hücrelerinin ikisi de aynı karşı-eğimli çapraz yerleşime aitse X vardır.
function crossesDiag(cells,dr,dc,COLS,owner,placements){
  for(let i=0;i<cells.length-1;i++){
    const a=cells[i], r=Math.floor(a/COLS), c=a%COLS;
    const n1=(r+dr)*COLS+c, n2=r*COLS+(c+dc); // karenin diğer iki köşesi
    const o1=owner[n1], o2=owner[n2];
    if(o1===-1||o1!==o2)continue;
    const od=placements[o1].dir;
    if(od[0]!==0&&od[1]!==0&&od[0]*od[1]!==dr*dc)return true;
  }
  return false;
}

function generate(L,rand){
  const {cols:COLS,rows:ROWS,per:PER,words:WORDS}=L, noX=!!L.noDiagCross;
  const rnd=n=>Math.floor(rand()*n);
  const inb=(r,c)=>r>=0&&r<ROWS&&c>=0&&c<COLS;
  // yön: rev tanımlıysa eksen eşit + ters olasılığı rev; değilse eski 20'lik DIRS dizisi (eski tahtalar birebir korunur)
  const pickDir=()=>{
    if(L.rev===undefined&&L.diag===undefined)return DIRS[rnd(DIRS.length)];
    const rev=L.rev??0.2, [dr,dc]=L.diag===undefined?AXES[rnd(4)]:(rand()<L.diag?AXES[2+rnd(2)]:AXES[rnd(2)]);
    return rand()<rev?[-dr,-dc]:[dr,dc]};
  const ALPHA_F=fillAlphabet(L), BG=L.fillMode==="bigram"?bigramMap(WORDS):null;
  const pickFill=(letters,idx)=>{
    if(BG){const r=Math.floor(idx/COLS),c=idx%COLS,cands=[];
      if(c>0&&letters[idx-1])cands.push(...(BG.get(letters[idx-1])||[]));
      if(r>0&&letters[idx-COLS])cands.push(...(BG.get(letters[idx-COLS])||[]));
      if(cands.length&&rand()<0.8)return cands[rnd(cands.length)];}
    return ALPHA_F[rnd(ALPHA_F.length)];
  };
  for(let attempt=0;attempt<400;attempt++){
    const owner=new Array(ROWS*COLS).fill(-1), letters=new Array(ROWS*COLS).fill(""), placements=[];
    let ok=true;
    const order=WORDS.map((w,i)=>i).sort((a,b)=>[...WORDS[b]].length-[...WORDS[a]].length);
    outer: for(const wi of order){
      const w=[...WORDS[wi]];
      for(let k=0;k<PER;k++){
        let placed=false;
        for(let t=0;t<800&&!placed;t++){
          const [dr,dc]=pickDir();
          const r0=rnd(ROWS),c0=rnd(COLS);
          if(!inb(r0+dr*(w.length-1),c0+dc*(w.length-1)))continue;
          const cells=[];let free=true;
          const diag=dr!==0&&dc!==0;
          for(let i=0;i<w.length;i++){
            const r=r0+dr*i,c=c0+dc*i,idx=r*COLS+c;
            if(owner[idx]!==-1){free=false;break}
            if(diag){
              for(const [pr,pc] of [[dc,-dr],[-dc,dr]]){
                const nr=r+pr,nc=c+pc; if(!inb(nr,nc))continue;
                const o=owner[nr*COLS+nc]; if(o===-1)continue;
                const od=placements[o].dir; if(Math.abs(od[0])===Math.abs(dr)&&Math.abs(od[1])===Math.abs(dc)){free=false;break}
              }
              if(!free)break;
            }
            cells.push(idx);
          }
          if(!free)continue;
          if(noX&&diag&&crossesDiag(cells,dr,dc,COLS,owner,placements))continue;
          const pid=placements.length;
          cells.forEach((idx,i)=>{owner[idx]=pid;letters[idx]=w[i]});
          placements.push({word:wi,cells,dir:[dr,dc]});placed=true;
        }
        if(!placed){ok=false;break outer}
      }
    }
    if(!ok)continue;
    for(let i=0;i<ROWS*COLS;i++)if(owner[i]===-1)letters[i]=pickFill(letters,i);
    let unfixable=false;
    for(let pass=0;pass<40&&!unfixable;pass++){
      let fixed=0;
      WORDS.forEach((word,wi)=>{
        const w=[...word];
        for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)for(const [dr,dc]of ALL8){
          if(!inb(r+dr*(w.length-1),c+dc*(w.length-1)))continue;
          const idxs=[];let match=true;
          for(let i=0;i<w.length;i++){const idx=(r+dr*i)*COLS+c+dc*i;if(letters[idx]!==w[i]){match=false;break}idxs.push(idx)}
          if(!match)continue;
          const p=owner[idxs[0]];
          const legit=p!==-1&&placements[p].word===wi&&idxs.every((idx,i)=>placements[p].cells[i]===idx);
          if(legit)continue;
          const fillers=idxs.filter(idx=>owner[idx]===-1);
          if(!fillers.length){unfixable=true;return}
          const idx=fillers[rnd(fillers.length)];
          let nl,g=0;do{nl=ALPHA_F[rnd(ALPHA_F.length)]}while(nl===letters[idx]&&++g<50);
          if(nl===letters[idx]){unfixable=true;return}
          letters[idx]=nl;fixed++;
        }
      });
      if(!fixed)break;
    }
    if(unfixable)continue;
    return {owner,letters,placements,attempt};
  }
  return null;
}
// Dolgu istatistiği: dolgu hücrelerinin hedef harf kümesiyle örtüşme payı ve özel harf payı
function fillStats(L,G){
  const set=new Set([...L.words.join("")]); let n=0,ov=0,sp=0;
  G.owner.forEach((o,i)=>{if(o!==-1)return;n++;if(set.has(G.letters[i]))ov++;if(SPECIAL.has(G.letters[i]))sp++});
  return {overlap:ov/n,special:sp/n,n};
}

// ---- istatistik ----
function dirStats(G){
  let rev=0,diag=0;
  for(const p of G.placements){const [dr,dc]=p.dir;if(dr<0||(dr===0&&dc<0))rev++;if(dr!==0&&dc!==0)diag++}
  return {rev:rev/G.placements.length,diag:diag/G.placements.length};
}
function xCount(G,COLS){ // görsel X kesişme sayısı (merkez doğru parçaları kesişen karşı-eğimli çapraz çiftleri)
  const seg=p=>{const a=p.cells[0],b=p.cells[p.cells.length-1];return {r0:Math.floor(a/COLS),c0:a%COLS,r1:Math.floor(b/COLS),c1:b%COLS,diag:p.dir[0]!==0&&p.dir[1]!==0,s:p.dir[0]*p.dir[1]}};
  const S=G.placements.map(seg); let x=0;
  const d=(p,q,r)=>(q.c-p.c)*(r.r-p.r)-(q.r-p.r)*(r.c-p.c);
  for(let i=0;i<S.length;i++)for(let j=i+1;j<S.length;j++){
    const a=S[i],b=S[j]; if(!a.diag||!b.diag||a.s===b.s)continue;
    const A={r:a.r0,c:a.c0},B={r:a.r1,c:a.c1},C={r:b.r0,c:b.c0},D={r:b.r1,c:b.c1};
    if(d(A,B,C)*d(A,B,D)<0&&d(C,D,A)*d(C,D,B)<0)x++;
  }
  return x;
}
const sumLen=ws=>ws.reduce((a,w)=>a+[...w].length,0);
// D  = Y·(1−p)                         (ADR-0008 ilk hali; her yerleşim eşit)
// D2 = K·(1+α·(PER−1))·(1−p), α=0,5    (ADR-0008 revizyon 2026-11-12: ilk kopya pahalı, tekrar kopya yarım)
const ALPHA=0.5;
const summary=L=>{const K=L.words.length,Y=L.per*K,H=L.per*sumLen(L.words),cells=L.cols*L.rows,p=H/cells;return {K,Y,H,cells,p,D:Y*(1-p),D2:K*(1+ALPHA*(L.per-1))*(1-p)}};

// ---- modlar ----
const mode=process.argv[2]||"validate";
if(mode==="validate"){
  const N=+process.argv[3]||300;
  console.log("id    grid    per  K   Y   hedef  p     D      D2     fail%  ortAttempt  maxAttempt");
  for(const L of TESTS){
    const rand=mulberry32(1); let fails=0,sum=0,max=0;
    for(let i=0;i<N;i++){const G=generate(L,rand);if(!G){fails++;continue}sum+=G.attempt;max=Math.max(max,G.attempt)}
    const s=summary(L);
    console.log(`${L.id.padEnd(5)} ${L.cols}×${L.rows}`.padEnd(14)+`${L.per}    ${String(L.words.length).padEnd(3)} ${String(s.Y).padEnd(3)} ${String(s.H).padEnd(6)} ${s.p.toFixed(2)}  ${s.D.toFixed(1).padEnd(6)} ${s.D2.toFixed(1).padEnd(6)} ${(100*fails/N).toFixed(1).padStart(5)}  ${(sum/Math.max(1,N-fails)).toFixed(2).padStart(10)}  ${String(max).padStart(10)}`);
  }
}else if(mode==="bake"){
  const SEED=20261105;
  // Yön oranı kirletmesin: gerçekleşen ters (hedef rev ?? 0,20) ±0,07 ve çapraz 0,27–0,43 bandına düşen ilk seed alınır.
  const BAND=(L,G)=>{const d=dirStats(G),t=L.rev??0.2;return Math.abs(d.rev-t)<=0.07&&d.diag>=0.27&&d.diag<=0.43};
  const out=[];
  for(const [i,L] of TESTS.entries()){
    let G=null,s;
    for(s=0;s<5000;s++){const g=generate(L,mulberry32(SEED+i*10000+s));if(g&&BAND(L,g)){G=g;break}}
    if(!G)throw new Error(L.id+" bantta üretilemedi");
    const target=G.owner.filter(o=>o!==-1).length, ds=dirStats(G), x=xCount(G,L.cols), sm=summary(L), fs=fillStats(L,G);
    const sp=[...L.words.join("")]; const wordSpecial=sp.filter(ch=>SPECIAL.has(ch)).length/sp.length;
    out.push({id:L.id,series:L.series,name:L.name,cols:L.cols,rows:L.rows,per:L.per,
      ...(L.noDiagCross?{noDiagCross:true}:{}),...(L.rev!==undefined?{rev:L.rev}:{}),...(L.fillMode?{fillMode:L.fillMode}:{}),words:L.words,
      letters:G.letters.join(""),
      p:G.placements.map(pl=>[pl.word,pl.cells[0],pl.dir[0],pl.dir[1]]),
      meta:{target,ratio:+(target/(L.cols*L.rows)).toFixed(3),D:+sm.D.toFixed(1),D2:+sm.D2.toFixed(1),rev:+ds.rev.toFixed(2),diag:+ds.diag.toFixed(2),xCross:x,
        fillOverlap:+fs.overlap.toFixed(2),fillSpecial:+fs.special.toFixed(2),wordSpecial:+wordSpecial.toFixed(2),seed:SEED+i*10000+s}});
    console.error(`${L.id.padEnd(5)} ${L.cols}×${L.rows} per${L.per} K=${L.words.length} Y=${G.placements.length} hedef=${target} p=${(target/(L.cols*L.rows)).toFixed(3)} D2=${sm.D2.toFixed(1)} ters=${ds.rev.toFixed(2)} çapraz=${ds.diag.toFixed(2)} X=${x} dolguÖrtüşme=${fs.overlap.toFixed(2)} dolguÖzel=${fs.special.toFixed(2)} kelimeÖzel=${wordSpecial.toFixed(2)} seedOffset=${s}`);
  }
  process.stdout.write(`// Test levelları (parametre keşfi). Üretim: tools/bake.js bake, seed ${SEED}+i·10000+offset, index.html generator'ının kopyası.\n`);
  process.stdout.write(`// Her level kendi cols/rows/per değerini taşır; format letters + p = [kelimeIdx, başlangıçIdx, dr, dc] (levels.js ile aynı).\n`);
  process.stdout.write(`// Tasarım: docs/levels/param-tests-v01.md (T00–T11), docs/levels/param-tests-v02.md (T09X, T12–T15)\n`);
  process.stdout.write("window.TEST_LEVEL_DATA="+JSON.stringify({seed:SEED,levels:out})+";\n");
}else if(mode==="funnel"){
  // Amaze GO! modeli (docs/levels/funnel-v01.md): level numarası → tier (periyodik dizi), tier → parametre seti, kelime listesi tier havuzundan sırayla.
  // Girdi: tools/funnel-v01.json {seed, sequence:["FRNNHRHRNS","RNHRNHRNNS"...] (ilk eleman bir kez, sonrakiler döngü), tiers:{F:{cols,rows,per,lives,fillMode,...}}, overrides:{"1":{diag:0,rev:0}}, pool:{F:[{theme,words}],...}}
  const F=JSON.parse(require("fs").readFileSync(process.argv[3]||"tools/funnel-v01.json","utf8"));
  const count=+process.argv[4]||Object.values(F.pool).reduce((s,a)=>s+a.length,0);
  const seqAt=n=>{const [first,...loop]=F.sequence;if(n<=first.length)return first[n-1];const i=(n-first.length-1)%loop.join("").length;return loop.join("")[i]};
  const used=Object.fromEntries(Object.keys(F.pool).map(k=>[k,0])), out=[];
  for(let n=1;n<=count;n++){
    const tier=seqAt(n), T=F.tiers[tier], item=F.pool[tier][used[tier]++];
    if(!item)throw new Error(`L${n}: ${tier} havuzu bitti (${used[tier]-1})`);
    const L={id:"L"+n,tier,name:item.theme,words:item.words,cols:T.cols,rows:T.rows,per:T.per,lives:T.lives??3,
      ...(T.fillMode?{fillMode:T.fillMode}:{}),...(T.diag!==undefined?{diag:T.diag}:{}),...(T.rev!==undefined?{rev:T.rev}:{}),...(F.overrides?.[n]||{})};
    const BAND=G=>{const d=dirStats(G);const dOK=L.diag===0?d.diag===0:(d.diag>=0.27&&d.diag<=0.43);const r=L.rev??0.2;return dOK&&Math.abs(d.rev-r)<=0.07};
    let G=null,s;for(s=0;s<5000;s++){const g=generate(L,mulberry32(F.seed+n*10000+s));if(g&&BAND(g)){G=g;break}}
    if(!G)throw new Error(L.id+" bantta üretilemedi");
    const target=G.owner.filter(o=>o!==-1).length, ds=dirStats(G), sm=summary(L), fs=fillStats(L,G);
    const sp=[...L.words.join("")], wordSpecial=sp.filter(ch=>SPECIAL.has(ch)).length/sp.length;
    const {id,...rest}=L;
    out.push({id,...rest,letters:G.letters.join(""),p:G.placements.map(pl=>[pl.word,pl.cells[0],pl.dir[0],pl.dir[1]]),
      meta:{target,ratio:+(target/(L.cols*L.rows)).toFixed(3),D:+sm.D.toFixed(1),D2:+sm.D2.toFixed(1),rev:+ds.rev.toFixed(2),diag:+ds.diag.toFixed(2),xCross:xCount(G,L.cols),
        fillOverlap:+fs.overlap.toFixed(2),fillSpecial:+fs.special.toFixed(2),wordSpecial:+wordSpecial.toFixed(2),seed:F.seed+n*10000+s}});
    console.error(`L${String(n).padEnd(3)} ${tier} ${L.name.padEnd(11)} ${L.cols}×${L.rows} K=${L.words.length} Σ=${sumLen(L.words)} p=${sm.p.toFixed(2)} D2=${sm.D2.toFixed(1)} çapraz=${ds.diag.toFixed(2)} ters=${ds.rev.toFixed(2)} dolgu=${L.fillMode||"freq"} örtüşme=${fs.overlap.toFixed(2)} özel=${wordSpecial.toFixed(2)} seedOffset=${s}`);
  }
  process.stdout.write(`// Funnel levelları L1–${count} (docs/levels/funnel-v01.md). Üretim: tools/bake.js funnel tools/funnel-v01.json, seed ${F.seed}+n·10000+offset.\n`);
  process.stdout.write("window.FUNNEL_DATA="+JSON.stringify({seed:F.seed,sequence:F.sequence,levels:out})+";\n");
}else if(mode==="pack"){
  // test-levels.js | funnel-levels.js → tapwords-level/1 JSON (docs/levels/level-format.md)
  const src=require("fs").readFileSync(process.argv[3]||"test-levels.js","utf8"), window={}; eval(src);
  const D=window.TEST_LEVEL_DATA||window.FUNNEL_DATA, isFunnel=!window.TEST_LEVEL_DATA, DIRNAME={"0,1":"E","1,0":"S","1,1":"SE","1,-1":"SW","0,-1":"W","-1,0":"N","-1,-1":"NW","-1,1":"NE"};
  const levels=D.levels.map((L,i)=>{
    const letters=[...L.letters], n=L.cols*L.rows, owner=new Array(n).fill(-1);
    const placements=L.p.map(([wi,start,dr,dc],pid)=>{
      const word=L.words[wi], len=[...word].length, cells=[];
      for(let k=0;k<len;k++){const idx=start+k*(dr*L.cols+dc);if(owner[idx]!==-1||letters[idx]!==[...word][k])throw new Error(L.id+" tutarsız");owner[idx]=pid;cells.push([Math.floor(idx/L.cols),idx%L.cols])}
      return {word,wordIndex:wi,row:cells[0][0],col:cells[0][1],dir:DIRNAME[dr+","+dc],dr,dc,cells};
    });
    const fill=[];for(let idx=0;idx<n;idx++)if(owner[idx]===-1)fill.push([Math.floor(idx/L.cols),idx%L.cols]);
    const grid=[];for(let r=0;r<L.rows;r++)grid.push(letters.slice(r*L.cols,(r+1)*L.cols).join(""));
    return {id:L.id,index:isFunnel?i+1:51+i,lang:"tr",tier:isFunnel?L.tier:"test",...(L.series?{series:L.series}:{}),cols:L.cols,rows:L.rows,per:L.per,lives:L.lives??5,hints:3,
      ...(L.noDiagCross?{noDiagCross:true}:{}),...(L.rev!==undefined?{reversedWeight:L.rev}:{}),...(L.diag!==undefined?{diagonalWeight:L.diag}:{}),fillMode:L.fillMode||"freq",
      words:L.words,grid,placements,fill,
      meta:{theme:L.name,targetCells:n-fill.length,fillCells:fill.length,ratio:L.meta.ratio,D:L.meta.D,D2:L.meta.D2,reversedShare:L.meta.rev,diagonalShare:L.meta.diag,xCross:L.meta.xCross,
        ...(L.meta.fillOverlap!==undefined?{fillOverlap:L.meta.fillOverlap,fillSpecial:L.meta.fillSpecial,wordSpecial:L.meta.wordSpecial}:{}),seed:L.meta.seed}};
  });
  const pkg={format:"tapwords-level/1",package:process.argv[4]||"param-tests",lang:"tr",generatedAt:new Date().toISOString().slice(0,10),
    source:"tools/bake.js "+(isFunnel?"funnel":"bake")+" (seed "+D.seed+")",design:isFunnel?"docs/levels/funnel-v01.md":"docs/levels/param-tests-v01.md, param-tests-v02.md, param-tests-v03.md",schema:"docs/levels/level-format.md",
    ...(isFunnel?{sequence:D.sequence}:{}),constants:{lives:isFunnel?3:5,hints:3,fillAlphabet:"tr-frequency"},levels};
  process.stdout.write(JSON.stringify(pkg,null,1).replace(/\[\n\s+(-?\d+),\n\s+(-?\d+)\n\s+\]/g,"[$1,$2]"));
  console.error(levels.length+" level paketlendi");
}else if(mode==="check"){
  // lists.json: [{id, cols, rows, per, words[], noDiagCross?}, ...]
  const list=JSON.parse(require("fs").readFileSync(process.argv[3],"utf8")), N=+process.argv[4]||200;
  console.log("id    grid    per  K   Σharf  Y   p     D      D2     fail%  ortAttempt  not");
  for(const L of list){
    const ws=L.words, bad=[];
    for(const w of ws){const r=[...w].reverse().join("");if(w===r)bad.push("palindrom:"+w);for(const v of ws)if(v!==w&&(v.includes(w)||v.includes(r)))bad.push(w+"⊂"+v)}
    const rand=mulberry32(7); let fails=0,sum=0;
    for(let i=0;i<N;i++){const G=generate(L,rand);if(!G){fails++;continue}sum+=G.attempt}
    const s=summary(L);
    console.log(`${String(L.id).padEnd(5)} ${L.cols}×${L.rows}`.padEnd(14)+`${L.per}    ${String(ws.length).padEnd(3)} ${String(sumLen(ws)).padEnd(6)} ${String(s.Y).padEnd(3)} ${s.p.toFixed(2)}  ${s.D.toFixed(1).padEnd(6)} ${s.D2.toFixed(1).padEnd(6)} ${(100*fails/N).toFixed(1).padStart(5)}  ${(sum/Math.max(1,N-fails)).toFixed(2).padStart(10)}  ${bad.join(" ")}`);
  }
}
