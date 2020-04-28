const baseDate="2020-02-29",baseEventURL="/api/user/v1/events",graphURL="/api/user/v1/timeline",streamURL="/api/user/v1/stream",summaryURL="/api/user/v1/summary",globalStatURL="https://api.thevirustracker.com/free-api?global=stats",currentDate=moment().format("YYYY-MM-DD"),dateParser=e=>moment(e).format("LLLL"),createProgressBar=(e,t,a)=>{let r=Math.round(100*e/t);return`\n    <div class="progress-bar ${a}" role="progressbar" style="width: ${r}%;" aria-valuenow="${r}" aria-valuemin="0" aria-valuemax="100">${r}%</div>`},createSummary=e=>{return`\n    <div class="card-body">\n    <div style="font-size:13px; color:#999; margin-top:5px; text-align:center">Last updated: <span id="update-time">${dateParser(e.date)}</span> </div>\n    <div id="maincounter-wrap">\n        <h1>Coronavirus Cases:</h1>\n        <div class="maincounter-number" >\n        <span style="color:rgba(0, 181, 204, 0.7)">${e.totalcases} </span>\n        </div>\n    </div>\n    <div id="maincounter-wrap">\n        <h1>Deaths:</h1>\n        <div class="maincounter-number" style="color:rgb(207, 30, 30) ">\n        <span >${e.deaths}</span>\n        </div>\n    </div>\n    <div id="maincounter-wrap">\n        <h1>Recovered:</h1>\n        <div class="maincounter-number" style="color:#8ACA2B ">\n        <span>${e.discharged}</span>\n        </div>\n    </div>\n    <div id="maincounter-wrap">\n        <h1>Tests:</h1>\n        <div class="maincounter-number" style="color:#8ACA2B ">\n        <span style="color:#aaa">${e.test}</span>\n        </div>\n    </div>\n    `},totalDataLabel=(e,t,a)=>`<p>Active: <span class="activecase">${e}</span>    Recovered: <span class="recovery">${t}</span>   Dead: <span class="deaths">${a}</span></p>`,outcomeDataLabel=(e,t)=>`<p>Recovered: <span class="recovery">${e}</span>    Dead: <span class="deaths">${t}</span></p>`,globalRender=(e,t,a)=>(html=`\n            <div class="row pt-1 font-weight-bold">\n                <div class="col">\n                    Global Report:\n                </div>\n                <div class="col">\n                    Confirmed: <span style="color:rgba(0, 181, 204, 0.7);">${e}</span>\n                </div>\n                <div class="col">\n                    Deaths: <span class="deaths">${t}</span>\n                </div>\n                <div class="col">\n                    Recovered: <span class="recovery">${a}</span>\n                </div>\n            </div>\n        `,html),prevDayCheck=e=>moment(e).isAfter(baseDate),nextDayCheck=e=>moment(e).isBefore(currentDate),percentageCalc=(e,t)=>{if(0==e)return 0;return`+${e} (${Math.round(100*e/t)}%)`},urlGen=e=>{return(e=moment(e)).isSame(currentDate)?baseEventURL:`${baseEventURL}/${e.format("YYYY-MM-DD")}`},arrayGenerator=e=>(dataSet1=[],dataSet2=[],dataSet3=[],dataSet4=[],e.forEach(e=>{e.totalcases>0&&(dataSet1.push(e.totalcases),dataSet2.push(e.discharged),dataSet3.push(e.deaths),dataSet4.push(moment(e.date).format("YYYY-MM-DD")))}),{dataSet1:dataSet1,dataSet2:dataSet2,dataSet3:dataSet3,dataSet4:dataSet4});$(document).ready(function(){const e=document.getElementById("summary-card"),t=document.getElementById("recovery-progress"),a=document.getElementById("fatality-rate"),r=document.getElementById("previousDate"),n=document.getElementById("nextDate"),s=document.getElementById("donut-total"),o=document.getElementById("donut-outcome"),d=document.getElementById("myChart"),l=document.getElementById("searchDate"),c=document.getElementById("tData-label"),i=document.getElementById("outcomelabel"),u=document.getElementById("globalstats"),m=document.getElementById("progress-totalcases"),p=document.getElementById("progress-totaltest");$("#datepicker").datepicker({dateFormat:"yy-mm-dd",minDate:baseDate,maxDate:currentDate,defaultDate:currentDate}),fetch(summaryURL).then(e=>e.json()).then(t=>{if("success"==t.status){let{activecases:a,discharged:r,totalcases:n,deaths:d}=t.data,l=createSummary(t.data);e.innerHTML=l,s.style.display="block",o.style.display="block",y([a,r,d]),c.innerHTML=totalDataLabel(a,r,d),b([r,d]),i.innerHTML=outcomeDataLabel(r,d)}}).catch(e=>console.error(e));r.addEventListener("click",e=>{e.preventDefault();let t=$("#datepicker").val();if(!prevDayCheck(t))return;let a=moment(t).subtract(1,"day");v(a)}),n.addEventListener("click",e=>{e.preventDefault();let t=$("#datepicker").val();if(!nextDayCheck(t))return;let a=moment(t).add(1,"day");v(a)}),l.addEventListener("click",e=>{e.preventDefault();let t=$("#datepicker").val();eventURL=urlGen(t),D(eventURL)});const v=e=>{date=moment(e),date.isSame(baseDate)?r.style.opacity=.1:r.removeAttribute("style"),date.isSame(currentDate)?n.style.opacity=.1:n.removeAttribute("style"),date=moment(e).format("YYYY-MM-DD"),$("#datepicker").val(date)},g={language:{searchPlaceholder:"Search State",search:""},columns:[{data:null,render:function(e,t){return e.name}},{data:null,render:function(e,t){return e.totalcases}},{data:null,render:function(e,t){return percentageCalc(e.changetotal,e.totalcases)}},{data:null,render:function(e,t){return e.discharged}},{data:null,render:function(e,t){return percentageCalc(e.changedischarged,e.discharged)}},{data:null,render:function(e,t){return e.deaths}},{data:null,render:function(e,t){return percentageCalc(e.changedeaths,e.deaths)}},{data:null,render:function(e,t){return e.activecases}},{data:null,render:function(e,t){return e.changeactive}}],paging:!1,responsive:!0,fixedHeader:!0,order:[[1,"desc"]],columnDefs:[{responsivePriority:1,targets:0},{responsivePriority:2,targets:1},{responsivePriority:3,targets:3},{responsivePriority:4,targets:5},{responsivePriority:10001,targets:[2,4,6,8]},{type:"natural",targets:[2,4,6]},{className:"recovery",targets:[3,4]},{className:"deaths",targets:[5,6]},{className:"activecase",targets:[7,8]},{searchable:!1,targets:[1,2,3,4,5,6,7,8]}]},h=$("#stat-table").DataTable(g),y=e=>{new Chart(s,{type:"doughnut",data:{labels:["ACTIVE","RECOVERED","DEAD"],datasets:[{label:"# of Cases",data:e,backgroundColor:["rgba(245, 215, 110, 0.7)","rgba(123, 239, 178, 0.7)","rgba(255, 99, 132, 0.7)"],borderColor:["rgba(245, 215, 110, 1)","rgba(123, 239, 178, 1)","rgba(255,99,132,1)"],borderWidth:1}]},options:{responsive:!0,title:{display:!0,position:"top",text:"Totals Chart",fontSize:18,fontColor:"#FFFFFF"},legend:{display:!0,labels:{fontColor:"#FFFFFF"}}}})},b=e=>{new Chart(o,{type:"doughnut",data:{labels:["RECOVERED","DEAD"],datasets:[{label:"# of Outcomes",data:e,backgroundColor:["rgba(123, 239, 178, 0.7)","rgba(255, 99, 132, 0.7)"],borderColor:["rgba(123, 239, 178, 1)","rgba(255,99,132,1)"],borderWidth:1}]},options:{responsive:!0,title:{display:!0,position:"top",text:"Outcomes Chart",fontSize:18,fontColor:"#FFFFFF"},legend:{display:!0,labels:{fontColor:"#FFFFFF"}}}})};fetch(graphURL).then(e=>e.json()).then(e=>{if("success"==e.status){datasets=arrayGenerator(e.data);const{dataSet1:t,dataSet2:a,dataSet3:r,dataSet4:n}=datasets;d.style.display="block",((e,t,a,r)=>{new Chart(d,{type:"line",data:{labels:r.reverse(),datasets:[{data:e.reverse(),label:"Total Cases",borderColor:"rgba(0, 181, 204, 0.7)",fill:!0},{data:t.reverse(),label:"Recovery",borderColor:"rgba(123, 239, 178, 0.7)",fill:!0},{data:a.reverse(),label:"Deaths",borderColor:"rgba(255, 99, 132, 0.7)",fill:!0}]},options:{responsive:!0,title:{display:!0,text:"Average Cases Per Week",fontSize:18,fontColor:"#FFFFFF"},legend:{display:!0,labels:{fontColor:"#FFFFFF"}},scales:{xAxes:[{ticks:{fontColor:"#FFFFFF"}}],yAxes:[{ticks:{fontColor:"#FFFFFF"}}]}}})})(t,a,r,n)}}).catch(e=>console.error(e));const f=e=>{const{discharged:r,totalcases:n,deaths:s,test:o}=e;let d=createProgressBar(r,n,"bg-recovery"),l=createProgressBar(s,n,"bg-fatality");t.innerHTML=d,a.innerHTML=l,m.innerText=n,p.innerText=o},D=e=>{fetch(e).then(e=>e.json()).then(t=>{if("success"==t.status){const{summary:a,data:r}=t.data;let n=e==baseEventURL?currentDate:r[0].date;f(a),v(n),h.clear(),h.rows.add(r).draw()}}).catch(e=>console.error(e))};fetch(globalStatURL).then(e=>e.json()).then(e=>{if("ok"!=e.stat)return;const{total_cases:t,total_recovered:a,total_deaths:r}=e.results[0];u.innerHTML=globalRender(t,a,r)}).catch(e=>console.error(e)),D(baseEventURL),source=new EventSource(streamURL),source.onopen=function(e){console.info("Connected for Streaming Events")},source.addEventListener("event",function(t){const{summary:a,data:r}=JSON.parse(t.data);updatedSum=createSummary(a),e.innerHTML=updatedSum,f(a),h.clear(),h.rows.add(r),h.draw()},!1),source.onerror=function(e){console.error(e)}});