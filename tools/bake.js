#!/usr/bin/env node
// Tap Words — offline tahta üretici (ADR-0005). index.html generator'ının Node kopyası + seed'li RNG.
//
//   node tools/bake.js validate [N]        her test levelı için N üretim; başarısızlık oranı, ortalama deneme
//   node tools/bake.js bake > test-levels.js   test levellarını pre-bake eder (seed'ler sabit; eski leveller birebir aynı kalır)
//   node tools/bake.js check <lists.json> [N]  curve dokümanı için kelime listesi + parametre setini doğrular
//   node tools/bake.js funnel <funnel.json> > funnel-x-levels.js    hazır listeli funnel (A–D; docs/levels/funnels-v01.md)
//   node tools/bake.js compose <funnel.json> > funnel-x-levels.js   tarif + tema bankasından funnel (E–F; docs/levels/funnels-v02.md)
//   node tools/bake.js pack <levels.js> [paket] > levels/x.json     Unity paketi (docs/levels/level-format.md)
//
// Level parametreleri: cols, rows, per, words[],
//   noDiagCross (ops.; true → SE ve SW çaprazlar görsel X yapamaz)
//   rev        (ops.; ters yazım olasılığı 0–1; yoksa eski DIRS dizisi = 0,20)
//   fillMode   (ops.; "freq" TR frekans (varsayılan) | "disjoint" hedefte olmayan harfler | "target" yalnızca hedef harfleri | "bigram" hedef kelimelerin ikili dizileri)
//   diag       (ops.; çapraz eksen olasılığı 0–1; yoksa 0,5 = dört eksen eşit. 0 → yalnızca yatay/dikey, FTUE)
//   axisW      (ops.; eksen ağırlıkları [yatay, dikey, çapraz ↘, çapraz ↙]; verilirse diag yok sayılır — yön profilleri, compose modu)
//   sepWords   (ops.; "ayrışan" kelimelerin indeksleri; dolgu alfabesi bu kelimelerin harflerini içermez)
//   allowStack (ops.; izin verilen "tam hizalı aynı kelime" çifti sayısı; yoksa denetim yok. 0 → hiç üretilmez)

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
  let a;
  if(mode==="freq")a=[...FILL];
  else if(mode==="disjoint"){a=[...FILL].filter(ch=>!set.has(ch));if(!a.length)a=[...FILL]}
  else a=tgt; // "target" ve "bigram": hedef harflerinin hedefteki frekansıyla
  if(L.sepWords?.length){const sep=new Set(L.sepWords.flatMap(wi=>[...L.words[wi]])), b=a.filter(ch=>!sep.has(ch));if(b.length)a=b}
  return a;
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
  const AW=L.axisW, AWS=AW?AW.reduce((a,b)=>a+b,0):0, stackCap=L.allowStack;
  const pickDir=()=>{
    if(AW){let x=rand()*AWS,i=0;while(i<3&&x>=AW[i]){x-=AW[i];i++}const [dr,dc]=AXES[i];return rand()<(L.rev??0.2)?[-dr,-dc]:[dr,dc]}
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
    let ok=true, stacks=0;
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
          if(stackCap!==undefined){
            // tam hizalı aynı kelime: aynı eksende (ters yazım dahil), hücre kümesi eksene paralel olmayan bir birim adım kaymış kopya
            const s0=Math.min(...cells), sr=Math.floor(s0/COLS), sc=s0%COLS; let ns=0;
            for(const q of placements){
              if(q.word!==wi||q.dir[0]*dc-q.dir[1]*dr!==0)continue;
              const q0=Math.min(...q.cells), er=sr-Math.floor(q0/COLS), ec=sc-q0%COLS;
              if(Math.abs(er)+Math.abs(ec)===1&&er*dc-ec*dr!==0)ns++;
            }
            if(stacks+ns>stackCap)continue;
            stacks+=ns;
          }
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
    return {owner,letters,placements,attempt,stacks};
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
  // Girdi: tools/funnel-<x>.json {id, name, seed, poolSeed?, count?, sequence:["FRNNHRHRNS","RNHRNHRNNS"...] (ilk eleman bir kez, sonrakiler döngü), tiers:{F:{cols,rows,per,lives,fillMode,...}}, overrides:{"1":{diag:0,rev:0}}, pool:{F:[{theme,words}],...}}
  //   pool bir dosya adı da olabilir (tools/funnel-pool.json; paylaşılan havuz). poolSeed verilirse her tier havuzu o seed'le karıştırılır (funnel'lar arası çeşitlilik).
  //   tiers[X].pool: bu tier'ın çektiği havuz anahtarı (ör. "B": H parametreleri + bigram, havuz "H"). count: üretilecek level sayısı (ops.; argv[4] öncelikli).
  const fs_=require("fs"), path_=require("path"), src=process.argv[3]||"tools/funnel-a.json";
  const F=JSON.parse(fs_.readFileSync(src,"utf8"));
  const POOL=typeof F.pool==="string"?JSON.parse(fs_.readFileSync(path_.join(path_.dirname(src),F.pool),"utf8")):F.pool;
  const pool={};for(const k of Object.keys(POOL)){if(k.startsWith("$"))continue;const a=[...POOL[k]];
    if(F.poolSeed!==undefined){const r=mulberry32(F.poolSeed*7919+k.charCodeAt(0));for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}}
    pool[k]=a}
  // --- havuz doğrulaması: palindrom, alt dize (ters dahil), kelime sayısı, uzunluk ve Σ bandı, özel harf sınırı, havuz genelinde kelime tekilliği ---
  // Doğrulama yalnızca funnel'ın tier'larının çektiği havuz anahtarlarında (K listeleri N'den türetildiği için K+N aynı funnel'da olamaz; funnel D K kullanır, N kullanmaz).
  const usedKeys=new Set(Object.entries(F.tiers).map(([code,t])=>t.pool||code));
  for(const k of Object.keys(pool))if(!usedKeys.has(k))delete pool[k];
  const BANDS={F:{k:4,len:[5,6],sum:[21,23],special:1},K:{k:4,len:[4,6],sum:[20,23],special:0.15},R:{k:5,len:[4,7],sum:[26,28],special:0.15},N:{k:6,len:[4,6],sum:[29,30],special:0.134},H:{k:6,len:[4,5],sum:[24,26],special:0.10},S:{k:7,len:[4,5],sum:[28,31],special:0.10}};
  const errs=[], seen=new Map();
  for(const k of Object.keys(pool))for(const it of pool[k]){const B=BANDS[k],ws=it.words,tag=`${k}/${it.theme}`;
    if(B){if(ws.length!==B.k)errs.push(`${tag}: ${ws.length} kelime (beklenen ${B.k})`);
      const S=sumLen(ws);if(S<B.sum[0]||S>B.sum[1])errs.push(`${tag}: Σ ${S} (bant ${B.sum})`);
      const sp=[...ws.join("")].filter(ch=>SPECIAL.has(ch)).length/sumLen(ws);if(sp>B.special+1e-9)errs.push(`${tag}: özel %${(sp*100).toFixed(0)} (≤ %${B.special*100})`);
      for(const w of ws){const L=[...w].length;if(L<B.len[0]||L>B.len[1])errs.push(`${tag}: ${w} ${L} harf (bant ${B.len})`)}}
    for(const w of ws){const r=[...w].reverse().join("");if(w===r)errs.push(`${tag}: ${w} palindrom`);
      for(const v of ws)if(v!==w&&(v.includes(w)||v.includes(r)))errs.push(`${tag}: ${w} ⊂ ${v}`);
      if(seen.has(w))errs.push(`havuz: ${w} tekrar (${seen.get(w)} ve ${tag})`);else seen.set(w,tag)}}
  if(errs.length){console.error(errs.join("\n"));throw new Error(errs.length+" havuz hatası")}
  const seqStr=F.sequence.join(""), count=+process.argv[4]||F.count||seqStr.length;
  const seqAt=n=>{if(seqStr.length>=count)return seqStr[n-1];const [first,...loop]=F.sequence;if(n<=first.length)return first[n-1];const i=(n-first.length-1)%loop.join("").length;return loop.join("")[i]};
  const used=Object.fromEntries(Object.keys(pool).map(k=>[k,0])), out=[], wordAt=new Map(), themeAt=new Map(), seqErrs=[];
  for(let n=1;n<=count;n++){
    const tier=seqAt(n), T=F.tiers[tier]; if(!T)throw new Error(`L${n}: tier ${tier} tanımsız`);
    const pk=T.pool||tier, item=pool[pk][used[pk]++];
    if(!item)throw new Error(`L${n}: ${pk} havuzu bitti (${used[pk]-1})`);
    for(const w of item.words){if(wordAt.has(w)&&n-wordAt.get(w)<20)seqErrs.push(`L${n} ${w}: L${wordAt.get(w)}'de de var (< 20 level)`);wordAt.set(w,n)}
    if(themeAt.has(item.theme)&&n-themeAt.get(item.theme)<30)seqErrs.push(`L${n} ${item.theme}: L${themeAt.get(item.theme)}'de de var (< 30 level)`);themeAt.set(item.theme,n);
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
    console.error(`L${String(n).padEnd(3)} ${tier} ${L.name.padEnd(13)} ${L.cols}×${L.rows} K=${L.words.length} Σ=${sumLen(L.words)} p=${sm.p.toFixed(2)} D2=${sm.D2.toFixed(1)} çapraz=${ds.diag.toFixed(2)} ters=${ds.rev.toFixed(2)} dolgu=${L.fillMode||"freq"} örtüşme=${fs.overlap.toFixed(2)} özel=${wordSpecial.toFixed(2)} seedOffset=${s}`);
  }
  if(seqErrs.length){console.error(seqErrs.join("\n"));throw new Error(seqErrs.length+" dizi hatası (kelime/tema mesafesi)")}
  console.error("havuz kullanımı: "+Object.entries(used).map(([k,v])=>`${k} ${v}/${pool[k].length}`).join(" · "));
  process.stdout.write(`// Funnel ${F.name||""} L1–${count} (docs/levels/funnel-v01.md). Üretim: node tools/bake.js funnel ${src}, seed ${F.seed}+n·10000+offset, poolSeed ${F.poolSeed??"-"}.\n`);
  process.stdout.write("window.FUNNEL_DATA="+JSON.stringify({name:F.name,id:F.id,seed:F.seed,sequence:F.sequence,tiers:F.tiers,levels:out})+";\n");
}else if(mode==="compose"){
  // Tarif tabanlı funnel (docs/levels/funnels-v02.md, ADR-0011): tier = D₂ bandı; her level için tarif + yön profili + kelime rolü çekilir,
  // kelimeler tema bankasından (tools/word-bank.json) D₂ hedefine en yakın Σ verecek şekilde seçilir.
  // Girdi: tools/funnel-<x>.json {id, name, seed, count, bank, per, lives, sequence:[ilk 10, döngü...] ("E" = kolay yuvası → K/O çekilişi, easy.pK),
  //   tiers:{K:{label, band:[lo,hi], peak?, maxRoles?, drift?:[n0,v0,n1,v1]}}, fixed:{"1":{açık level}}, recipes:{K4:{tier, groups:[{n,len:[a,b]}], grids:[[c,r]], weight, from?, pMax?, special?}},
  //   dirProfiles:{ad:{axisW, rev, weight, from?, maxP?, diagRange?, revRange?}}, roles:{ad:{sep, fener, weight, from?}}, roleRules:{maxWords, maxShare, maxRun, perDecade:[a,b], from},
  //   postPeak:{recipe, low, noDirs?, grids?}, pairLow? (ardışık tepe çiftinde ilkinin bant içi payı), easy:{pK:[[n0,n1,olasılık]], maxRun (aynı kolay tier art arda en fazla)}, fixedSeed (sabit levelların seed tabanı; E ve F'de intro tahtaları aynı), character:{recipe, dirs, from}, stack:{from}, force:{"20":{recipe?, dir?, roles?, rev?, d2?, grid?, tier? (yalnız E yuvası)}}, themeGap, wordGap}
  const fs_=require("fs"), path_=require("path"), src=process.argv[3]||"tools/funnel-e.json";
  const F=JSON.parse(fs_.readFileSync(src,"utf8"));
  const BANK=JSON.parse(fs_.readFileSync(path_.join(path_.dirname(src),F.bank||"word-bank.json"),"utf8")).themes;
  const FEN=new Set([..."ÇĞÖŞÜ"]), isFener=w=>[...w].filter(ch=>FEN.has(ch)).length>=2, wl=w=>[...w].length;
  { // banka doğrulaması: 4–8 harf, palindrom yok, banka genelinde tekil
    const errs=[], seen=new Map();
    for(const t of BANK)for(const w of t.words){const n=wl(w);if(n<4||n>8)errs.push(`${t.theme}: ${w} ${n} harf`);
      if(w===[...w].reverse().join(""))errs.push(`${t.theme}: ${w} palindrom`);
      if(seen.has(w))errs.push(`${w} tekrar (${seen.get(w)} ve ${t.theme})`);else seen.set(w,t.theme)}
    if(errs.length){console.error(errs.join("\n"));throw new Error(errs.length+" banka hatası")}
  }
  const C=mulberry32(F.seed*31+7), crnd=n=>Math.floor(C()*n), cpick=a=>a[crnd(a.length)];
  const count=+process.argv[4]||F.count||100, PER=F.per??5, R=F.recipes, DP=F.dirProfiles, RO=F.roles, RR=F.roleRules||{}, FO=F.force||{}, FX=F.fixed||{};
  const gapT=F.themeGap??30, gapW=F.wordGap??20, EPS=0.05;
  // --- 1) tier dizisi ("E" yuvaları çözülür) ---
  const [first,...loop]=F.sequence, loopStr=loop.join("");
  const codeAt=n=>n<=first.length?first[n-1]:loopStr[(n-first.length-1)%loopStr.length];
  const tierOf=[null];
  for(let n=1;n<=count;n++){let c=codeAt(n);
    if(c==="E"){const u=C(), pK=(F.easy?.pK||[]).find(([a,b])=>n>=a&&n<=b)?.[2]??0.5; const run=F.easy?.maxRun, same=t=>run&&n>run&&tierOf.slice(n-run,n).every(x=>x===t);
      c=FO[n]?.tier||(F.tiers[tierOf[n-1]]?.peak?"K":same("K")?"O":same("O")?"K":u<pK?"K":"O")}
    if(!F.tiers[c])throw new Error(`L${n}: tier ${c} tanımsız`);tierOf.push(c)}
  const isPeak=n=>!!F.tiers[tierOf[n]]?.peak, postPeak=n=>n>1&&isPeak(n-1)&&!isPeak(n);
  // --- 2) set (10'luk) başına bir karakter leveli ve bir "hizalı kopya serbest" leveli ---
  const charAt=new Set(), stackAt=new Set();
  for(let a=11;a<=count;a+=10){const lv=[];for(let n=a;n<Math.min(a+10,count+1);n++)if(!FX[n])lv.push(n);
    if(F.character&&a>=(F.character.from??11)){const c=lv.filter(n=>tierOf[n]===R[F.character.recipe].tier&&!postPeak(n)&&!FO[n]);if(c.length)charAt.add(cpick(c))}
    if(F.stack&&a>=(F.stack.from??11)){const c=lv.filter(n=>!charAt.has(n));if(c.length)stackAt.add(cpick(c))}}
  // --- 3) kelime seçimi ---
  const themeAt=new Map(), wordAt=new Map(), themeUse=new Map();
  function pickWords(n,rec,cols,rows,role,prof,target,band){
    const k=rec.groups.reduce((a,g)=>a+g.n,0), cells=cols*rows, mult=k*(1+ALPHA*(PER-1)), pMax=Math.min(rec.pMax??0.63,prof.maxP??1);
    const d2=S=>mult*(1-PER*S/cells), okS=S=>{const v=d2(S);return v>=band[0]-EPS&&v<=band[1]+1e-9&&PER*S/cells<=pMax+1e-9}; // alt uçta 0,05 tolerans (tam sayı Σ), üst uç kesin
    const cands=[];
    for(const t of BANK){
      if(themeAt.has(t.theme)&&n-themeAt.get(t.theme)<gapT)continue;
      const ws=t.words.filter(w=>!(wordAt.has(w)&&n-wordAt.get(w)<gapW)).map(w=>({w,n:wl(w),f:isFener(w),r:[...w].reverse().join("")}));
      let best=Infinity, combos=[];
      const walk=(gi,start,left,chosen,S,fen)=>{
        if(fen>role.fener)return;
        if(gi===rec.groups.length){
          if(fen!==role.fener||!okS(S))return;
          const dist=Math.abs(d2(S)-target); if(dist>best+1e-9)return;
          for(const a of chosen)for(const b of chosen)if(a!==b&&(b.w.includes(a.w)||b.w.includes(a.r)))return;
          if(dist<best-1e-9){best=dist;combos=[]} combos.push(chosen.map(x=>x.w)); return;
        }
        const g=rec.groups[gi];
        if(left===0)return walk(gi+1,0,rec.groups[gi+1]?.n??0,chosen,S,fen);
        for(let i=start;i<ws.length;i++){const x=ws[i];if(x.n<g.len[0]||x.n>g.len[1]||chosen.includes(x))continue;
          walk(gi,i+1,left-1,[...chosen,x],S+x.n,fen+(x.f?1:0))}
      };
      walk(0,0,rec.groups[0].n,[],0,0);
      if(combos.length)cands.push({theme:t.theme,best,combos,use:themeUse.get(t.theme)||0});
    }
    if(!cands.length)return null;
    // tema: hedefe yeterince yakın (≤ en iyi + 0,2) adaylar içinde önce en az kullanılmış, sonra hedefe en yakın (± 0,15) olanlardan çekiliş
    const minD=Math.min(...cands.map(c=>c.best)), ok=cands.filter(c=>c.best<=minD+0.2), minU=Math.min(...ok.map(c=>c.use)), fresh=ok.filter(c=>c.use===minU), minF=Math.min(...fresh.map(c=>c.best));
    const th=cpick(fresh.filter(c=>c.best<=minF+0.15)), words=[...cpick(th.combos)];
    for(let i=words.length-1;i>0;i--){const j=crnd(i+1);[words[i],words[j]]=[words[j],words[i]]}
    // ayrışan: fener olmayanlar içinde, harfleri diğer kelimelerde en az geçen
    const score=w=>{const others=new Set(words.filter(v=>v!==w).flatMap(v=>[...v]));return new Set([...w].filter(ch=>!others.has(ch))).size+C()*0.5};
    const sep=words.filter(w=>!isFener(w)).map(w=>[w,score(w)]).sort((a,b)=>b[1]-a[1]).slice(0,role.sep).map(([w])=>words.indexOf(w)).sort((a,b)=>a-b);
    if(sep.length<role.sep)return null;
    return {theme:th.theme,words,sep,fener:words.filter(isFener)};
  }
  // --- 4) pişirme: profil toleransı + hizalı kopya koşulu sağlayan ilk seed ---
  const fallbacks=[];
  function bakeLevel(n,L,prof,needStack,base=F.seed){
    const acc=g=>{const d=dirStats(g);
      if(prof.diagRange&&(d.diag<prof.diagRange[0]-1e-9||d.diag>prof.diagRange[1]+1e-9))return false;
      if(L.rev>0&&prof.revRange&&(d.rev<prof.revRange[0]-1e-9||d.rev>prof.revRange[1]+1e-9))return false;
      return true};
    let fails=0, spare=null;
    for(let s=0;s<3000;s++){const g=generate(L,mulberry32(base+n*10000+s));if(!g){if(++fails>=3)return null;continue}
      if(!acc(g))continue;
      if(needStack&&g.stacks!==1){if(!spare)spare={G:g,s,seed:base+n*10000+s};if(s<1500)continue;fallbacks.push(`L${n}: hizalı çift üretilemedi, 0 çiftle alındı`);return spare}
      return {G:g,s,seed:base+n*10000+s}}
    return spare;
  }
  // --- 5) level döngüsü ---
  const out=[], hist=[], report=[], decadeRoles=new Map(), wsel=(items,w)=>items.map(x=>[x,-Math.log(1-C())/w(x)]).sort((a,b)=>a[1]-b[1]).map(([x])=>x);
  for(let n=1;n<=count;n++){
    const tier=tierOf[n], T=F.tiers[tier], dec=Math.floor((n-1)/10), fo=FO[n]||{};
    let L=null, prof=null, baked=null, key=null, d2Target=null, sepW=[], fenW=[];
    if(FX[n]){
      const X=FX[n]; prof=X.diagRange?{diagRange:X.diagRange}:{}; key={recipe:X.recipe||"intro",dir:X.dirProfile||"-",roles:"none"};
      L={id:"L"+n,tier,name:X.name,words:X.words,cols:X.cols,rows:X.rows,per:X.per??PER,lives:X.lives??F.lives??3,...(X.fillMode?{fillMode:X.fillMode}:{}),axisW:X.axisW,rev:X.rev??0,allowStack:0,recipe:key.recipe,dirProfile:key.dir,roles:"none"};
      baked=bakeLevel(n,L,prof,false,F.fixedSeed??F.seed); if(!baked)throw new Error(L.id+" (sabit) üretilemedi");
    }else{
      const u=C(), band=T.band, prev=hist[hist.length-1], prev2=hist[hist.length-2], pp=postPeak(n), isChar=charAt.has(n);
      if(fo.d2!==undefined)d2Target=fo.d2;
      else if(T.drift){const [n0,v0,n1,v1]=T.drift, t=Math.min(1,Math.max(0,(n-n0)/(n1-n0)));d2Target=v0+(v1-v0)*t}
      else if(pp&&F.postPeak)d2Target=band[0]+u*F.postPeak.low;
      else if(isPeak(n)&&n<count&&isPeak(n+1)&&F.pairLow!==undefined)d2Target=band[0]+u*F.pairLow;
      else d2Target=band[0]+u*(band[1]-band[0]);
      const recs=fo.recipe?[fo.recipe]:isChar?[F.character.recipe]:pp&&F.postPeak?.recipe?[F.postPeak.recipe]:Object.keys(R).filter(r=>R[r].tier===tier&&(R[r].from??1)<=n&&!R[r].special);
      const dirs=fo.dir?[fo.dir]:isChar?F.character.dirs:Object.keys(DP).filter(d=>DP[d].weight>0&&(DP[d].from??1)<=n&&!(pp&&F.postPeak?.noDirs?.includes(d)));
      const roleCount=decadeRoles.get(dec)||0, leftInDec=10-((n-1)%10), ruled=n>=(RR.from??11);
      let roles=fo.roles?[].concat(fo.roles):Object.keys(RO).filter(r=>(RO[r].from??1)<=n);
      if(!fo.roles){
        if(T.maxRoles!==undefined)roles=roles.filter(r=>RO[r].sep+RO[r].fener<=T.maxRoles);
        if(prev&&prev2&&prev.roles===prev2.roles&&RR.maxRun===2)roles=roles.filter(r=>r!==prev.roles);
        if(ruled&&RR.perDecade){if(roleCount>=RR.perDecade[1])roles=roles.filter(r=>r==="none");else if(RR.perDecade[0]-roleCount>=leftInDec)roles=roles.filter(r=>r!=="none")}
      }
      let triples=[];
      for(const r of recs){const k=R[r].groups.reduce((a,g)=>a+g.n,0), cap=Math.min(RR.maxWords??3,Math.floor(k*(RR.maxShare??0.5)));
        for(const d of dirs)for(const ro of roles){if(RO[ro].sep+RO[ro].fener>cap)continue;
          const diff=prev?(r!==prev.recipe)+(d!==prev.dir)+(ro!==prev.roles):3;
          triples.push({r,d,ro,diff,w:(R[r].weight??1)*(DP[d].weight||1)*(RO[ro].weight??1)})}}
      const varied=triples.filter(t=>t.diff>=2);
      if(varied.length)triples=varied;else fallbacks.push(`L${n}: çeşitlilik kuralı gevşetildi (zorunlu seçimler)`);
      const order=wsel(triples,t=>t.w);
      for(const t of order.slice(0,60)){
        const rec=R[t.r]; prof=DP[t.d]; const [cols,rows]=fo.grid||cpick(pp&&!fo.recipe&&F.postPeak?.grids||rec.grids);
        const sel=pickWords(n,rec,cols,rows,RO[t.ro],prof,d2Target,band); if(!sel)continue;
        L={id:"L"+n,tier,name:sel.theme,words:sel.words,cols,rows,per:PER,lives:F.lives??3,axisW:prof.axisW,rev:fo.rev??prof.rev,...(sel.sep.length?{sepWords:sel.sep}:{}),allowStack:stackAt.has(n)?1:0,recipe:t.r,dirProfile:t.d,roles:t.ro};
        baked=bakeLevel(n,L,prof,stackAt.has(n));
        if(baked){key={recipe:t.r,dir:t.d,roles:t.ro};sepW=sel.sep.map(i=>sel.words[i]);fenW=sel.fener;if(t!==order[0])fallbacks.push(`L${n}: ilk çekiliş (${order[0].r}/${order[0].d}/${order[0].ro}) üretilemedi → ${t.r}/${t.d}/${t.ro}`);break}
      }
      if(!baked)throw new Error(`L${n} (${tier}) hiçbir tarif/profil/rol üçlüsüyle üretilemedi`);
      if(key.roles!=="none")decadeRoles.set(dec,(decadeRoles.get(dec)||0)+1);
    }
    hist.push(key); themeAt.set(L.name,n); themeUse.set(L.name,(themeUse.get(L.name)||0)+1); for(const w of L.words)wordAt.set(w,n);
    const G=baked.G, target=G.owner.filter(o=>o!==-1).length, ds=dirStats(G), sm=summary(L), fs=fillStats(L,G);
    const sp=[...L.words.join("")], wordSpecial=sp.filter(ch=>SPECIAL.has(ch)).length/sp.length;
    const {id,...rest}=L;
    out.push({id,...rest,...(sepW.length?{sep:sepW}:{}),...(fenW.length?{fener:fenW}:{}),letters:G.letters.join(""),p:G.placements.map(pl=>[pl.word,pl.cells[0],pl.dir[0],pl.dir[1]]),
      meta:{target,ratio:+(target/(L.cols*L.rows)).toFixed(3),D:+sm.D.toFixed(1),D2:+sm.D2.toFixed(2),...(d2Target!==null?{d2Target:+d2Target.toFixed(2)}:{}),rev:+ds.rev.toFixed(2),diag:+ds.diag.toFixed(2),xCross:xCount(G,L.cols),
        fillOverlap:+fs.overlap.toFixed(2),fillSpecial:+fs.special.toFixed(2),wordSpecial:+wordSpecial.toFixed(2),stacks:G.stacks,seed:baked.seed}});
    report.push({n,tier,recipe:key.recipe,dir:key.dir,roles:key.roles,D2:sm.D2,stacks:G.stacks,diag:ds.diag,rev:ds.rev,char:charAt.has(n)});
    console.error(`L${String(n).padEnd(3)} ${(T.label||tier).padEnd(5)} ${key.recipe.padEnd(6)} ${L.name.padEnd(13)} ${(L.cols+"×"+L.rows).padEnd(5)} K=${L.words.length} Σ=${String(sumLen(L.words)).padEnd(2)} p=${sm.p.toFixed(2)} D2=${sm.D2.toFixed(2).padStart(5)}${d2Target!==null?" (hedef "+d2Target.toFixed(2)+")":""} ${key.dir.padEnd(7)} çapraz=${ds.diag.toFixed(2)} ters=${ds.rev.toFixed(2)} rol=${key.roles.padEnd(4)}${sepW.length?" ayrışan:"+sepW.join(","):""}${fenW.length?" fener:"+fenW.join(","):""} örtüşme=${fs.overlap.toFixed(2)} hizalı=${G.stacks}${charAt.has(n)?" [karakter]":""} seedOffset=${baked.s}`);
  }
  // --- 6) rapor ---
  const cnt=(arr,f)=>{const m={};for(const x of arr){const k=f(x);m[k]=(m[k]||0)+1}return Object.entries(m).sort().map(([k,v])=>`${k} ${v}`).join(" · ")};
  const body=report.filter(r=>!FX[r.n]);
  console.error("\n— rapor —");
  console.error("tier: "+cnt(report,r=>F.tiers[r.tier].label||r.tier));
  for(const t of Object.keys(F.tiers)){const v=report.filter(r=>r.tier===t).map(r=>r.D2);if(v.length)console.error(`D2 ${(F.tiers[t].label||t).padEnd(5)} ${Math.min(...v).toFixed(2)}–${Math.max(...v).toFixed(2)} (${v.length} level)`)}
  console.error("tarif: "+cnt(body,r=>r.recipe));
  console.error("yön profili: "+cnt(body,r=>r.dir));
  console.error("rol: "+cnt(body,r=>r.roles));
  for(let a=1;a<=count;a+=10){const s=report.filter(r=>r.n>=a&&r.n<a+10);
    console.error(`L${a}–${a+9}: ${s.map(r=>F.tiers[r.tier].label||r.tier).join(" ")} | rollü ${s.filter(r=>r.roles!=="none").length} · hizalı çiftli level ${s.filter(r=>r.stacks>0).length} · karakter ${s.filter(r=>r.char).map(r=>"L"+r.n).join(",")||"-"}`)}
  let minDiff=3,same3=0;const body0=Object.keys(FX).length; // sabit (intro) levellar kural dışı
  for(let i=body0+1;i<hist.length;i++){const a=hist[i-1],b=hist[i],d=(a.recipe!==b.recipe)+(a.dir!==b.dir)+(a.roles!==b.roles);minDiff=Math.min(minDiff,d);if(i+1>=(RR.from??11)+2&&hist[i-2].roles===a.roles&&a.roles===b.roles)same3++}
  console.error(`ardışık level farkı (tarif/profil/rol) en az ${minDiff}/3 · aynı rol 3 kez art arda: ${same3} · kullanılan tema ${themeUse.size}/${BANK.length} (en çok ${Math.max(...themeUse.values())} kez)`);
  console.error(fallbacks.length?"geri düşüşler:\n  "+fallbacks.join("\n  "):"geri düşüş yok");
  const seqOut=[];for(let a=1;a<=count;a+=10)seqOut.push(tierOf.slice(a,a+10).join(""));
  process.stdout.write(`// Funnel ${F.name||""} L1–${count} (${F.design||"docs/levels/funnels-v02.md"}). Üretim: node tools/bake.js compose ${src}, seed ${F.seed}+n·10000+offset, banka ${F.bank||"word-bank.json"}.\n`);
  process.stdout.write("window.FUNNEL_DATA="+JSON.stringify({name:F.name,id:F.id,seed:F.seed,design:F.design||"docs/levels/funnels-v02.md",sequence:seqOut,tiers:F.tiers,recipes:R,dirProfiles:DP,roles:RO,levels:out})+";\n");
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
      ...(L.recipe?{recipe:L.recipe,dirProfile:L.dirProfile,axisWeights:L.axisW,roles:L.roles,separatedWords:L.sep||[],beaconWords:L.fener||[],allowStack:L.allowStack}:{}),
      words:L.words,grid,placements,fill,
      meta:{theme:L.name,targetCells:n-fill.length,fillCells:fill.length,ratio:L.meta.ratio,D:L.meta.D,D2:L.meta.D2,reversedShare:L.meta.rev,diagonalShare:L.meta.diag,xCross:L.meta.xCross,
        ...(L.meta.fillOverlap!==undefined?{fillOverlap:L.meta.fillOverlap,fillSpecial:L.meta.fillSpecial,wordSpecial:L.meta.wordSpecial}:{}),
        ...(L.meta.stacks!==undefined?{alignedPairs:L.meta.stacks}:{}),...(L.meta.d2Target!==undefined?{D2Target:L.meta.d2Target}:{}),seed:L.meta.seed}};
  });
  const pkg={format:"tapwords-level/1",package:process.argv[4]||"param-tests",lang:"tr",generatedAt:new Date().toISOString().slice(0,10),
    source:"tools/bake.js "+(isFunnel?(D.recipes?"compose":"funnel"):"bake")+" (seed "+D.seed+")",design:isFunnel?(D.design||"docs/levels/funnel-v01.md"):"docs/levels/param-tests-v01.md, param-tests-v02.md, param-tests-v03.md",schema:"docs/levels/level-format.md",
    ...(isFunnel?{funnel:D.id,funnelName:D.name,sequence:D.sequence,tiers:D.tiers}:{}),...(D.recipes?{recipes:D.recipes,dirProfiles:D.dirProfiles,roles:D.roles}:{}),constants:{lives:isFunnel?3:5,hints:3,fillAlphabet:"tr-frequency"},levels};
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
