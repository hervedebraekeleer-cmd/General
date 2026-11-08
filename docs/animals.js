// Dieren: elke stap = uitleg + lijnen (viewBox 0..100). Kind trekt de stippellijn over.
const E=(cx,cy,rx,ry)=>`M${cx-rx} ${cy}a${rx} ${ry} 0 1 0 ${2*rx} 0a${rx} ${ry} 0 1 0 ${-2*rx} 0Z`;
const C=(cx,cy,r)=>E(cx,cy,r,r);
const STAR=(x,y,r)=>{let d='';for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,rr=i%2?r*.45:r;d+=(i?'L':'M')+(x+Math.cos(a)*rr).toFixed(1)+' '+(y+Math.sin(a)*rr).toFixed(1)}return d+'Z'};

const ANIMALS=[
{id:'vis',name:'Vis',emoji:'🐟',scene:'sea',steps:[
 {t:'Teken een grote ovaal. Dat is het lijf van de vis.',p:[E(50,50,28,18)]},
 {t:'Teken de staart: een driehoek aan de linkerkant.',p:['M23 50L5 33L5 67Z']},
 {t:'Teken een vin boven op de rug en een vin onder de buik.',p:['M40 33Q50 14 62 34','M44 67Q50 80 58 66']},
 {t:'Teken een rond oog en een kleine mond.',p:[C(66,45,3.5),'M78 51Q74 55 70 53']},
 {t:'Teken schubben: drie kleine boogjes.',p:['M40 45q6 5 0 10','M48 45q6 5 0 10','M56 45q6 5 0 10']},
 {t:'Teken luchtbelletjes bij de mond!',p:[C(86,40,3),C(90,30,2.5),C(85,20,4)]}]},
{id:'olifant',name:'Olifant',emoji:'🐘',scene:'meadow',steps:[
 {t:'Teken een grote ovaal. Dat is het lijf van de olifant.',p:[E(58,52,30,20)]},
 {t:'Teken een grote ronde cirkel links. Dat is het hoofd.',p:[C(28,46,15)]},
 {t:'Teken een lange slurf die naar beneden krult.',p:['M19 57C9 66 12 82 22 84C28 85 29 78 25 76C21 74 22 68 30 60']},
 {t:'Teken een groot oor, een oog en een slagtand.',p:[E(40,44,8,12),C(22,42,2),'M31 62Q38 68 34 74']},
 {t:'Teken vier dikke poten.',p:['M38 68V88H48V70','M50 71V90H60V72','M66 71V90H76V71','M78 68V88H86V64']},
 {t:'Teken een klein staartje achteraan.',p:['M88 50Q95 56 91 68']}]},
{id:'vogel',name:'Vogel',emoji:'🐦',scene:'sky',steps:[
 {t:'Teken een ovaal. Dat is het lijf van de vogel.',p:[E(45,55,25,16)]},
 {t:'Teken een ronde cirkel rechtsboven. Dat is het hoofd.',p:[C(72,42,11)]},
 {t:'Teken een snavel: een puntige driehoek.',p:['M82 39L96 44L82 48']},
 {t:'Teken een rond oog.',p:[C(75,40,2)]},
 {t:'Teken een vleugel op het lijf.',p:['M33 52Q42 28 62 46Q52 62 33 52Z']},
 {t:'Teken de staartveren achteraan.',p:['M21 52L4 44L7 56L4 66L22 62']},
 {t:'Teken twee pootjes met kleine voetjes.',p:['M43 71V84M38 84H50','M54 70V84M49 84H61']}]},
{id:'eenhoorn',name:'Eenhoorn',emoji:'🦄',scene:'magic',steps:[
 {t:'Teken een ovaal. Dat is het lijf van de eenhoorn.',p:[E(42,58,26,15)]},
 {t:'Teken twee schuine lijnen omhoog. Dat is de nek.',p:['M56 47L70 30','M68 54L80 35']},
 {t:'Teken een ovaal voor het hoofd.',p:[E(82,28,12,8)]},
 {t:'Teken de hoorn: een lange puntige driehoek. Daarna een oor en een oog.',p:['M83 21L93 1L90 23','M76 21L73 11L81 19',C(86,28,1.8)]},
 {t:'Teken een golvende manen langs de nek.',p:['M64 31Q54 34 60 40Q52 44 58 50']},
 {t:'Teken vier poten.',p:['M24 70V90H30V72','M34 72V90H40V73','M52 72V90H58V72','M60 68V90H66V66']},
 {t:'Teken een krullende staart.',p:['M16 52C4 52 4 66 10 76C12 66 18 64 19 60']},
 {t:'Teken een magische ster op het lijf!',p:[STAR(42,56,8)]}]},
{id:'fee',name:'Fee',emoji:'🧚',scene:'magic',steps:[
 {t:'Teken een cirkel bovenaan. Dat is het hoofd van de fee.',p:[C(50,20,9)]},
 {t:'Teken haar en een kroontje.',p:['M41 21Q40 7 50 8Q60 7 59 21','M59 21Q68 28 62 38','M43 8L45 2L48 6L50 0L52 6L55 2L57 8']},
 {t:'Teken een oog, nog een oog en een lachende mond.',p:[C(46,19,1.2),C(54,19,1.2),'M46 23Q50 26 54 23']},
 {t:'Teken een jurkje: een brede driehoek met een golvende onderkant.',p:['M50 30C46 45 38 58 33 68Q50 74 67 68C62 58 54 45 50 30Z']},
 {t:'Teken twee grote vleugels.',p:['M46 38C28 16 14 28 24 42C28 46 40 44 46 41','M54 38C72 16 86 28 76 42C72 46 60 44 54 41']},
 {t:'Teken twee armen. Een arm houdt een toverstokje vast.',p:['M47 40L32 54','M53 40L70 52','M70 52L86 40']},
 {t:'Teken een sterretje op het toverstokje!',p:[STAR(90,31,7)]},
 {t:'Teken twee beentjes met schoentjes.',p:['M44 70V86H38','M56 70V86H62']}]}
];
