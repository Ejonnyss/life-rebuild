import type {Area, History, State} from './engine';

export type GoalId = 'steady'|'role'|'network'|'client'|'money'|'movement'|'finish'|'connection';
export type Barrier = 'unclear'|'large'|'worry'|'energy'|'time';
export type Journey = {goals:GoalId[];reason:string;desiredResult?:string;barrier:Barrier;createdAt:string};
export type Milestone = {mission:string;title:string;purpose:string;signal:string};
export type Goal = {id:GoalId;area:Area;title:string;result:string;steps:Milestone[]};

export const barriers:Record<Barrier,{label:string;help:string}>={
 unclear:{label:'Неясно, с чего начать',help:'В миссии будет указан первый предмет или экран, который нужно открыть.'},
 large:{label:'Задача кажется слишком большой',help:'Можно уменьшить действие до подготовки без потери уже сделанного.'},
 worry:{label:'Тревожно браться',help:'Первый шаг остаётся под твоим контролем. Ответ другого человека не считается условием успеха.'},
 energy:{label:'Мало сил',help:'Можно выбрать короткий шаг и вернуться к основному позже.'},
 time:{label:'Мало времени',help:'План предлагает действие, которое помещается в доступное окно.'}
};

export const goals:Record<GoalId,Goal>={
 steady:{id:'steady',area:'base',title:'Больше опоры в обычном дне',result:'Подготовлены еда, завтрашнее утро и вечерний переход ко сну.',steps:[
  {mission:'base_food',title:'Еда без лишних решений',purpose:'Голод и необходимость срочно придумывать еду мешают другим делам. Сначала проверяем, есть ли простой доступный вариант.',signal:'Ты выбрал и собрал еду; если сил хватило только проверить запасы, это подготовка, а не готовая еда.'},
  {mission:'base_tomorrow',title:'Одно решение на завтра уже принято',purpose:'Маленькая подготовка вечером снижает число решений утром.',signal:'Одна конкретная вещь для утра лежит там, где ты её найдёшь.'},
  {mission:'base_sleep',title:'Спокойный переход ко сну',purpose:'Дело не в идеальном режиме. Задача — убрать один помеху перед сном.',signal:'Ты сделал одно выбранное действие для вечера.'}
 ]},
 role:{id:'role',area:'career',title:'Найти подходящую работу',result:'Есть критерии роли, проверенная вакансия, рабочий пример и один уместный контакт.',steps:[
  {mission:'career_direction',title:'Определить подходящую роль',purpose:'Без критериев легко тратить силы на вакансии, которые не подходят.',signal:'Записаны тип роли и два обязательных условия.'},
  {mission:'career_vacancy',title:'Проверить одну вакансию',purpose:'Сравниваем реальные требования со своими критериями до отклика.',signal:'Вакансия сохранена для дальнейшего шага или осознанно отклонена.'},
  {mission:'career_case',title:'Подготовить рабочий пример',purpose:'Конкретный пример пригодится в разговоре и при адаптации резюме.',signal:'Коротко записаны ситуация, твоё действие и фактический результат.'},
  {mission:'career_contact',title:'Открыть профессиональный разговор',purpose:'Один уместный контакт добавляет канал поиска помимо откликов на сайте.',signal:'Сообщение отправлено. Ответ другого человека не требуется для завершения шага.'}
 ]},
 network:{id:'network',area:'career',title:'Проверить путь через контакты',result:'Выбрана роль, составлена короткая формулировка и начат один профессиональный разговор.',steps:[
  {mission:'career_direction',title:'Сформулировать направление',purpose:'Человеку проще помочь, когда понятно, какие роли тебе подходят.',signal:'Записаны тип роли и два условия.'},
  {mission:'career_network',title:'Выбрать уместный контакт',purpose:'Сначала проверяем, кому и с какой просьбой действительно уместно написать.',signal:'Выбран один человек и цель сообщения.'},
  {mission:'career_contact',title:'Написать',purpose:'Короткое конкретное сообщение позволяет проверить канал без массовой рассылки.',signal:'Сообщение отправлено.'}
 ]},
 client:{id:'client',area:'contracts',title:'Продвинуть оплачиваемый проект',result:'Актуальный статус понятен, следующее действие сделано, договорённость не потерялась.',steps:[
  {mission:'contract_audit',title:'Проверить статус',purpose:'Сначала отделяем актуальную договорённость от старой задачи.',signal:'Известно, чего ждёшь ты или клиент и какой следующий шаг зависит от тебя.'},
  {mission:'contract_step',title:'Сделать согласованный шаг',purpose:'Движение проекта — это конкретный результат для клиента, а не открытая папка.',signal:'Отправлен или завершён один заранее согласованный материал.'},
  {mission:'contract_followup',title:'Уточнить зависший ответ',purpose:'Если следующий ход у другого человека, одно уместное уточнение снимает неопределённость.',signal:'Отправлен вопрос о статусе или принято решение, что напоминание пока неуместно.'}
 ]},
 money:{id:'money',area:'contracts',title:'Понять ближайшие деньги',result:'Фактические суммы и ожидаемые поступления разделены; выбран один управляемый шаг.',steps:[
  {mission:'contract_money',title:'Разделить факты и ожидания',purpose:'Ожидаемая оплата ещё не получена. Разделение помогает не опираться на неё как на факт.',signal:'В инструменте записана хотя бы одна проверенная сумма или подтверждено, что данных пока нет.'},
  {mission:'contract_audit',title:'Проверить источник дохода',purpose:'Выбираем действующий проект или другую реальную возможность, а не старую задачу.',signal:'Зафиксирован текущий статус одной возможности.'},
  {mission:'contract_step',title:'Сделать следующее действие',purpose:'От анализа переходим к одному действию, которое действительно может сдвинуть оплату.',signal:'Согласованное действие выполнено; получение денег учитывается только отдельно.'}
 ]},
 movement:{id:'movement',area:'body',title:'Вернуть посильное движение',result:'Подготовка сделана, одна прогулка состоялась, следующий удобный момент выбран.',steps:[
  {mission:'body_prepare',title:'Снизить порог выхода',purpose:'Когда вещи уже под рукой, начать движение проще.',signal:'Одежда или обувь готовы.'},
  {mission:'body_walk',title:'Выйти на прогулку',purpose:'Короткий выход даёт реальное движение без требования тренироваться идеально.',signal:'Прогулка состоялась; даже пять минут можно отметить как уменьшенный шаг.'},
  {mission:'body_repeat',title:'Найти следующий удобный момент',purpose:'Разовое действие превращается в доступный маршрут, когда понятен следующий удобный случай.',signal:'Выбран один реалистичный момент для следующего выхода.'}
 ]},
 finish:{id:'finish',area:'studio',title:'Довести начатое до готового материала',result:'Выбран один материал, закрыт его ближайший недоделанный этап и проверен итоговый файл.',steps:[
  {mission:'studio_select',title:'Выбрать один материал',purpose:'Если одновременно открыто много работ, завершение теряется. Берём тот, что ближе всего к готовности.',signal:'Назван один материал и одна недоделанная часть.'},
  {mission:'studio_finish',title:'Закрыть одну недоделанную часть',purpose:'Один законченный фрагмент ценнее нового проекта без результата.',signal:'Конкретная часть завершена и сохранена.'},
  {mission:'studio_ready',title:'Проверить готовый файл',purpose:'Перед публикацией полезно убедиться, что итоговый материал открывается и выглядит как задумано.',signal:'Итоговый файл проверен; решение о публикации остаётся за тобой.'}
 ]},
 connection:{id:'connection',area:'life',title:'Оставить место для близких и жизни вне дел',result:'Есть одна приятная идея и удобный момент, о котором можно договориться без отчётности.',steps:[
  {mission:'life_idea',title:'Выбрать приятную идею',purpose:'Жизнь вне задач легче не откладывать, когда есть конкретная простая идея.',signal:'Записана одна идея без обязательства её выполнить.'},
  {mission:'life_invite',title:'Предложить удобный вариант',purpose:'Вместо абстрактного «надо встретиться» появляется предложение, которое другой человек может принять или изменить.',signal:'Предложение отправлено; ответ не зависит от тебя.'},
  {mission:'life_plan',title:'Договориться о следующем шаге',purpose:'План остаётся гибким: время и желание другого человека важнее графика игры.',signal:'Есть взаимная договорённость или решение пока не планировать.'}
 ]}
};

