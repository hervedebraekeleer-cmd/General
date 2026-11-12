// Dieren: elke stap = uitleg + lijnen (viewBox 0..100). Kind trekt de stippellijn over.
const E=(cx,cy,rx,ry)=>`M${cx-rx} ${cy}a${rx} ${ry} 0 1 0 ${2*rx} 0a${rx} ${ry} 0 1 0 ${-2*rx} 0Z`;
const C=(cx,cy,r)=>E(cx,cy,r,r);
const STAR=(x,y,r)=>{let d='';for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,rr=i%2?r*.45:r;d+=(i?'L':'M')+(x+Math.cos(a)*rr).toFixed(1)+' '+(y+Math.sin(a)*rr).toFixed(1)}return d+'Z'};

const ANIMALS=[
{id:'vis',move:'swim',name:'Vis',emoji:'🐟',scene:'sea',steps:[
 {t:'Teken een grote ovaal. Dat is het lijf van de vis.',p:[E(50,50,28,18)]},
 {t:'Teken de staart: een driehoek aan de linkerkant.',p:['M23 50L5 33L5 67Z']},
 {t:'Teken een vin boven op de rug en een vin onder de buik.',p:['M40 33Q50 14 62 34','M44 67Q50 80 58 66']},
 {t:'Teken een rond oog en een kleine mond.',p:[C(66,45,3.5),'M78 51Q74 55 70 53']},
 {t:'Teken schubben: drie kleine boogjes.',p:['M40 45q6 5 0 10','M48 45q6 5 0 10','M56 45q6 5 0 10']},
 {t:'Teken luchtbelletjes bij de mond!',p:[C(86,40,3),C(90,30,2.5),C(85,20,4)]}]},
{id:'olifant',move:'walk',face:-1,name:'Olifant',emoji:'🐘',scene:'meadow',steps:[
 {t:'Teken een grote ovaal. Dat is het lijf van de olifant.',p:[E(58,52,30,20)]},
 {t:'Teken een grote ronde cirkel links. Dat is het hoofd.',p:[C(28,46,15)]},
 {t:'Teken een lange slurf die naar beneden krult.',p:['M19 57C9 66 12 82 22 84C28 85 29 78 25 76C21 74 22 68 30 60']},
 {t:'Teken een groot oor, een oog en een slagtand.',p:[E(40,44,8,12),C(22,42,2),'M31 62Q38 68 34 74']},
 {t:'Teken vier dikke poten.',p:['M38 68V88H48V70','M50 71V90H60V72','M66 71V90H76V71','M78 68V88H86V64']},
 {t:'Teken een klein staartje achteraan.',p:['M88 50Q95 56 91 68']}]},
{id:'vogel',move:'wing',name:'Vogel',emoji:'🐦',scene:'sky',steps:[
 {t:'Teken een ovaal. Dat is het lijf van de vogel.',p:[E(45,55,25,16)]},
 {t:'Teken een ronde cirkel rechtsboven. Dat is het hoofd.',p:[C(72,42,11)]},
 {t:'Teken een snavel: een puntige driehoek.',p:['M82 39L96 44L82 48']},
 {t:'Teken een rond oog.',p:[C(75,40,2)]},
 {t:'Teken een vleugel op het lijf.',p:['M33 52Q42 28 62 46Q52 62 33 52Z']},
 {t:'Teken de staartveren achteraan.',p:['M21 52L4 44L7 56L4 66L22 62']},
 {t:'Teken twee pootjes met kleine voetjes.',p:['M43 71V84M38 84H50','M54 70V84M49 84H61']}]},
{id:'eenhoorn',move:'walk',name:'Eenhoorn',emoji:'🦄',scene:'magic',steps:[
 {t:'Teken een ovaal. Dat is het lijf van de eenhoorn.',p:[E(42,58,26,15)]},
 {t:'Teken twee schuine lijnen omhoog. Dat is de nek.',p:['M56 47L70 30','M68 54L80 35']},
 {t:'Teken een ovaal voor het hoofd.',p:[E(82,28,12,8)]},
 {t:'Teken de hoorn: een lange puntige driehoek. Daarna een oor en een oog.',p:['M83 21L93 1L90 23','M76 21L73 11L81 19',C(86,28,1.8)]},
 {t:'Teken een golvende manen langs de nek.',p:['M64 31Q54 34 60 40Q52 44 58 50']},
 {t:'Teken vier poten.',p:['M24 70V90H30V72','M34 72V90H40V73','M52 72V90H58V72','M60 68V90H66V66']},
 {t:'Teken een krullende staart.',p:['M16 52C4 52 4 66 10 76C12 66 18 64 19 60']},
 {t:'Teken een magische ster op het lijf!',p:[STAR(42,56,8)]}]},
{id:'fee',sh:[3,0],move:'flap',name:'Fee',emoji:'🧚',scene:'magic',steps:[
 {t:'Teken een cirkel bovenaan. Dat is het hoofd van de fee.',p:[C(50,20,9)]},
 {t:'Teken haar en een kroontje.',p:['M41 21Q40 7 50 8Q60 7 59 21','M59 21Q68 28 62 38','M43 8L45 2L48 6L50 0L52 6L55 2L57 8']},
 {t:'Teken een oog, nog een oog en een lachende mond.',p:[C(46,19,1.2),C(54,19,1.2),'M46 23Q50 26 54 23']},
 {t:'Teken een jurkje: een brede driehoek met een golvende onderkant.',p:['M50 30C46 45 38 58 33 68Q50 74 67 68C62 58 54 45 50 30Z']},
 {t:'Teken twee grote vleugels.',p:['M46 38C28 16 14 28 24 42C28 46 40 44 46 41','M54 38C72 16 86 28 76 42C72 46 60 44 54 41']},
 {t:'Teken twee armen. Een arm houdt een toverstokje vast.',p:['M47 40L32 54','M53 40L70 52','M70 52L86 40']},
 {t:'Teken een sterretje op het toverstokje!',p:[STAR(90,31,7)]},
 {t:'Teken twee beentjes met schoentjes.',p:['M44 70V86H38','M56 70V86H62']}]}
,{id:'kat',sh:[4,0],move:'walk',name:'Kat',emoji:'🐱',scene:'meadow',steps:[
 {t:'Teken een grote ronde ovaal. Dat is het hoofd van de kat.',p:[E(50,36,22,19)]},
 {t:'Teken twee puntige oren bovenop.',p:['M32 24L30 8L44 18','M68 24L70 8L56 18']},
 {t:'Teken twee ogen en een klein neusje.',p:[C(42,34,3),C(58,34,3),'M47 41L53 41L50 45Z']},
 {t:'Teken de mond en zes snorharen.',p:['M50 45Q46 50 42 47','M50 45Q54 50 58 47','M30 40L16 37','M30 45L16 47','M70 40L84 37','M70 45L84 47']},
 {t:'Teken het lijf onder het hoofd.',p:['M36 54C26 70 26 92 40 94H60C74 92 74 70 64 54']},
 {t:'Teken een lange krullende staart.',p:['M72 86C92 86 92 62 82 58']},
 {t:'Teken drie streepjes op het voorhoofd.',p:['M50 18V25','M43 19L44 25','M57 19L56 25']}]},
{id:'vlinder',sh:[1,0],move:'flap',name:'Vlinder',emoji:'🦋',scene:'sky',steps:[
 {t:'Teken een lang smal ovaaltje in het midden. Dat is het lijfje.',p:[E(50,50,3.5,20)]},
 {t:'Teken twee grote vleugels bovenaan.',p:['M47 42C30 10 6 20 12 42C14 52 36 52 47 46','M53 42C70 10 94 20 88 42C86 52 64 52 53 46']},
 {t:'Teken twee kleinere vleugels onderaan.',p:['M47 52C30 54 14 64 22 80C30 90 44 76 47 60','M53 52C70 54 86 64 78 80C70 90 56 76 53 60']},
 {t:'Teken een klein rond hoofdje met twee voelsprieten.',p:[C(50,29,4.5),'M48 26Q42 16 34 12','M52 26Q58 16 66 12']},
 {t:'Teken stippen op de vleugels!',p:[C(26,32,5),C(74,32,5),C(30,70,4),C(70,70,4)]}]},
{id:'konijn',sh:[4,0],move:'walk',name:'Konijn',emoji:'🐰',scene:'meadow',steps:[
 {t:'Teken een brede ovaal. Dat is het hoofd van het konijn.',p:[E(50,50,20,17)]},
 {t:'Teken twee heel lange oren.',p:[E(40,20,6,16),E(60,20,6,16)]},
 {t:'Teken twee ogen, een neusje en een mondje.',p:[C(43,47,2.5),C(57,47,2.5),'M47 54L53 54L50 58Z','M50 58V61','M50 61Q46 64 43 62','M50 61Q54 64 57 62']},
 {t:'Teken snorharen.',p:['M30 54L16 52','M30 58L16 60','M70 54L84 52','M70 58L84 60']},
 {t:'Teken een dik ovaal lijf onder het hoofd.',p:[E(50,80,22,16)]},
 {t:'Teken twee voetjes.',p:[E(38,93,8,4),E(62,93,8,4)]}]},
{id:'schildpad',move:'walk',face:-1,name:'Schildpad',emoji:'🐢',scene:'sea',steps:[
 {t:'Teken een halve bol. Dat is het harde schild.',p:['M20 62C20 28 80 28 80 62Z']},
 {t:'Teken een patroon op het schild.',p:['M50 33L42 46L58 46Z','M42 46L36 62','M58 46L64 62']},
 {t:'Teken een rond hoofd links.',p:[C(14,56,9)]},
 {t:'Teken een oog en een lachende mond.',p:[C(11,54,1.6),'M7 60Q11 63 15 60']},
 {t:'Teken twee dikke pootjes.',p:['M30 62V74H40V62','M62 62V74H72V62']},
 {t:'Teken een klein staartje.',p:['M80 60L90 62L80 66']}]},
{id:'zeemeermin',sh:[5,0],move:'swimV',name:'Zeemeermin',emoji:'🧜‍♀️',scene:'sea',steps:[
 {t:'Teken een cirkel bovenaan. Dat is het hoofd.',p:[C(50,18,9)]},
 {t:'Teken lang, golvend haar.',p:['M41 18Q38 8 50 8Q62 8 59 18','M41 18Q34 36 40 50','M59 18Q66 36 60 50']},
 {t:'Teken twee ogen en een lachende mond.',p:[C(46,17,1.2),C(54,17,1.2),'M46 21Q50 24 54 21']},
 {t:'Teken het lijf en twee armen.',p:['M44 28C42 40 44 46 46 54H54C56 46 58 40 56 28Z','M44 31L32 44','M56 31L68 44']},
 {t:'Teken schelpen als bovenstukje.',p:['M44 36Q47 42 50 36Q53 42 56 36']},
 {t:'Teken een lange visstaart.',p:['M46 54C42 66 46 78 50 86C54 78 58 66 54 54']},
 {t:'Teken de staartvin onderaan.',p:['M50 86L34 98L48 94L50 98L52 94L66 98Z']},
 {t:'Teken luchtbelletjes in het water!',p:[C(78,40,3),C(84,30,4),C(74,24,2.5)]}]},
{id:'uil',move:'flap',name:'Uil',emoji:'🦉',scene:'magic',steps:[
 {t:'Teken een grote ovaal. Dat is het lijf van de uil.',p:[E(50,55,28,34)]},
 {t:'Teken twee puntige oortjes bovenaan.',p:['M28 28L24 12L40 22','M72 28L76 12L60 22']},
 {t:'Teken twee grote ronde ogen.',p:[C(38,42,10),C(62,42,10)]},
 {t:'Teken zwarte pupillen in de ogen.',p:[C(38,42,4),C(62,42,4)]},
 {t:'Teken een kleine snavel: een driehoekje.',p:['M45 52L55 52L50 62Z']},
 {t:'Teken twee vleugels opzij.',p:['M24 52C14 66 20 82 32 84','M76 52C86 66 80 82 68 84']},
 {t:'Teken veertjes op de buik.',p:['M40 70q5 5 10 0q5 5 10 0','M40 78q5 5 10 0q5 5 10 0']},
 {t:'Teken twee pootjes.',p:['M43 89V96','M57 89V96']}]}
,{id:'draak',move:'wing',name:'Draak',emoji:'🐉',scene:'sky',steps:[
 {t:'Teken een grote ovaal. Dat is het lijf van de draak.',p:[E(45,62,26,16)]},
 {t:'Teken twee schuine lijnen omhoog voor de nek, en een ovaal voor het hoofd.',p:['M58 50L70 36','M68 62L82 42',E(80,32,12,8)]},
 {t:'Teken twee hoorntjes en een oog.',p:['M74 25L72 14L80 23','M84 24L88 13L90 26',C(84,31,2)]},
 {t:'Teken vuur uit de neus!',p:['M92 33L99 29L96 35L100 39L93 38']},
 {t:'Teken een grote vleugel met punten.',p:['M34 50L28 24L42 34L48 18L56 36L52 50']},
 {t:'Teken twee poten.',p:['M30 74V90H40V76','M54 76V90H64V74']},
 {t:'Teken een lange staart met een puntje.',p:['M20 60C6 62 4 78 8 88L14 80L18 90L24 72']},
 {t:'Teken puntjes op de rug.',p:['M30 48L34 41L38 47','M40 47L44 40L48 46']}]},
{id:'pinguin',move:'walk',name:'Pinguïn',emoji:'🐧',scene:'sea',steps:[
 {t:'Teken een grote ovaal. Dat is het lijf van de pinguïn.',p:[E(50,62,26,30)]},
 {t:'Teken een ronde cirkel bovenaan. Dat is het hoofd.',p:[C(50,28,15)]},
 {t:'Teken een witte buik: een kleinere ovaal in het lijf.',p:[E(50,68,16,22)]},
 {t:'Teken twee ogen en een snaveltje.',p:[C(44,26,2.5),C(56,26,2.5),'M44 32L56 32L50 40Z']},
 {t:'Teken twee vleugels opzij.',p:['M24 52C14 64 18 78 28 80','M76 52C86 64 82 78 72 80']},
 {t:'Teken twee platte voetjes.',p:['M34 93L44 93L39 98Z','M56 93L66 93L61 98Z']}]},
{id:'regenboog',sh:[4,0],move:'wave',name:'Regenboog',emoji:'🌈',scene:'magic',steps:[
 {t:'Teken een grote boog. Dat is de buitenste kleur.',p:['M10 80A40 40 0 0 1 90 80']},
 {t:'Teken een tweede boog net onder de eerste.',p:['M18 80A32 32 0 0 1 82 80']},
 {t:'Teken een derde boog.',p:['M26 80A24 24 0 0 1 74 80']},
 {t:'Teken een kleine vierde boog binnenin.',p:['M34 80A16 16 0 0 1 66 80']},
 {t:'Teken aan elk eind van de regenboog een wolkje.',p:['M8 90C4 82 14 76 20 80C22 72 34 72 36 80C42 80 44 90 36 90Z','M64 90C60 82 70 76 76 80C78 72 90 72 92 80C98 80 100 90 92 90Z']},
 {t:'Teken een zon met stralen.',p:[C(50,18,7),...Array.from({length:8},(_,i)=>{const a=i*Math.PI/4,f=(r)=>`${(50+Math.cos(a)*r).toFixed(1)} ${(18+Math.sin(a)*r).toFixed(1)}`;return `M${f(10)}L${f(15)}`})]}]},
{id:'kasteel',move:'float',name:'Kasteel',emoji:'🏰',scene:'magic',steps:[
 {t:'Teken een grote rechthoek. Dat is het midden van het kasteel.',p:['M28 90V46H72V90Z']},
 {t:'Teken links en rechts een smalle toren.',p:['M12 90V58H28','M72 58H88V90','M12 90H28','M72 90H88']},
 {t:'Teken drie puntdaken.',p:['M8 58L20 36L32 58','M68 58L80 36L92 58','M24 46L50 16L76 46']},
 {t:'Teken een deur met een ronde boog.',p:['M42 90V74Q50 62 58 74V90']},
 {t:'Teken drie ramen.',p:[C(20,70,2.5),C(80,70,2.5),C(50,54,4)]},
 {t:'Teken een vlag bovenaan!',p:['M50 16V4L60 8L50 12']}]},
{id:'giraf',move:'walk',name:'Giraf',emoji:'🦒',scene:'meadow',steps:[
 {t:'Teken een ovaal. Dat is het lijf van de giraf.',p:[E(42,66,24,14)]},
 {t:'Teken een heel lange nek: twee schuine lijnen omhoog.',p:['M54 56L62 24','M66 60L76 24']},
 {t:'Teken een ovaal hoofd bovenaan.',p:[E(72,18,10,7)]},
 {t:'Teken twee hoorntjes, een oor en een oog.',p:['M68 11L67 3','M76 11L77 3','M63 17L56 14L62 21',C(75,17,1.5)]},
 {t:'Teken vier lange poten.',p:['M26 76V98H31V78','M34 78V96H39V79','M50 78V98H55V77','M58 74V96H63V72']},
 {t:'Teken een staartje.',p:['M18 62Q10 66 12 78']},
 {t:'Teken vlekken op het lijf en de nek!',p:[C(36,64,3),C(48,70,3),C(40,74,2.5),C(64,38,2.5),C(62,48,2.5)]}]},
{id:'dolfijn',move:'swim',name:'Dolfijn',emoji:'🐬',scene:'sea',steps:[
 {t:'Teken een lange, gebogen vorm met een puntige snuit. Dat is de dolfijn.',p:['M6 62C14 34 56 24 80 38L97 44L82 49C70 56 62 70 48 74C32 80 14 76 6 62Z']},
 {t:'Teken een rugvin bovenop.',p:['M42 36L38 21L58 33']},
 {t:'Teken de staart: twee puntjes links.',p:['M7 63L0 50L13 58','M7 63L0 78L13 70']},
 {t:'Teken een vin onder het lijf.',p:['M50 70L44 86L62 74']},
 {t:'Teken een oog en een lach.',p:[C(76,40,1.8),'M82 47Q90 48 96 45']},
 {t:'Teken golven onder de dolfijn.',p:['M10 94Q20 86 30 94T50 94T70 94T90 94']}]}
];
