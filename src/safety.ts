const patterns=[
 /хочу умереть/,
 /не хочу жить/,
 /уб(?:ью|ить|иваю) себя/,
 /поконч(?:ить|у|ил|ила) с собой/,
 /(?:причиню|причинить) себе вред/,
 /сделаю себе больно/,
 /порежу себя/,
 /суицид/,
 /убью (?:его|ее|человека|кого-то)/,
 /причиню вред (?:другим|кому-то)/
];
export function hasImmediateRisk(text:string){const normalized=text.toLocaleLowerCase('ru-RU').replaceAll('ё','е');return patterns.some(pattern=>pattern.test(normalized))}
