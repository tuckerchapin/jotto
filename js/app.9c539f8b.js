(function(t){function e(e){for(var n,a,o=e[0],c=e[1],u=e[2],l=0,h=[];l<o.length;l++)a=o[l],Object.prototype.hasOwnProperty.call(r,a)&&r[a]&&h.push(r[a][0]),r[a]=0;for(n in c)Object.prototype.hasOwnProperty.call(c,n)&&(t[n]=c[n]);d&&d(e);while(h.length)h.shift()();return i.push.apply(i,u||[]),s()}function s(){for(var t,e=0;e<i.length;e++){for(var s=i[e],n=!0,o=1;o<s.length;o++){var c=s[o];0!==r[c]&&(n=!1)}n&&(i.splice(e--,1),t=a(a.s=s[0]))}return t}var n={},r={app:0},i=[];function a(e){if(n[e])return n[e].exports;var s=n[e]={i:e,l:!1,exports:{}};return t[e].call(s.exports,s,s.exports,a),s.l=!0,s.exports}a.m=t,a.c=n,a.d=function(t,e,s){a.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},a.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},a.t=function(t,e){if(1&e&&(t=a(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(a.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)a.d(s,n,function(e){return t[e]}.bind(null,n));return s},a.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return a.d(e,"a",e),e},a.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},a.p="/jotto/";var o=window["webpackJsonp"]=window["webpackJsonp"]||[],c=o.push.bind(o);o.push=e,o=o.slice();for(var u=0;u<o.length;u++)e(o[u]);var d=c;i.push([0,"chunk-vendors"]),s()})({0:function(t,e,s){t.exports=s("56d7")},"109b":function(t,e,s){},"20c9":function(t,e,s){"use strict";var n=s("109b"),r=s.n(n);r.a},2126:function(t,e,s){},"24bb":function(t,e,s){},4846:function(t,e,s){"use strict";var n=s("2126"),r=s.n(n);r.a},"4aa3":function(t,e,s){"use strict";var n=s("24bb"),r=s.n(n);r.a},"4e2d":function(t,e,s){},"56d7":function(t,e,s){"use strict";s.r(e);s("e260"),s("e6cf"),s("cca6"),s("a79d");var n,r,i,a,o,c,u,d,l,h=s("2b0e"),f=s("ade3"),b=(s("d81d"),s("b64b"),s("2909")),m=s("3835"),p=(s("99af"),s("a15b"),s("a9e3"),{name:"SheetRow",props:{header:{type:Boolean,default:!1},left:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},word:{type:String,default:""},score:{type:[Number,String],default:""},noSubmit:{type:Boolean,default:!1},highlight:{type:Boolean,default:!1}},data:function(){return{letterList:["","","","",""],selected:-1,tracker:[0,0,0,0,0]}},computed:{rowWord:function(){return this.letterList.join("").toLowerCase()},isValidWord:function(){return 5===this.rowWord.length}},watch:{rowWord:function(t,e){t!==e&&this.$emit("change",t)},word:function(){this.parseWord()}},methods:{handleSelect:function(t){this.disabled||(this.selected=t)},handleDeselect:function(){this.selected=-1},focus:function(t){if(t>=0&&t<=4)this.$refs["letterBox".concat(t)].focus();else for(var e=0;e<=4;e+=1)this.$refs["letterBox".concat(e)].focus()},handleKeyPress:function(t){this.disabled||(/^[a-zA-Z]$/.test(t.key)?(this.$set(this.letterList,this.selected,t.key.toUpperCase()),this.selected<4&&(this.selected+=1)):"Backspace"===t.key?this.letterList[this.selected]?this.$set(this.letterList,this.selected,""):this.selected>0&&(this.selected-=1,this.$set(this.letterList,this.selected,"")):"ArrowLeft"===t.key?this.selected>0&&(this.selected-=1):"ArrowRight"===t.key?this.selected<4&&(this.selected+=1):"Enter"===t.key&&this.handleSubmit(),this.focus(this.selected),t.stopPropagation(),t.preventDefault())},handleSubmit:function(){this.disabled||!this.isValidWord||this.noSubmit||this.$emit("submit",this.rowWord)},handleLetterClicked:function(t){this.disabled&&!this.header&&this.letterList[t]&&this.$set(this.tracker,t,this.tracker[t]+1)},parseWord:function(){if(this.word)for(var t=0;t<this.word.length;t+=1)this.$set(this.letterList,t,this.word[t].toUpperCase());else for(var e=0;e<5;e+=1)this.$set(this.letterList,e,"")}},created:function(){this.parseWord()},render:function(){var t=this,e=arguments[0],s=function(){return t.disabled?e("div",{class:"score-box"},[e("span",{class:"score"},[t.score>=0?t.score:""])]):e("div",{class:"score-box submit-button ".concat(t.isValidWord&&!t.noSubmit||"disabled"),on:{click:t.handleSubmit}},[e("svg",{class:"icon check",attrs:{version:"1.1",viewBox:"0 0 100 100",xmlns:"http://www.w3.org/2000/svg"}},[e("path",{attrs:{d:"m0 53.891 11.109-14.445 28.891 24.445 46.668-52.223 13.332 12.223-58.891 64.441z"}})])])};return e("div",{class:"sheet-row ".concat(!this.header||"header"," ").concat(!this.highlight||"highlight"," ").concat(!this.disabled||"disabled","'"),on:{keyup:this.handleKeyPress}},[this.left?null:s(),e("div",{class:"letter-box-container"},[this.header?null:e("div",{class:"letter-box-highlighter"}),[0,1,2,3,4].map((function(s){return e("div",{class:"letter-box",ref:"letterBox".concat(s),attrs:{tabindex:t.disabled?"":s},on:{focus:function(){return t.handleSelect(s)},blur:function(){return t.handleDeselect()},click:function(){return t.handleLetterClicked(s)}}},[e("svg",{class:"letter-circle big ".concat(t.tracker[s]%3===2?"show":""),attrs:{version:"1.1",viewBox:"0 0 100 100",xmlns:"http://www.w3.org/2000/svg"}},[e("path",{attrs:{d:"m50 5c-24.816 0-45 20.184-45 45s20.184 45 45 45 45-20.184 45-45-20.184-45-45-45zm0 6c21.574 0 39 17.426 39 39s-17.426 39-39 39-39-17.426-39-39 17.426-39 39-39z"}})]),e("svg",{class:"letter-slash big ".concat(t.tracker[s]%3===1?"show":""),attrs:{version:"1.1",viewBox:"0 0 100 100",xmlns:"http://www.w3.org/2000/svg"}},[e("path",{attrs:{d:"m3.125 100c-0.80078 0-1.6016-0.30469-2.2109-0.91406-1.2188-1.2188-1.2188-3.1992 0-4.418l93.75-93.75c1.2188-1.2188 3.1992-1.2188 4.418 0s1.2188 3.1992 0 4.418l-93.75 93.75c-0.60547 0.60937-1.4062 0.91406-2.207 0.91406z"}})]),t.letterList[s]])}))]),this.left?s():null])}}),y=p,g=(s("8d1f"),s("2877")),w=Object(g["a"])(y,n,r,!1,null,null,null),v=w.exports,k=0,j=1,x=2,I=3,O=4,W=5,C={name:"Game",data:function(){return{secretWord:"",statusText:"",statusClass:"",letterTracker:{a:0,b:0,c:0,d:0,e:0,f:0,g:0,h:0,i:0,j:0,k:0,l:0,m:0,n:0,o:0,p:0,q:0,r:0,s:0,t:0,u:0,v:0,w:0,x:0,y:0,z:0}}},computed:{turnLimit:function(){return this.$store.state.turnLimit},isInGame:function(){return!!this.$store.state.game.id},isOwner:function(){return this.$store.state.lobby.isOwner},winner:function(){return this.$store.state.game.winner},myId:function(){return this.$store.getters["game/myId"]},theirId:function(){return this.$store.getters["game/theirId"]},theirName:function(){return this.$store.getters["lobby/theirName"]},isValidSecretWord:function(){return 5===this.secretWord.length},myWord:function(){return this.$store.getters["game/myWord"]},theirWord:function(){return this.$store.getters["game/theirWord"]},isMyTurn:function(){return this.$store.getters["game/isMyTurn"]},myGuesses:function(){return this.$store.getters["game/myGuesses"]},theirGuesses:function(){return this.$store.getters["game/theirGuesses"]},status:function(){return this.isInGame?this.myWord?this.theirWord?this.winner?I:this.isMyTurn?O:W:x:j:k}},watch:{status:function(t){this.setStatusBarContent(t)}},methods:{handleNewGame:function(){this.$store.dispatch("game/create")},handleSetWord:function(){this.isValidSecretWord&&(this.$store.dispatch("game/setMyWord",{word:this.secretWord}),this.secretWord="")},handleSaveGuess:function(t){5===t.length&&this.$store.dispatch("game/setMyGuess",{word:t})},handleSecretWordChanged:function(t){this.secretWord=t},handleLetterClicked:function(t){this.$set(this.letterTracker,t,this.letterTracker[t]+1)},setStatusBarContent:function(t){switch(t){case k:this.isOwner?(this.statusText="Start a new game.",this.statusClass="gentle"):(this.statusText="Waiting for lobby owner to start a new game...",this.statusClass="neutral");break;case j:this.statusText="Choose your secret word.",this.statusClass="attention pulse gentle";break;case x:this.statusText="Waiting for opponent to choose their secret word...",this.statusClass="neutral";break;case I:this.winner===this.myId?(this.statusText="You win!",this.statusClass="pulse win"):this.winner===this.theirId?(this.statusText="".concat(this.theirName," wins!"),this.statusClass="neutral"):(this.statusText="Draw!",this.statusClass="draw"),this.isOwner&&(this.statusText+=" Play again?");break;case O:this.statusText="Your turn.",this.statusClass="pulse gentle";break;case W:this.statusText="".concat(this.theirName,"'s turn..."),this.statusClass="neutral";break;default:break}}},created:function(){this.$store.dispatch("game/autojoin"),this.setStatusBarContent(this.status)},render:function(){var t=this,e=arguments[0],s=function(){return e("div",{class:"status-bar ".concat(t.statusClass)},[e("div",{class:"status-flank"}),e("div",{class:"status-text"},[t.statusText]),e("div",{class:"status-flank"})])},n=function(){return e("div",{class:"sheet-header"},[e(v,{attrs:{header:!0,hide:!0,disabled:t.status===j}}),e("div",{class:"sheet-header-actions"},[t.status!==k&&t.status!==I||!t.isOwner?null:e("button",{class:"button small",on:{click:t.handleNewGame}},["New Game"]),t.status===j?e("button",{class:"button small",attrs:{disabled:!t.isValidSecretWord},on:{click:t.handleSetWord}},["Set word"]):null]),e(v,{attrs:{header:!0,left:!0,highlight:t.status===j,word:t.myWord,disabled:t.status!==j},on:{change:t.handleSecretWordChanged}})])};return e("div",{class:"game-container"},[s(),n(),e("div",{attrs:{id:"my-sheet"},class:"sheet"},[this.myGuesses.map((function(t){var s=Object(m["a"])(t,2),n=s[0],r=s[1];return e(v,{attrs:{disabled:!0,word:n,score:r,left:!0}})})),Object(b["a"])(Array(this.turnLimit-this.myGuesses.length)).map((function(s,n){return 0===n&&t.status!==I&&t.status!==k?e(v,{attrs:{left:!0,disabled:!t.myWord,highlight:t.isMyTurn,noSubmit:!t.isMyTurn},on:{submit:t.handleSaveGuess}}):e(v,{attrs:{disabled:!0,left:!0}})}))]),e("div",{attrs:{id:"their-sheet"},class:"sheet"},[this.theirGuesses.map((function(t){var s=Object(m["a"])(t,2),n=s[0],r=s[1];return e(v,{attrs:{disabled:!0,word:n,score:r}})})),Object(b["a"])(Array(this.turnLimit-this.theirGuesses.length)).map((function(){return e(v,{attrs:{disabled:!0}})}))]),e("div",{attrs:{id:"letter-tracker"}},[Object.keys(this.letterTracker).map((function(s){return e("div",{class:"a-letter",on:{click:function(){return t.handleLetterClicked(s)}}},[e("svg",{class:"letter-circle ".concat(t.letterTracker[s]%3===2?"show":""),attrs:{version:"1.1",viewBox:"0 0 100 100",xmlns:"http://www.w3.org/2000/svg"}},[e("path",{attrs:{d:"m50 5c-24.816 0-45 20.184-45 45s20.184 45 45 45 45-20.184 45-45-20.184-45-45-45zm0 6c21.574 0 39 17.426 39 39s-17.426 39-39 39-39-17.426-39-39 17.426-39 39-39z"}})]),e("svg",{class:"letter-slash ".concat(t.letterTracker[s]%3===1?"show":""),attrs:{version:"1.1",viewBox:"0 0 100 100",xmlns:"http://www.w3.org/2000/svg"}},[e("path",{attrs:{d:"m3.125 100c-0.80078 0-1.6016-0.30469-2.2109-0.91406-1.2188-1.2188-1.2188-3.1992 0-4.418l93.75-93.75c1.2188-1.2188 3.1992-1.2188 4.418 0s1.2188 3.1992 0 4.418l-93.75 93.75c-0.60547 0.60937-1.4062 0.91406-2.207 0.91406z"}})]),s])}))])])}},S=C,L=(s("68e4"),s("7339"),s("20c9"),s("931d"),Object(g["a"])(S,i,a,!1,null,null,null)),$=L.exports,G={name:"Lobby",data:function(){return{lobbyEntryField:"",justCopied:!1}},computed:{inLobby:function(){return!!this.$store.state.lobby.id},isOwner:function(){return this.$store.state.lobby.isOwner},theirId:function(){return this.$store.getters["lobby/theirId"]},theirName:function(){return this.$store.getters["lobby/theirName"]},myName:function(){return this.$store.getters["lobby/myName"]}},methods:{handleLobbyEntered:function(t){this.lobbyEntryField=t},handleJoinLobby:function(){this.$store.dispatch("lobby/join",{id:this.lobbyEntryField})},handleCreateLobby:function(){this.$store.dispatch("lobby/create")},handleCopyInvite:function(){var t=this;navigator.clipboard.writeText(window.location.href).then((function(){t.justCopied=!0,clearTimeout(o),o=setTimeout((function(){t.justCopied=!1}),2e3)})).catch((function(){}))},renderCrown:function(){var t,e=this.$createElement;return e("svg",{class:"icon crown",attrs:(t={version:"1.1",xmlns:"http://www.w3.org/2000/svg"},Object(f["a"])(t,"xmlns","http://www.w3.org/1999/xlink"),Object(f["a"])(t,"viewBox","0 0 83.3 63.7"),Object(f["a"])(t,"xml","preserve"),t)},[e("g",[e("path",{attrs:{d:"M75.5,32.3c-3.6-0.5-6.5-3-7.6-6.4l-10.1,5.6l-9.9-17.7c-1.7,1.4-3.8,2.2-6.1,2.2c-2.3,0-4.5-0.8-6.1-2.2l-9.9,17.7 l-10.1-5.6c-1.2,3.3-4.1,5.8-7.7,6.4l6.4,18.8h54.8L75.5,32.3z"}}),e("path",{attrs:{d:"M16.6,63.7h50.2c0.9,0,1.7-0.8,1.7-1.7v-7.6H14.9v7.6C14.9,63,15.7,63.7,16.6,63.7L16.6,63.7z"}}),e("path",{attrs:{d:"M6.4,29.1c3.5,0,6.4-2.9,6.4-6.4s-2.9-6.4-6.4-6.4c-3.5,0-6.4,2.9-6.4,6.4C0,26.2,2.9,29.1,6.4,29.1z"}}),e("path",{attrs:{d:"M35.3,6.4c0,3.5,2.9,6.4,6.4,6.4c3.5,0,6.4-2.9,6.4-6.4C48,2.9,45.2,0,41.7,0C38.2,0,35.3,2.9,35.3,6.4z"}}),e("path",{attrs:{d:"M77,16.4c-3.5,0-6.4,2.9-6.4,6.4s2.9,6.4,6.4,6.4c3.5,0,6.4-2.9,6.4-6.4C83.3,19.2,80.5,16.4,77,16.4z"}})])])}},created:function(){this.$store.dispatch("lobby/autojoin")},render:function(){var t=this,e=arguments[0];return this.theirId?e("div",{class:"in-game"},[e("div",{class:"lobby-header"},[e("div",{class:"lobby-name"},[this.theirName,this.isOwner?null:this.renderCrown()]),e("div",{class:"lobby-name"},[this.myName," (You) ",this.isOwner?this.renderCrown():null])]),e($)]):this.inLobby?e("div",{class:"lobby-select"},[e("span",["Waiting for another player..."]),e("button",{class:"button small ".concat(!this.justCopied||"copied"),on:{click:this.handleCopyInvite}},[this.justCopied?"Copied!":"Copy invite link"])]):e("div",{class:"lobby-select"},[e("button",{class:"button",on:{click:this.handleCreateLobby}},["Create a lobby"]),e("span",["or"]),e("input",{class:"input",attrs:{placeholder:"Enter a lobby code..."},domProps:{value:this.lobbyEntryField},on:{change:function(e){return t.handleLobbyEntered(e.target.value)},keyup:function(e){"Enter"===e.key&&t.handleJoinLobby()}}})])}},N=G,T=(s("4aa3"),s("d2cd"),Object(g["a"])(N,c,u,!1,null,null,null)),P=T.exports,M={name:"Session",created:function(){this.$store.dispatch("session/sync")},render:function(){var t=arguments[0];return t(P)}},z=M,B=(s("4846"),Object(g["a"])(z,d,l,!1,null,null,null)),_=B.exports,E=(s("4160"),s("c975"),s("a434"),s("b0c0"),s("d3b7"),s("ac1f"),s("25f0"),s("3ca3"),s("1276"),s("159b"),s("ddb0"),s("2b3d"),s("96cf"),s("1da1")),R=s("2f62"),Q=s("bf48"),U=s.n(Q),A=s("2f2e");h["a"].use(R["a"]),U.a.serverURL="https://parseapi.back4app.com",U.a.liveQueryServerURL="ws://jotto.back4app.io",U.a.initialize("zgQ2awszgoWkB84nETZ0FgIZUgDsvbwrzZwCb8kc","6WyFKpJz71ZMUN176Z8awkQtP1ixXQDAdHah7MNe");var D,F,V,Z,J=U.a.Object.extend("Lobby"),K=U.a.Object.extend("Game"),Y=new R["a"].Store({state:{turnLimit:10,wordLength:5},mutations:{},actions:{},modules:{session:{namespaced:!0,state:{id:"",name:""},mutations:{setId:function(t,e){var s=e.id;t.id=s},setName:function(t,e){var s=e.name;t.name=s}},actions:{sync:function(t){var e=t.commit,s=localStorage.getItem("jotto__sessionId");s||(s=Object(b["a"])(Array(12)).map((function(){return Math.random().toString(36)[2]})).join(""),localStorage.setItem("jotto__sessionId",s)),e("setId",{id:s});var n=localStorage.getItem("jotto__nickname");n||(n=Object(A["generateCombination"])(1,"",!0),localStorage.setItem("jotto__nickname",n)),e("setName",{name:n})}}},lobby:{namespaced:!0,state:{id:"",opponentId:"",opponentName:"",isOwner:!1,gameId:""},getters:{myId:function(t,e,s){return s.session.id},myName:function(t,e,s){return s.session.name},theirId:function(t){return t.opponentId},theirName:function(t){return t.opponentName}},mutations:{setId:function(t,e){var s=e.id;t.id=s;var n=new URL(window.location.href);s?n.searchParams.set("",s):n.searchParams.delete(""),window.history.pushState(null,null,n)},setOpponent:function(t,e){var s=e.id,n=e.name;t.opponentId=s,t.opponentName=n},setOwner:function(t,e){var s=e.isOwner;t.isOwner=s},setGameId:function(t,e){var s=e.gameId;t.gameId=s}},actions:{autojoin:function(t){var e=t.dispatch,s=new URL(window.location.href);s.searchParams.has("")&&e("join",{id:s.searchParams.get("")})},create:function(t){var e=t.rootState,s=t.dispatch,n=new J,r={};r[e.session.id]=e.session.name,n.set("members",r),n.set("gameId",""),n.save().then((function(t){s("join",{id:t.id})}))},join:function(t,e){var s=t.rootState,n=t.dispatch,r=e.id,i=new U.a.Query(J);i.get(r).then((function(t){if(s.session.id in t.get("members")||Object.keys(t.get("members")).length<2){D=t;var e=t.get("members");e[s.session.id]=s.session.name,t.set("members",e),t.save().then((function(){n("sync",{id:t.id})}))}else alert("could not join lobby")})).catch((function(t){alert("invalid lobby"),console.error(t)}))},sync:function(t,e){var s=t.state,n=t.rootState,r=t.commit,i=t.dispatch,a=e.id;a&&(r("setId",{id:a}),i("subscribe")),D.fetch().then((function(){var t=D.get("members"),e=Object.keys(t)[0],a=!1;e===n.session.id&&(e=Object.keys(t)[1]||"",a=!0),r("setOpponent",{id:e,name:t[e]||""}),r("setOwner",{isOwner:a});var o=D.get("gameId"),c=s.gameId;r("setGameId",{gameId:o}),o&&o!==c&&i("game/join",{id:o},{root:!0})}))},subscribe:function(t){return Object(E["a"])(regeneratorRuntime.mark((function e(){var s,n,r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return s=t.state,n=t.dispatch,r=new U.a.Query(J),r.get(s.id),e.next=5,r.subscribe();case 5:F=e.sent,F.on("update",(function(){n("sync",{})}));case 7:case"end":return e.stop()}}),e)})))()},leave:function(t){var e=t.rootState,s=t.commit;s("setId",{id:""}),s("setOpponent",{id:"",name:""}),s("setOwner",{isOwner:!1}),s("setGameId",{gameId:""}),F.unsubscribe();var n=D.get("members");delete n[e.session.id],D.set("members",n),D.save().then((function(){D=void 0}))}}},game:{namespaced:!0,state:{id:"",players:{},words:["",""],guesses:[[],[]],winner:""},getters:{myId:function(t,e,s){return s.session.id},theirId:function(t,e,s){return s.lobby.opponentId},myPlayerNumber:function(t,e){return t.players[e.myId]},theirPlayerNumber:function(t,e){return t.players[e.theirId]},myWord:function(t,e){return t.words[e.myPlayerNumber]||""},theirWord:function(t,e){return t.words[e.theirPlayerNumber]||""},isMyTurn:function(t,e){return!(!e.myWord||!e.theirWord)&&(0===e.myPlayerNumber?t.guesses[0].length===t.guesses[1].length:t.guesses[0].length!==t.guesses[1].length)},myGuesses:function(t,e){return t.guesses[e.myPlayerNumber]||[]},theirGuesses:function(t,e){return t.guesses[e.theirPlayerNumber]||[]}},mutations:{setId:function(t,e){var s=e.id;t.id=s},setPlayers:function(t,e){var s=e.players;t.players=s},setWinner:function(t,e){var s=e.winner;t.winner=s},setWords:function(t,e){var s=e.words;h["a"].set(t.words,0,s[0]),h["a"].set(t.words,1,s[1])},setGuesses:function(t,e){var s=e.guesses;h["a"].set(t.guesses,0,s[0]),h["a"].set(t.guesses,1,s[1])}},actions:{autojoin:function(t){var e=t.rootState,s=t.dispatch;e.lobby.gameId&&s("join",{id:e.lobby.gameId})},create:function(t){var e=t.rootState,s=t.commit,n=t.dispatch,r=new K,i={};i[e.session.id]=0,i[e.lobby.opponentId]=1,e.lobby.isOwner||(i[e.session.id]=1,i[e.lobby.opponentId]=0),s("setPlayers",{players:i}),r.set("players",i),r.set("player0Word",""),r.set("player1Word",""),r.set("player0Guesses",[]),r.set("player1Guesses",[]),r.set("winner",""),r.save().then((function(t){D.set("gameId",t.id),D.save(),n("join",{id:t.id})}))},join:function(t,e){var s=t.dispatch,n=e.id,r=new U.a.Query(K);r.get(n).then((function(t){V=t,s("sync",{id:t.id})})).catch((function(t){alert("invalid game"),console.error(t)}))},sync:function(t,e){var s=t.commit,n=t.dispatch,r=e.id;r&&(s("setId",{id:r}),n("subscribe")),V.fetch().then((function(){s("setPlayers",{players:V.get("players")}),s("setWinner",{winner:V.get("winner")}),s("setWords",{words:[V.get("player0Word"),V.get("player1Word")]}),s("setGuesses",{guesses:[V.get("player0Guesses"),V.get("player1Guesses")]})}))},subscribe:function(t){return Object(E["a"])(regeneratorRuntime.mark((function e(){var s,n,r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return s=t.state,n=t.dispatch,r=new U.a.Query(K),r.get(s.id),e.next=5,r.subscribe();case 5:Z=e.sent,Z.on("update",(function(){n("sync",{})}));case 7:case"end":return e.stop()}}),e)})))()},clear:function(t){var e=t.commit;try{Z.unsubscribe()}catch(s){}e("setPlayers",{players:{}}),e("setWinner",{winner:""}),e("setWords",{words:["",""]}),e("setGuesses",{guesses:[[],[]]})},setMyWord:function(t,e){var s=t.getters,n=t.dispatch,r=e.word;V.set("player".concat(s.myPlayerNumber,"Word"),r),V.save().then((function(){return n("sync",{})}))},setMyGuess:function(t,e){var s=t.rootState,n=t.getters,r=t.dispatch,i=e.word,a=0,o=i.toLowerCase().split(""),c=n.theirWord.split("");o.forEach((function(t){var e=c.indexOf(t);e>-1&&(a+=1,c.splice(e,1))})),V.add("player".concat(n.myPlayerNumber,"Guesses"),[i.toLowerCase(),a]),i.toLowerCase()===n.theirWord.toLowerCase()?V.set("winner",n.myId):n.theirGuesses.length===s.turnLimit&&n.myGuesses.length===s.turnLimit-1&&V.set("winner","draw"),V.save().then((function(){return r("sync",{})}))}}}}});h["a"].config.productionTip=!1,new h["a"]({store:Y,render:function(t){return t(_)}}).$mount("#app")},"68e4":function(t,e,s){"use strict";var n=s("4e2d"),r=s.n(n);r.a},7339:function(t,e,s){"use strict";var n=s("ba70"),r=s.n(n);r.a},"8d1f":function(t,e,s){"use strict";var n=s("bdd3"),r=s.n(n);r.a},"914d":function(t,e,s){},"931d":function(t,e,s){"use strict";var n=s("cd66"),r=s.n(n);r.a},ba70:function(t,e,s){},bdd3:function(t,e,s){},cd66:function(t,e,s){},d2cd:function(t,e,s){"use strict";var n=s("914d"),r=s.n(n);r.a}});