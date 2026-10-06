const KEY="good-v1";let db=JSON.parse(localStorage.getItem(KEY)||'{"days":{},"longest":0}');
const key=()=>new Date().toISOString().slice(0,10);
function day(k=key()){if(!db.days[k])db.days[k]={tasks:[]};return db.days[k]}
function save(){localStorage.setItem(KEY,JSON.stringify(db))}
function complete(k){let d=db.days[k];return !!d&&d.tasks.length>0&&d.tasks.every(x=>x.done)}
function esc(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]))}
function render(){
 let d=day(),box=document.querySelector("#tasks");box.innerHTML="";
 document.querySelector("#today").textContent=new Date().toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"});
 d.tasks.forEach((t,i)=>{let r=document.createElement("div");r.className="task"+(t.done?" done":"");r.innerHTML=`<input type="checkbox" ${t.done?"checked":""}><label>${esc(t.text)}</label><button class="delete">×</button>`;r.querySelector("input").onchange=e=>{t.done=e.target.checked;save();render()};r.querySelector(".delete").onclick=()=>{d.tasks.splice(i,1);save();render()};box.appendChild(r)});
 let n=d.tasks.length,done=d.tasks.filter(x=>x.done).length;
 document.querySelector("#count").textContent=`${done} / ${n}`;document.querySelector("#bar").style.width=n?done/n*100+"%":"0%";
 document.querySelector("#message").textContent=!n?"Add your first task.":done===n?"🎉 All done! Your streak counts for today.":`${n-done} task${n-done===1?"":"s"} left.`;
 let cur=new Date(),s=0;while(complete(cur.toISOString().slice(0,10))){s++;cur.setDate(cur.getDate()-1)}
 db.longest=Math.max(db.longest||0,s);
 document.querySelector("#streak").textContent=s;document.querySelector("#longest").textContent=db.longest;
 let keys=Object.keys(db.days).filter(complete).sort();document.querySelector("#days").textContent=keys.length;
 let h=document.querySelector("#history");h.innerHTML=keys.length?keys.slice(-7).reverse().map(k=>`<div class="history"><span>${new Date(k+"T12:00:00").toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric"})}</span><b>✓ Complete</b></div>`).join(""):'<div class="empty">No completed days yet.</div>';
 save();
}
document.querySelector("#add").onsubmit=e=>{e.preventDefault();let x=document.querySelector("#input"),v=x.value.trim();if(v){day().tasks.push({text:v,done:false});x.value="";save();render();x.focus()}};render();