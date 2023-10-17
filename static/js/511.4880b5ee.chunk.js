"use strict";(self.webpackChunkweb=self.webpackChunkweb||[]).push([[511],{22339:(e,t,r)=>{r.r(t),r.d(t,{avatarFromChannel:()=>u,default:()=>c});var n=r(4942),o=(r(95004),r(34271)),i=r(2629),a=function(e,t,r){return Math.floor(e%(r-t)+t)};const l=function(e){var t=function(e,t){for(var r=t||0,n=0;n<e.length;n++)r=e.charCodeAt(n)+((r<<5)-r);return r=Math.abs(r),"hsl("+a(r,0,360)+", "+a(r,0,100)+"%, "+a(r,25,75)+"%)"}(e.name,e.userId);return(0,i.jsx)(o.default,{style:{backgroundColor:t},size:e.size,label:e.name.split(" ").map((function(e){return e[0]})).join().toUpperCase()})};function s(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function u(e,t){var r,n=e.name;return e.member_count<3&&(r=1==e.member_count||(null==t?void 0:t.id)==e.subowner.id?e.owner:e.subowner,n=n.length>0?n:r.name),{avatar:r,name:n}}const c=function(e){return(0,i.jsx)(l,function(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?s(Object(r),!0).forEach((function(t){(0,n.default)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):s(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}({},e))}},14521:(e,t,r)=>{r.r(t),r.d(t,{default:()=>p});var n=r(4942),o=r(29439),i=r(95004),a=r(1054),l=r(66792),s=r(2840),u=r(40150),c=r(54243),d=r(2629);function f(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function h(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?f(Object(r),!0).forEach((function(t){(0,n.default)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):f(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var g=function(e){var t=(0,i.useState)(!1),r=(0,o.default)(t,2),n=r[0],l=r[1];return(0,d.jsx)(s.default,{onPress:function(){return e.onPress()},onHoverIn:function(){return l(!0)},onHoverOut:function(){return l(!1)},disabled:e.disabled,style:[{paddingVertical:5,paddingHorizontal:16},e.style,n||e.disabled?{backgroundColor:e.color,borderColor:e.borderColor}:{}],children:e.children?e.children:(0,d.jsx)(a.default,{selectable:!1,style:[{fontSize:14},e.textStyle],children:e.title})})};const p=function(e){var t=(0,c.default)(),r=h(h({color:u.default[t].hoverColor,borderColor:"light"==t?u.default[t].buttonBorderColor:"#7d8590"},e),{},{style:[y.style,{backgroundColor:u.default[t].buttonBackgroundColor,borderColor:u.default[t].buttonBorderColor},e.style],textStyle:[y.text,{color:u.default[t].text},e.textStyle]});return(0,d.jsx)(g,h({},r))};var y=l.default.create({style:{borderRadius:6,borderWidth:1},text:{textAlign:"center",fontWeight:"600"}})},40820:(e,t,r)=>{r.r(t),r.d(t,{default:()=>l});r(95004);var n=r(26944),o=r(66792),i=r(40150),a=r(2629);function l(e){return(0,a.jsx)(n.View,{style:[s.outerContainer,e.autoScale?{}:s.outerContainerFill,e.outerContainerStyle],children:(0,a.jsxs)(n.View,{style:[s.container,e.containerStyle],children:[e.withSeparator?(0,a.jsx)(n.View,{style:s.separator,lightColor:"#ddd",darkColor:"rgba(255,255,255, 0.3)"}):void 0,e.title?(0,a.jsxs)(n.View,{style:s.titleView,children:[(0,a.jsx)(n.Text,{style:[s.title,e.titleStyle],children:e.title}),(0,a.jsx)(n.Text,{style:s.subtitle,children:e.subtitle})]}):void 0,(0,a.jsx)(n.View,{style:[s.bodyView,e.bodyStyle],children:e.children})]})})}var s=o.default.create({outerContainer:{alignItems:"stretch",backgroundColor:"transparent"},outerContainerFill:{width:"100%",maxWidth:1080},container:{marginHorizontal:20,marginVertical:10,backgroundColor:"transparent"},titleView:{width:"100%",flexDirection:"row",backgroundColor:"transparent",marginBottom:5},title:{flex:1,fontSize:16},subtitle:{flex:1,fontSize:12,textAlign:"right",marginTop:4},separator:{marginBottom:0,height:1,width:"100%"},bodyView:{width:"100%",padding:20,alignItems:"center",justifyContent:"center",borderWidth:1,borderColor:i.default.borderColor,borderRadius:6}})},98307:(e,t,r)=>{r.r(t),r.d(t,{BottomSheet:()=>l,default:()=>a});r(95004);var n=r(40820),o=r(48469),i=r(2629);const a=function(e){var t=(0,o.default)();return(0,i.jsx)(n.default,{autoScale:!0,outerContainerStyle:{flex:1,alignSelf:"center",backgroundColor:"#8888",flexShrink:1,width:"100%"},containerStyle:{flex:1,margin:0,justifyContent:"center",alignItems:"center"},bodyStyle:"landscape"==t?{width:"90%",height:"90%",padding:"5%"}:{width:"100%",height:"100%",maxWidth:1080},children:e.children})};var l=function(e){return(0,i.jsx)(n.default,{autoScale:!0,outerContainerStyle:{flex:1,alignSelf:"center",backgroundColor:"#8888",width:"100%"},containerStyle:{flex:1,margin:0,justifyContent:"flex-end"},children:e.children})}},26944:(e,t,r)=>{r.r(t),r.d(t,{Text:()=>p,View:()=>y,useThemeColor:()=>g});var n=r(4942),o=r(45987),i=(r(95004),r(1054)),a=r(39385),l=r(40150),s=r(54243),u=r(2629),c=["style","lightColor","darkColor"],d=["style","lightColor","darkColor"];function f(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function h(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?f(Object(r),!0).forEach((function(t){(0,n.default)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):f(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function g(e,t){var r=(0,s.default)(),n=e[r];return n||l.default[r][t]}function p(e){var t=e.style,r=e.lightColor,n=e.darkColor,a=(0,o.default)(e,c),l=g({light:r,dark:n},"text");return(0,u.jsx)(i.default,h({style:[{color:l},t]},a))}function y(e){var t=e.style,r=e.lightColor,n=e.darkColor,i=(0,o.default)(e,d),l=g({light:r,dark:n},"background");return(0,u.jsx)(a.default,h({style:[{backgroundColor:l},t]},i))}},40150:(e,t,r)=>{r.r(t),r.d(t,{default:()=>i});var n="#2f95dc",o="#fff";const i={light:{text:"#000",background:"#fff",tint:n,tabIconDefault:"#ccc",tabIconSelected:n,hoverColor:"rgb(242,242,242)",buttonBackgroundColor:"#f6f8fa",header:"#f6f8fa",headerBottomColor:"rgb(216, 216, 216)",buttonBorderColor:"rgba(27,31,36,0.15)",iconColor:"black"},dark:{text:"#fff",background:"#000",tint:o,tabIconDefault:"#ccc",tabIconSelected:o,hoverColor:"#010409",buttonBackgroundColor:"#010409",header:"#010409",headerBottomColor:"rgb(40, 40, 40)",buttonBorderColor:"rgba(229,225,220,0.15)",iconColor:"white"},borderColor:"#d0d7de",focus:"#0065A4"}},40640:(e,t,r)=>{r.r(t),r.d(t,{default:()=>g,useMessengerContentMutation:()=>p});var n=r(15861),o=r(93433),i=r(4942),a=r(95004),l=r(51641),s=r(98735),u=r(90270),c=r(47754);function d(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function f(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?d(Object(r),!0).forEach((function(t){(0,i.default)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):d(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var h=function(e,t){var r=0;e.forEach((function(e){r!=t.length&&(e.current.forEach((function(e){r!=t.length&&e.id==t[r].id&&(e.timer=t[r].timer,e.is_archive=t[r].is_archive,r+=1)})),e.current=e.current.filter((function(e){return!e.is_archive})))}))};function g(e){var t=(0,l.useQueryClient)(),r=(0,l.useInfiniteQuery)(["MessengerContentList",e],function(){var t=(0,n.default)((function*(t){var r=t.pageParam;return(0,s.getMessengerContentList)(e,r).then((function(e){return{current:e}}))}));return function(e){return t.apply(this,arguments)}}(),{select:function(e){return e.pages.length>1&&(e.pages[e.pages.length-2].next=e.pages[e.pages.length-1]),e},getNextPageParam:function(e){return null!=e&&e.current.length?e.current[e.current.length-1].id:void 0},refetchOnReconnect:!1,refetchOnWindowFocus:function(r){var n=new Date(r.state.dataUpdatedAt).toISOString(),i=f({},r.state.data);return(0,s.getNewMessengerContentList)(e,n).then((function(r){if(i.pages){var n=i.pages[0].current[0].id||0,a=r.filter((function(e){return e.id>n&&0==e.is_archive})),l=r.filter((function(e){return e.id<=n})),s=a.findIndex((function(e){return e.timer}))>=0||l.length>0;i.pages[0].current=[].concat((0,o.default)(a),(0,o.default)(i.pages[0].current)),h(i.pages,l),s&&t.invalidateQueries(["TimerMessageContentList",e])}})),!1}}),i=r.data,c=r.fetchNextPage,d=(0,u.default)().lastJsonMessage;return(0,a.useEffect)((function(){null!=d&&d.data.channel==e&&("next_message"==d.type&&t.setQueryData(["MessengerContentList",e],(function(e){return null!=e&&e.pages[0].current&&(null==e?void 0:e.pages[0].current[0].id)!=d.data.id&&(e.pages[0].current=[d.data].concat((0,o.default)(null==e?void 0:e.pages[0].current))),f({},e||{pages:[],pageParams:[]})})),"update_message"==d.type&&t.setQueryData(["MessengerContentList",e],(function(e){return(null==e?void 0:e.pages)&&h(e.pages,[d.data]),f({},e||{pages:[],pageParams:[]})})))}),[d]),{data:i,fetchNextPage:c}}function p(e){var t=(0,c.default)().dispatch,r=(0,l.useMutation)((function(e){return(0,s.postMessage)(e,t)}),{onSuccess:function(){}}),n=(0,l.useMutation)(s.patchMessengerContent);return{create:r.mutate,patch:n.mutate}}},89134:(e,t,r)=>{r.r(t),r.d(t,{default:()=>i});var n=r(95004),o=r(5146);const i=function(e,t){var r=(0,o.useNavigation)();(0,n.useEffect)((function(){var t=function(t){t.preventDefault(),e()};return r.addListener("beforeRemove",t),function(){r.removeListener("beforeRemove",t)}}),t)}},83132:(e,t,r)=>{r.r(t),r.d(t,{ModalsProvider:()=>f,default:()=>h});var n=r(4942),o=r(29439),i=r(95004),a=r(99294),l=r(48469),s=r(2629);function u(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function c(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?u(Object(r),!0).forEach((function(t){(0,n.default)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):u(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var d=(0,i.createContext)({setModal:function(){}}),f=function(e){var t=e.children,r=e.modals,n=(0,i.useState)([]),u=(0,o.default)(n,2),f=u[0],h=u[1],g=(0,l.default)(),p=(0,i.useState)("none"),y=(0,o.default)(p,2),b=y[0],x=y[1];return(0,i.useEffect)((function(){0==f.filter((function(e){return e.visible})).length&&x("landscape"==g?"fade":"slide")}),[g]),(0,i.useEffect)((function(){h(r.map((function(e){return{Component:e,props:null,visible:!1}})))}),[r]),(0,s.jsxs)(d.Provider,{value:{setModal:function(e,t){var r=f.map((function(r){return null==e?c(c({},r),{},{visible:!1}):r.Component==e?{Component:e,props:null!==t?t:r.props,visible:null!==t}:r}));h(r)}},children:[t,f.map((function(e,t){var r=e.Component,n=e.props,o=e.visible;return(0,s.jsx)(a.default,{animationType:b,visible:o,transparent:!0,children:(0,s.jsx)(r,c({},n))},t)}))]})};const h=function(){return(0,i.useContext)(d)}},48469:(e,t,r)=>{r.r(t),r.d(t,{ResizeContextProvider:()=>f,default:()=>h});var n=r(29439),o=r(95004),i=r(14584),a=r(89555),l=r(91938),s=r.n(l),u=r(2629),c=function(e){return e.height>=e.width?"portrait":"landscape"},d=(0,o.createContext)(c(i.default.get("window"))),f=function(e){var t=e.children,r=s()(),i=(0,a.default)(),l=i.width,f=i.height,h=(0,o.useState)(c({width:l,height:f})),g=(0,n.default)(h,2),p=g[0],y=g[1];return(0,o.useEffect)((function(){y(c({width:l,height:f}))}),[l,f]),(0,u.jsx)(d.Provider,{value:r.isMobile()?"portrait":p,children:t})};function h(){return(0,o.useContext)(d)}},47754:(e,t,r)=>{r.r(t),r.d(t,{UploadContextProvider:()=>f,default:()=>h});var n=r(29439),o=r(4942),i=r(93433),a=r(95004),l=r(2629);function s(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function u(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?s(Object(r),!0).forEach((function(t){(0,o.default)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):s(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var c=(0,a.createContext)({upload:{},dispatch:function(){}}),d=function(e,t){var r=(0,i.default)(e[t.channel]||[]),n=r.findIndex((function(e){return e.filename==t.filename}));return n>=0?r[n]={filename:t.filename,progress:t.progress}:r.push({filename:t.filename,progress:t.progress}),u(u({},e),{},(0,o.default)({},t.channel,r.filter((function(e){return(e.progress||0)<1}))))},f=function(e){var t=e.children,r=(0,a.useReducer)(d,{}),o=(0,n.default)(r,2),i=o[0],s=o[1];return(0,l.jsx)(c.Provider,{value:{upload:i,dispatch:s},children:t})};function h(){return(0,a.useContext)(c)}},90270:(e,t,r)=>{r.r(t),r.d(t,{WebSocketInternalProvider:()=>f,WebSocketProvider:()=>h,default:()=>g});var n=r(29439),o=r(95004),i=r(79764),a=r(93141),l=r(90519),s=r(26666),u=r(2629),c={lastJsonMessage:void 0,sendJsonMessage:function(){}},d=(0,o.createContext)(c),f=function(e){var t=e.children,r=e.path,d=e.Context,f=e.useBackground,h=(0,o.useState)(null),g=(0,n.default)(h,2),p=g[0],y=g[1],b=(0,o.useState)(f||"active"==s.default.currentState),x=(0,n.default)(b,2),v=x[0],m=x[1],j=(0,i.default)(a.websockerURL+"/"+r,{shouldReconnect:function(e){return!0},protocols:p?["Authorization",p]:void 0,onOpen:function(e){console.log("success websocket connection("+r+")")},onClose:function(e){console.log("closed websocket connection("+r+")")}},v&&null!=p),w=j.lastJsonMessage,O=j.sendJsonMessage;return(0,o.useEffect)((function(){l.default.getItem("Authorization").then(y);var e=s.default.addEventListener("change",(function(e){return m(f||"active"==e)}));return function(){return e.remove()}}),[]),(0,u.jsx)(d.Provider,{value:null!=p?{lastJsonMessage:w,sendJsonMessage:O}:c,children:t})},h=function(e){var t=e.disable,r=e.children;return t?(0,u.jsx)(u.Fragment,{children:r}):(0,u.jsx)(f,{path:"messenger/ws/",Context:d,children:r})};const g=function(){return(0,o.useContext)(d)}},30230:(e,t,r)=>{r.r(t),r.d(t,{default:()=>b});r(95004);var n=r(93976),o=r(14521),i=r(83132),a=r(26944),l=r(56675),s=r(98307),u=r(29066),c=r(40150),d=r(8070),f=r(54243),h=r(40640),g=r(89134),p=r(2629),y=/<\/?[^>]*>/gi;function b(e){var t=e.content,r=e.isOwner,x=e.sendToScreen;console.log("@");var v=t.message_set[0],m=t.attatchment_set.filter((function(e){return"editor"==e.type})),j=m.length>0?m[0]:void 0,w=j?j.title.concat("\r\n",j.description.replaceAll(y,"")):v.content,O=(0,l.default)().lang,C=(0,i.default)().setModal,P=(0,f.default)(),S=(0,h.useMessengerContentMutation)(),k=function(){C(b,null)};return(0,g.default)(k,[]),(0,p.jsxs)(s.BottomSheet,{children:[(0,p.jsxs)(a.View,{style:{flexDirection:"row",width:"100%"},children:[(0,p.jsx)(a.View,{style:{flex:1,flexDirection:"row"},children:(0,p.jsx)(u.TouchableOpacity,{onPress:k,children:(0,p.jsx)(d.Ionicons,{size:20,name:"arrow-back",color:c.default[P].text})})}),(0,p.jsx)(a.View,{style:{flex:1},children:(0,p.jsx)(a.Text,{style:{fontSize:20,textAlign:"center"},children:O("Message")})}),(0,p.jsx)(a.View,{style:{flex:1}})]}),(0,p.jsx)(a.View,{style:{marginBottom:20,height:1,width:"100%"},lightColor:"#ddd",darkColor:"rgba(255,255,255, 0.3)"}),(0,p.jsx)(o.default,{style:{height:40,width:"100%",maxWidth:320,justifyContent:"center"},title:O("copy"),onPress:function(){n.default.setString(w),k()}}),j&&x&&(0,p.jsx)(o.default,{style:{height:40,width:"100%",maxWidth:320,justifyContent:"center"},title:O("move to editor"),onPress:function(){x({value:j.title,editorValue:j.description}),k()}}),r&&t.timer&&(0,p.jsx)(o.default,{style:{height:40,width:"100%",maxWidth:320,justifyContent:"center"},textStyle:{color:"red"},title:O("delete timer"),onPress:function(){S.patch({id:t.id,timer:null}),k()}}),r&&(0,p.jsx)(o.default,{style:{height:40,width:"100%",maxWidth:320,justifyContent:"center"},textStyle:{color:"red"},title:O("delete"),onPress:function(){S.patch({id:t.id,is_archive:!0}),k()}})]})}},92511:(e,t,r)=>{r.r(t),r.d(t,{default:()=>L});var n=r(4942),o=r(95004),i=r(39385),a=r(45288),l=r(29066),s=r(40640),u=r(78684),c=r(83132),d=r(26944),f=r(22339),h=r(43287),g=r(25722),p=r(40820),y=r(2629);const b=function(e){var t=e.link,r=e.isMobile;return(0,y.jsx)(p.default,{containerStyle:{marginHorizontal:0},bodyStyle:{padding:0},children:(0,y.jsxs)(l.TouchableOpacity,{onPress:function(){return g.default.openURL(t.url)},onLongPress:function(){},style:{width:"100%",flexDirection:"row"},children:[t.image_url?(0,y.jsx)(h.default,{source:{uri:t.image_url},resizeMode:"cover",style:{width:"100%",maxWidth:r?120:150,maxHeight:r?120:150,borderWidth:1}}):void 0,(0,y.jsxs)(d.View,{style:{flex:1,marginHorizontal:20},children:[(0,y.jsx)(d.Text,{style:{fontSize:18},children:t.title}),(0,y.jsx)(d.Text,{style:{fontSize:14},children:t.description}),(0,y.jsx)(d.Text,{style:{fontSize:12},children:t.url})]})]})})};var x=r(8070),v=r(54243),m=r(40150);function j(e){var t=0==e?0:Math.floor(Math.log(e)/Math.log(1024));return(e/Math.pow(1024,t)).toFixed(2)+" "+["B","kB","MB","GB","TB"][t]}const w=function(e){var t=e.file,r=e.isMobile,n=e.showBorder,o=(0,v.default)();return(0,y.jsx)(p.default,{containerStyle:{marginHorizontal:0},bodyStyle:n?{padding:10}:{borderWidth:0,padding:0},children:(0,y.jsxs)(l.TouchableOpacity,{onPress:function(){return g.default.openURL(t.file)},onLongPress:function(){},style:{flexDirection:"row",alignItems:"flex-start",width:"100%"},children:[t.thumbnail?(0,y.jsx)(h.default,{source:{uri:t.thumbnail},resizeMode:"cover",style:{width:r?120:150,height:r?120:150,borderWidth:1}}):(0,y.jsx)(x.FontAwesome,{name:"file-o",size:20,color:m.default[o].iconColor}),(0,y.jsxs)(d.View,{style:{flex:1,marginHorizontal:10},children:[(0,y.jsx)(d.Text,{style:{fontSize:18},children:t.filename}),(0,y.jsx)(d.Text,{style:{fontSize:14},children:j(t.filesize)})]})]})})};var O=r(30230),C=r(48162),P=r(46563),S=r(15861),k=r(51641),D=r(98735);var M=o.lazy((function(){return r.e(982).then(r.t.bind(r,33982,23))}));const T=o.memo((function(e){var t=e.content,r=(0,v.default)();return(0,y.jsxs)(d.View,{children:[(0,y.jsx)(d.Text,{style:{fontSize:18,fontWeight:"600",minWidth:140},children:t.title}),(0,y.jsx)(p.default,{containerStyle:{width:"100%",margin:0},bodyStyle:{borderWidth:0,borderRadius:0,borderTopWidth:1,padding:0,alignItems:"flex-start"},children:(0,y.jsx)(M,{contentWidth:320,source:{html:t.description},baseStyle:{color:m.default[r].text}})})]})}));function z(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function E(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?z(Object(r),!0).forEach((function(t){(0,n.default)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):z(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var I=o.memo((function(e){for(var t,r=(0,u.default)(),n=e.next;null!=(o=n)&&o.next&&0==n.current.length;){var o;n=n.next}var l=null==(t=n)?void 0:t.current[0];return(0,y.jsx)(i.default,{style:{flexDirection:e.reverse?"column-reverse":"column"},children:e.current.map((function(t,n){var o=n+1<e.current.length?e.current[n+1]:l,s=t.created.slice(0,16),u=s.slice(0,10),c=null==t.user,h=void 0==o||t.user!=o.user||s!=o.created.slice(0,16),g=e.ownerId==t.user,x=void 0==o||u!=o.created.slice(0,10),v=t.message_set[0];return c?(0,y.jsx)(i.default,{style:{flexDirection:"row",justifyContent:"center",width:"100%",marginVertical:5},children:(0,y.jsx)(d.Text,{children:v.content})},t.id):(0,y.jsxs)(i.default,{children:[x?(0,y.jsx)(i.default,{style:{flexDirection:"row",justifyContent:"center",width:"100%"},children:(0,y.jsx)(d.Text,{children:u})}):void 0,(0,y.jsxs)(i.default,{style:{flexDirection:"row",justifyContent:g?"space-between":"flex-start",width:"100%"},children:[h&&!g?(0,y.jsx)(i.default,{style:{marginTop:3,marginLeft:12},children:(0,y.jsx)(f.default,{name:t.name,userId:t.user,size:36})}):(0,y.jsx)(i.default,{style:{width:48}}),(0,y.jsx)(p.default,{autoScale:!0,outerContainerStyle:{maxWidth:"90%"},title:h?t.name:void 0,titleStyle:{flex:void 0},bodyStyle:{padding:10},subtitle:""+s.slice(11),children:(0,y.jsxs)(a.default,{onLongPress:null==e.getOnPress?void 0:e.getOnPress(t),children:[t.timer&&(0,y.jsxs)(i.default,{style:{flexDirection:"row",alignItems:"stretch"},children:[(0,y.jsx)(d.Text,{style:{fontSize:12},children:"\u231a"}),(0,y.jsx)(d.Text,{style:{fontSize:12},selectable:!r,children:(0,P.timerToString)(t.timer)})]}),(0,y.jsx)(C.default,{linkDefault:!0,style:{wordBreak:"break-word"},linkStyle:{color:"#12b886"},children:(0,y.jsx)(d.Text,{selectable:!r,style:{textAlign:g?"right":"left"},children:v.content})}),t.attatchment_set.map((function(e,t){return"editor"==e.type?(0,y.jsx)(T,{content:e},t):"file"==e.type?(0,y.jsx)(w,{file:e,isMobile:r,showBorder:!1},t):"link"==e.type?(0,y.jsx)(b,{link:e,isMobile:r},t):void 0}))]})})]},t.id)]},t.id)}))})}));const L=function(e){var t=(0,o.useRef)(0),r=e.auth?(0,s.default)(e.channel_id):function(e){var t=(0,k.useInfiniteQuery)(["ViewerContentList",e],function(){var t=(0,S.default)((function*(t){var r=t.pageParam;return(0,D.getMessengerContentList)(e,r,!0).then((function(e){return{current:e}}))}));return function(e){return t.apply(this,arguments)}}(),{select:function(e){return e.pages.length>1&&(e.pages[e.pages.length-2].next=e.pages[e.pages.length-1]),e},getNextPageParam:function(e){return null!=e&&e.current.length?e.current[e.current.length-1].id:void 0},refetchOnReconnect:!1,refetchOnWindowFocus:!1});return{data:t.data,fetchNextPage:t.fetchNextPage}}(e.channel_id),n=r.data,i=r.fetchNextPage,a=(0,o.useMemo)((function(){var t,r;return null==(t=e.auth)||null==(r=t.user)?void 0:r.id}),[e.auth]),u=(0,c.default)().setModal,d=function(t){return function(){return u(O.default,{content:t,isOwner:a==t.user,sendToScreen:e.sendToScreen})}},f=(0,o.useCallback)((function(t){var r=t.item;t.index;return(0,y.jsx)(I,E(E({},r),{},{ownerId:a,reverse:e.reverse,getOnPress:d}))}),[a,e.sendToScreen]);return(0,y.jsx)(l.FlatList,{style:{flexDirection:e.reverse?"column-reverse":"column"},contentContainerStyle:{padding:10,flexGrow:1,flexDirection:e.reverse?"column-reverse":"column"},data:null==n?void 0:n.pages,renderItem:f,onScroll:function(r){r.nativeEvent.contentSize.height-t.current+(e.reverse?1:-1)*r.nativeEvent.contentOffset.y<1&&i()},onLayout:function(e){t.current=e.nativeEvent.layout.height}})}},46563:(e,t,r)=>{r.r(t),r.d(t,{default:()=>w,timerFormat:()=>x,timerToString:()=>m});var n=r(29439),o=r(95004),i=r(57438),a=r.n(i),l=r(39385),s=r(45288),u=r(26944),c=r(93433),d=r(15861),f=r(51641),h=r(98735),g=r(90270);var p=r(22339),y=r(48162),b=r(2629);function x(e){return v(a()(e),a()())}function v(e,t){return e.year()!=t.year()?e.format("YYYY.MM"):e.month()!=t.month()||e.date()!=t.date()?e.format("MM.DD"):e.format("HH:mm")}function m(e){return a()(e).format("YYYY.MM.DD HH:mm")}var j=function(e){var t=a()(e.data.created),r=a()(e.data.timer),n=t.diff(e.now)/t.diff(r),o=e.data.message_set[0];return(0,b.jsx)(s.default,{onPress:function(){return e.setExpand(e.isExpand?void 0:e.data.id)},children:(0,b.jsxs)(l.default,{style:{backgroundColor:"lightgray",borderRadius:20,overflow:"hidden",margin:5},children:[(0,b.jsx)(l.default,{style:{backgroundColor:"darkgray",position:"absolute",width:100*n+"%",height:"100%"}}),e.isExpand?(0,b.jsxs)(l.default,{style:{paddingVertical:5,paddingHorizontal:5,maxWidth:270},children:[(0,b.jsxs)(l.default,{style:{flexDirection:"row"},children:[(0,b.jsx)(p.default,{name:e.data.name,userId:e.data.user,size:20}),(0,b.jsx)(l.default,{style:{paddingHorizontal:5},children:(0,b.jsx)(u.Text,{children:e.data.name})})]}),e.data.timer&&(0,b.jsxs)(l.default,{style:{flexDirection:"row",alignItems:"stretch"},children:[(0,b.jsx)(u.Text,{children:"\u231a"}),(0,b.jsx)(u.Text,{selectable:!0,children:m(e.data.timer)})]}),(0,b.jsx)(y.default,{linkDefault:!0,style:{wordBreak:"break-word"},linkStyle:{color:"#12b886"},children:(0,b.jsx)(u.Text,{selectable:!0,children:o.preview_content||o.content})})]}):(0,b.jsxs)(l.default,{style:{paddingVertical:5,paddingHorizontal:5,flexDirection:"row"},children:[(0,b.jsx)(p.default,{name:e.data.name,userId:e.data.user,size:20}),(0,b.jsx)(l.default,{style:{paddingHorizontal:5},children:(0,b.jsx)(u.Text,{children:v(r,e.now)})})]})]})})};const w=function(e){var t=function(e){var t=(0,f.useQueryClient)(),r=(0,f.useQuery)(["TimerMessageContentList",e],(0,d.default)((function*(){return yield(0,h.getTimerMessageContentList)(e,a()().toISOString())})),{refetchOnReconnect:!1,refetchOnWindowFocus:!1}).data,n=(0,g.default)().lastJsonMessage;(0,o.useEffect)((function(){null!=n&&n.data.channel==e&&("next_message"==n.type&&n.data.timer&&a()()<a()(n.data.timer)&&t.setQueryData(["TimerMessageContentList",e],(function(e){return[].concat((0,c.default)(e||[]),[n.data])})),"update_message"==n.type&&t.setQueryData(["TimerMessageContentList",e],(function(e){return(0,c.default)((null==e?void 0:e.filter((function(e){return e.id!=n.data.id||null!=n.data.timer&&!n.data.is_archive})))||[])})))}),[n]);var i=(0,o.useMemo)((function(){return null==r?void 0:r.sort((function(e,t){return(e.timer||"")>(t.timer||"")?1:-1}))}),[r]);return(0,o.useEffect)((function(){var r;if(null!=i&&null!=(r=i[0])&&r.timer){var n=i[0].id,o=Math.min(a()(i[0].timer).diff(a()()),Number.MAX_VALUE),l=setTimeout((function(){t.setQueryData(["TimerMessageContentList",e],(function(e){return(e||[]).filter((function(e){return e.id!=n||a()(e.timer).diff(a()())>0}))}))}),o);return function(){return clearTimeout(l)}}}),[i]),i}(e.channel_id),r=(0,o.useState)(a()()),i=(0,n.default)(r,2),s=i[0],u=i[1],p=(0,o.useState)(),y=(0,n.default)(p,2),x=y[0],v=y[1];return(0,o.useEffect)((function(){var e=setTimeout((function(){u(a()())}),2e3);return function(){return clearTimeout(e)}}),[s]),(0,b.jsx)(l.default,{style:{flexDirection:"row",paddingTop:5,paddingHorizontal:20},children:null==t?void 0:t.map((function(e,t){return(0,b.jsx)(j,{data:e,now:s,isExpand:e.id==x,setExpand:v},t)}))})}}}]);
//# sourceMappingURL=511.4880b5ee.chunk.js.map