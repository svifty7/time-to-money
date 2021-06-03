(function(t){function e(e){for(var i,o,u=e[0],s=e[1],c=e[2],d=0,m=[];d<u.length;d++)o=u[d],Object.prototype.hasOwnProperty.call(a,o)&&a[o]&&m.push(a[o][0]),a[o]=0;for(i in s)Object.prototype.hasOwnProperty.call(s,i)&&(t[i]=s[i]);l&&l(e);while(m.length)m.shift()();return r.push.apply(r,c||[]),n()}function n(){for(var t,e=0;e<r.length;e++){for(var n=r[e],i=!0,u=1;u<n.length;u++){var s=n[u];0!==a[s]&&(i=!1)}i&&(r.splice(e--,1),t=o(o.s=n[0]))}return t}var i={},a={app:0},r=[];function o(e){if(i[e])return i[e].exports;var n=i[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,o),n.l=!0,n.exports}o.m=t,o.c=i,o.d=function(t,e,n){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},o.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)o.d(n,i,function(e){return t[e]}.bind(null,i));return n},o.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="/time-to-money/";var u=window["webpackJsonp"]=window["webpackJsonp"]||[],s=u.push.bind(u);u.push=e,u=u.slice();for(var c=0;c<u.length;c++)e(u[c]);var l=s;r.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},"48ce":function(t,e,n){},"56d7":function(t,e,n){"use strict";n.r(e);n("e260"),n("e6cf"),n("cca6"),n("a79d");var i=n("a026"),a=n("5c96"),r=n.n(a),o=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[n("element-calc")],1)},u=[],s=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("form",{staticClass:"calculate"},[n("h2",[t._v("Подсчет заработанных денег")]),n("div",{staticClass:"calculate__label"},[t._v(" "+t._s(t.timeSum?"Затраченное время ("+t.createTimeStr(t.timeSum)+")":"Затраченное время")+" ")]),t._l(t.input.times,(function(e,i){return n("div",{key:i,staticClass:"calculate__row"},[n("el-input-number",{attrs:{placeholder:"Часы","step-strictly":"",min:0,step:1,label:"Часы","controls-position":t.isPhone?"":"right"},model:{value:e.hours,callback:function(n){t.$set(e,"hours",n)},expression:"time.hours"}}),n("el-input-number",{attrs:{placeholder:"Минуты",step:1,"step-strictly":"",min:0,max:59,label:"Минуты","controls-position":t.isPhone?"":"right"},model:{value:e.minutes,callback:function(n){t.$set(e,"minutes",n)},expression:"time.minutes"}}),t.input.times.length>1?n("el-button",{staticClass:"calculate__time-buttons_mini",attrs:{type:"danger",icon:"el-icon-delete",plain:""},on:{click:function(e){return t.removeTime(i)}}}):t._e()],1)})),n("el-button-group",{staticClass:"calculate__time-buttons"},[n("el-button",{staticClass:"calculate__time-buttons_item",attrs:{type:"primary",icon:"el-icon-plus"},on:{click:function(e){return t.input.times.push({hours:"",minutes:""})}}},[t._v(" "+t._s(t.isPhone?"":"Добавить время")+" ")]),n("el-button",{staticClass:"calculate__time-buttons_item",attrs:{type:"danger",plain:"",icon:"el-icon-minus"},on:{click:function(e){return t.removeTime(t.input.times.length-1)}}},[t._v(" "+t._s(t.isPhone?"":"Удалить время")+" ")])],1),n("div",{staticClass:"calculate__row"},[n("el-input",{attrs:{placeholder:"Ставка",label:"Часы"},model:{value:t.input.rate,callback:function(e){t.$set(t.input,"rate",e)},expression:"input.rate"}}),n("el-input",{attrs:{placeholder:"Аванс",disabled:!1},model:{value:t.input.advance,callback:function(e){t.$set(t.input,"advance",e)},expression:"input.advance"}})],1),n("div",{staticClass:"calculate__row"},[n("el-input",{attrs:{placeholder:"Желаемая сумма",disabled:!1},model:{value:t.input.desired,callback:function(e){t.$set(t.input,"desired",e)},expression:"input.desired"}}),n("el-input",{attrs:{placeholder:"Выплачено"},model:{value:t.input.paidOut,callback:function(e){t.$set(t.input,"paidOut",e)},expression:"input.paidOut"}})],1),n("transition",{attrs:{type:"fade"}},[t.isTableShow?n("div",{staticClass:"calculate__table"},[n("el-table",{attrs:{data:t.table,"empty-text":"—","span-method":t.tableColSpan,border:"",stripe:""}},[n("el-table-column",{attrs:{prop:"name",label:"Тип",fixed:"","min-width":165}}),n("el-table-column",{attrs:{prop:"money",label:"Заработано",align:"right",width:115,"class-name":"el-table__cell-custom"}}),t.formatDesired?n("el-table-column",{attrs:{prop:"moneyLeft",label:"Осталось (рубли)",align:"right",width:145,"class-name":"el-table__cell-custom"}}):t._e(),t.formatDesired?n("el-table-column",{attrs:{prop:"timeLeft",label:"Осталось (время)",align:"right",width:145,"class-name":"el-table__cell-custom"}}):t._e()],1)],1):t._e()])],2)},c=[],l=n("5530"),d=(n("159b"),n("7db0"),n("b0c0"),n("4de4"),n("ac1f"),n("5319"),n("466d"),n("d3b7"),n("25f0"),n("1276"),n("99af"),n("b64b"),n("caad"),n("2532"),{name:"ElementCalc",data:function(){return{input:{times:[{hours:"",minutes:""}],rate:"",advance:"",paidOut:"",desired:""},regExp:/^((\d{1,3})(?:[0-9]{3})?|(\d)(?:[0-9]{3}){0,2}|(\d{1,7}))(\.\d{1,2})?$/g,localStorageKey:"earned_by_hours"}},computed:{isPhone:function(){return window.innerWidth<568},timeSum:function(){var t=this.input.times,e=0;return t.forEach((function(t){e+=t.hours?t.hours:0,e+=t.minutes?t.minutes/60:0})),e},formatRate:function(){var t=this.input.rate;return this.formatStringToMoney(t)},formatAdvance:function(){var t=this.input.advance;return this.formatStringToMoney(t)},formatPaidOut:function(){var t=this.input.paidOut;return this.formatStringToMoney(t)},formatDesired:function(){var t=this.input.desired;return this.formatStringToMoney(t)},result:function(){return[{name:"Всего за месяц",money:this.earned,main:!0},{name:"После вычета аванса",money:this.earnedAdvance},{name:"После вычета выплаченного",money:this.earnedPaidOut},{name:"После всех выплат",money:this.earnedAdvanceAndPaidOut}]},table:function(){var t=this,e=this.result,n=e.find((function(t){return t.main}));if(!n.money)return[];var i=function(e){return Object(l["a"])(Object(l["a"])({},t.desiredLeft(e.money)),{},{name:e.name,money:e.money})},a=[i(n)];return e.forEach((function(t){!t.main&&t.money&&t.money!==n.money&&a.push(i(t))})),a},isTableShow:function(){return this.table.length},earned:function(){var t=this.formatRate,e=this.timeSum;return t?this.mathRound(t*e):0},earnedAdvance:function(){return this.earned-this.formatAdvance>0?this.mathRound(this.earned-this.formatAdvance):0},earnedPaidOut:function(){return this.earned-this.formatPaidOut>0?this.mathRound(this.earned-this.formatPaidOut):0},earnedAdvanceAndPaidOut:function(){var t=this.earned,e=this.formatAdvance,n=this.formatPaidOut,i=this.mathRound(t-e-n);return i>0?i:0}},updated:function(){this.setLocalStorage()},created:function(){this.getLocalStorage()},methods:{removeTime:function(t){1===this.input.times.length?this.$set(this.input,"times",[{hours:0,minutes:0}]):this.$set(this.input,"times",this.input.times.filter((function(e,n){return t!==n})))},formatStringToMoney:function(t){var e=this.regExp,n=t.replace(/,/g,".");return n=n.replace(/\s/g,""),n.match(e)?this.mathRound(n):0},mathRound:function(t){return Math.round(100*t)/100},convertTimeToObj:function(t){var e={hours:0,min:0};if(t){var n=t.toString(10),i=n.split("."),a=parseInt(i[0],10),r=Math.round(60*(t-a));e={hours:a,min:r}}return e},createTimeStr:function(t){var e=this.convertTimeToObj(t),n=e.hours,i=e.min;return n?i?"".concat(n," ч. ").concat(i," мин."):"".concat(n," ч."):i<=0?"Несколько секунд":"".concat(i," мин.")},desiredLeft:function(t){var e=this.formatRate,n=this.formatDesired,i=n-t,a=i/e;return i>0?{moneyLeft:i>0?this.mathRound(i):0,timeLeft:a>0?this.createTimeStr(a):0}:{moneyLeft:"Цель достигнута! 😇",success:!0}},tableColSpan:function(t){var e=t.row,n=t.columnIndex,i=e.success;return i&&2===n?[1,2]:i&&3===n?[0,0]:void 0},getLocalStorage:function(){var t=localStorage.getItem(this.localStorageKey);if(t){var e=JSON.parse(t),n=this.input,i=Object.keys(n),a=Object.keys(e).filter((function(t){return!i.includes(t)})).length;if(a){var r={rate:e.rate?e.rate.toString(10):"",advance:e.advanceValue?e.advanceValue.toString(10):"",desired:e.requiredAmount?e.requiredAmount.toString(10):"",paidOut:"",times:[]};e.times.forEach((function(t){r.times.push({hours:t.hours?parseInt(t.hours,10):0,minutes:t.minutes?parseInt(t.minutes,10):0})})),this.$set(this,"input",r)}else this.$set(this,"input",e)}},setLocalStorage:function(){var t=JSON.stringify(this.input);localStorage.setItem(this.localStorageKey,t)}}}),m=d,p=(n("8425"),n("d092"),n("2877")),f=Object(p["a"])(m,s,c,!1,null,"f746a16e",null),h=f.exports,b={name:"App",components:{ElementCalc:h}},v=b,g=(n("5c0b"),Object(p["a"])(v,o,u,!1,null,null,null)),y=g.exports;n("0fae");i["default"].use(r.a),i["default"].config.productionTip=!1,new i["default"]({render:function(t){return t(y)}}).$mount("#app")},"5c0b":function(t,e,n){"use strict";n("9c0c")},"6c3a":function(t,e,n){},8425:function(t,e,n){"use strict";n("6c3a")},"9c0c":function(t,e,n){},d092:function(t,e,n){"use strict";n("48ce")}});