export const goalOptions=Object.values(goals);
export function stepStatus(history:History[],journey:Journey,mission:string):'done'|'skipped'|'open'{
 const relevant=history.filter(h=>h.id===mission&&h.at>=journey.createdAt);
 if(relevant.some(h=>h.status==='done'&&!h.small))return 'done';
 if(relevant.some(h=>h.status==='obsolete'))return 'skipped';
 return 'open';
}
export function nextStep(state:State,id:GoalId){
 const journey=state.journey;if(!journey)return null;
 return goals[id].steps.find(step=>stepStatus(state.history,journey,step.mission)==='open')??null;
}
export function goalProgress(state:State,id:GoalId){
 const journey=state.journey;if(!journey)return {done:0,total:goals[id].steps.length,skipped:0};
 const statuses=goals[id].steps.map(step=>stepStatus(state.history,journey,step.mission));
 return {done:statuses.filter(x=>x==='done').length,total:statuses.length,skipped:statuses.filter(x=>x==='skipped').length};
}
export function missionContext(state:State,missionId:string){
 const id=state.journey?.goals.find(id=>goals[id].steps.some(step=>step.mission===missionId));
 if(!id)return null;
 const goal=goals[id];const index=goal.steps.findIndex(step=>step.mission===missionId);
 return {goal,step:goal.steps[index],index};
}
