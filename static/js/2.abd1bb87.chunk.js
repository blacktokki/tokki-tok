(this.webpackJsonp=this.webpackJsonp||[]).push([[2],{246:function(e,t,n){"use strict";n.d(t,"a",(function(){return g})),n.d(t,"b",(function(){return p}));var r=n(9),o=n.n(r),i=n(68),c=n.n(i),a=(n(0),n(247)),s=n(39),u=n(249),l=n(104),d=n(11),f=["style","lightColor","darkColor"],b=["style","lightColor","darkColor"];function j(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function h(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?j(Object(n),!0).forEach((function(t){o()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):j(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function O(e,t){var n=Object(l.a)(),r=e[n];return r||u.a[n][t]}function g(e){var t=e.style,n=e.lightColor,r=e.darkColor,o=c()(e,f),i=O({light:n,dark:r},"text");return Object(d.jsx)(a.a,h({style:[{color:i},t]},o))}function p(e){var t=e.style,n=e.lightColor,r=e.darkColor,o=c()(e,b),i=O({light:n,dark:r},"background");return Object(d.jsx)(s.a,h({style:[{backgroundColor:i},t]},o))}},249:function(e,t,n){"use strict";t.a={light:{text:"#000",background:"#fff",tint:"#2f95dc",tabIconDefault:"#ccc",tabIconSelected:"#2f95dc",hoverColor:"rgb(242,242,242)",buttonBackgroundColor:"#f6f8fa",header:"#f6f8fa",headerBottomColor:"rgb(216, 216, 216)",buttonBorderColor:"rgba(27,31,36,0.15)",iconColor:"black"},dark:{text:"#fff",background:"#000",tint:"#fff",tabIconDefault:"#ccc",tabIconSelected:"#fff",hoverColor:"#010409",buttonBackgroundColor:"#010409",header:"#010409",headerBottomColor:"rgb(40, 40, 40)",buttonBorderColor:"rgba(229,225,220,0.15)",iconColor:"white"},borderColor:"#d0d7de",focus:"#0065A4"}},259:function(e,t,n){"use strict";n.d(t,"a",(function(){return j}));var r=n(9),o=n.n(r),i=n(17),c=n.n(i),a=n(0),s=n(497),u=n(266),l=n(11);function d(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function f(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?d(Object(n),!0).forEach((function(t){o()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):d(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var b=Object(a.createContext)({setModal:function(){}}),j=function(e){var t=e.children,n=e.modals,r=Object(a.useState)([]),o=c()(r,2),i=o[0],d=o[1],j=Object(u.b)(),h=Object(a.useState)("none"),O=c()(h,2),g=O[0],p=O[1];return Object(a.useEffect)((function(){0==i.filter((function(e){return e.visible})).length&&p("landscape"==j?"fade":"slide")}),[j]),Object(a.useEffect)((function(){d(n.map((function(e){return{Component:e,props:null,visible:!1}})))}),[n]),Object(l.jsxs)(b.Provider,{value:{setModal:function(e,t){var n=i.map((function(n){return null==e?f(f({},n),{},{visible:!1}):n.Component==e?{Component:e,props:null!==t?t:n.props,visible:null!==t}:n}));d(n)}},children:[t,i.map((function(e,t){var n=e.Component,r=e.props,o=e.visible;return Object(l.jsx)(s.a,{animationType:g,visible:o,transparent:!0,children:Object(l.jsx)(n,f({},r))},t)}))]})};t.b=function(){return Object(a.useContext)(b)}},261:function(e,t,n){"use strict";var r=n(9),o=n.n(r),i=n(17),c=n.n(i),a=n(0),s=n(247),u=n(29),l=n(352),d=n(249),f=n(104),b=n(11);function j(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function h(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?j(Object(n),!0).forEach((function(t){o()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):j(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var O=function(e){var t=Object(a.useState)(!1),n=c()(t,2),r=n[0],o=n[1];return Object(b.jsx)(l.a,{onPress:function(){return e.onPress()},onHoverIn:function(){return o(!0)},onHoverOut:function(){return o(!1)},disabled:e.disabled,style:[{paddingVertical:5,paddingHorizontal:16},e.style,r||e.disabled?{backgroundColor:e.color,borderColor:e.borderColor}:{}],children:e.children?e.children:Object(b.jsx)(s.a,{selectable:!1,style:[{fontSize:14},e.textStyle],children:e.title})})};t.a=function(e){var t=Object(f.a)(),n=h(h({color:d.a[t].hoverColor,borderColor:"light"==t?d.a[t].buttonBorderColor:"#7d8590"},e),{},{style:[g.style,{backgroundColor:d.a[t].buttonBackgroundColor,borderColor:d.a[t].buttonBorderColor},e.style],textStyle:[g.text,{color:d.a[t].text},e.textStyle]});return Object(b.jsx)(O,h({},n))};var g=u.a.create({style:{borderRadius:6,borderWidth:1},text:{textAlign:"center",fontWeight:"600"}})},266:function(e,t,n){"use strict";n.d(t,"a",(function(){return b})),n.d(t,"b",(function(){return j}));var r=n(17),o=n.n(r),i=n(0),c=n(40),a=n(325),s=n(135),u=n.n(s),l=n(11),d=function(e){return e.height>=e.width?"portrait":"landscape"},f=Object(i.createContext)(d(c.a.get("window"))),b=function(e){var t=e.children,n=u()(),r=Object(a.a)(),c=r.width,s=r.height,b=Object(i.useState)(d({width:c,height:s})),j=o()(b,2),h=j[0],O=j[1];return Object(i.useEffect)((function(){O(d({width:c,height:s}))}),[c,s]),Object(l.jsx)(f.Provider,{value:n.isMobile()?"portrait":h,children:t})};function j(){return Object(i.useContext)(f)}},291:function(e,t,n){"use strict";n.d(t,"a",(function(){return l}));var r=n(9),o=n.n(r),i=(n(0),n(686)),c=n(11),a=function(e,t,n){return Math.floor(e%(n-t)+t)},s=function(e){var t=function(e,t){for(var n=t||0,r=0;r<e.length;r++)n=e.charCodeAt(r)+((n<<5)-n);return n=Math.abs(n),"hsl("+a(n,0,360)+", "+a(n,0,100)+"%, "+a(n,25,75)+"%)"}(e.name,e.userId);return Object(c.jsx)(i.a.Text,{style:{backgroundColor:t},size:e.size,label:e.name.split(" ").map((function(e){return e[0]})).join().toUpperCase()})};function u(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e,t){var n,r=e.name;return e.member_count<3&&(n=1==e.member_count||(null==t?void 0:t.id)==e.subowner.id?e.owner:e.subowner,r=r.length>0?r:n.name),{avatar:n,name:r}}t.b=function(e){return Object(c.jsx)(s,function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?u(Object(n),!0).forEach((function(t){o()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):u(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({},e))}},296:function(e,t,n){"use strict";n.d(t,"a",(function(){return c}));n(0);var r=n(297),o=n(266),i=n(11);t.b=function(e){var t=Object(o.b)();return Object(i.jsx)(r.a,{autoScale:!0,outerContainerStyle:{flex:1,alignSelf:"center",backgroundColor:"#8888",flexShrink:1,width:"100%"},containerStyle:{flex:1,margin:0,justifyContent:"center",alignItems:"center"},bodyStyle:"landscape"==t?{width:"90%",height:"90%",padding:"5%"}:{width:"100%",height:"100%",maxWidth:1080},children:e.children})};var c=function(e){return Object(i.jsx)(r.a,{autoScale:!0,outerContainerStyle:{flex:1,alignSelf:"center",backgroundColor:"#8888",width:"100%"},containerStyle:{flex:1,margin:0,justifyContent:"flex-end"},children:e.children})}},297:function(e,t,n){"use strict";n.d(t,"a",(function(){return a}));n(0);var r=n(246),o=n(29),i=n(249),c=n(11);function a(e){return Object(c.jsx)(r.b,{style:[s.outerContainer,e.autoScale?{}:s.outerContainerFill,e.outerContainerStyle],children:Object(c.jsxs)(r.b,{style:[s.container,e.containerStyle],children:[e.withSeparator?Object(c.jsx)(r.b,{style:s.separator,lightColor:"#ddd",darkColor:"rgba(255,255,255, 0.3)"}):void 0,e.title?Object(c.jsxs)(r.b,{style:s.titleView,children:[Object(c.jsx)(r.a,{style:[s.title,e.titleStyle],children:e.title}),Object(c.jsx)(r.a,{style:s.subtitle,children:e.subtitle})]}):void 0,Object(c.jsx)(r.b,{style:[s.bodyView,e.bodyStyle],children:e.children})]})})}var s=o.a.create({outerContainer:{alignItems:"stretch",backgroundColor:"transparent"},outerContainerFill:{width:"100%",maxWidth:1080},container:{marginHorizontal:20,marginVertical:10,backgroundColor:"transparent"},titleView:{width:"100%",flexDirection:"row",backgroundColor:"transparent",marginBottom:5},title:{flex:1,fontSize:16},subtitle:{flex:1,fontSize:12,textAlign:"right",marginTop:4},separator:{marginBottom:0,height:1,width:"100%"},bodyView:{width:"100%",padding:20,alignItems:"center",justifyContent:"center",borderWidth:1,borderColor:i.a.borderColor,borderRadius:6}})},312:function(e,t,n){"use strict";var r=n(0),o=n(336);t.a=function(e,t){var n=Object(o.useNavigation)();Object(r.useEffect)((function(){var t=function(t){t.preventDefault(),e()};return n.addListener("beforeRemove",t),function(){n.removeListener("beforeRemove",t)}}),t)}},326:function(e,t,n){"use strict";n.d(t,"a",(function(){return j})),n.d(t,"b",(function(){return h}));var r=n(17),o=n.n(r),i=n(0),c=n(756),a=n.n(c),s=n(51),u=n(38),l=n(413),d=n(11),f={lastJsonMessage:void 0,sendJsonMessage:function(){}},b=Object(i.createContext)(f),j=function(e){var t=e.children,n=e.path,r=e.Context,c=e.useBackground,b=Object(i.useState)(null),j=o()(b,2),h=j[0],O=j[1],g=Object(i.useState)(c||"active"==l.a.currentState),p=o()(g,2),y=p[0],x=p[1],v=a()(s.f+"/"+n,{shouldReconnect:function(e){return!0},protocols:h?["Authorization",h]:void 0,onOpen:function(e){console.log("success websocket connection("+n+")")},onClose:function(e){console.log("closed websocket connection("+n+")")}},y&&null!=h),m=v.lastJsonMessage,w=v.sendJsonMessage;return Object(i.useEffect)((function(){u.a.getItem("Authorization").then(O);var e=l.a.addEventListener("change",(function(e){return x(c||"active"==e)}));return function(){return e.remove()}}),[]),Object(d.jsx)(r.Provider,{value:null!=h?{lastJsonMessage:m,sendJsonMessage:w}:f,children:t})},h=function(e){var t=e.disable,n=e.children;return t?Object(d.jsx)(d.Fragment,{children:n}):Object(d.jsx)(j,{path:"messenger/ws/",Context:b,children:n})};t.c=function(){return Object(i.useContext)(b)}},430:function(e,t,n){"use strict";n.d(t,"a",(function(){return g})),n.d(t,"b",(function(){return p}));var r=n(4),o=n.n(r),i=n(43),c=n.n(i),a=n(9),s=n.n(a),u=n(0),l=n(71),d=n(72),f=n(326),b=n(431);function j(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function h(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?j(Object(n),!0).forEach((function(t){s()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):j(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var O=function(e,t){var n=0;e.forEach((function(e){n!=t.length&&(e.current.forEach((function(e){n!=t.length&&e.id==t[n].id&&(e.timer=t[n].timer,e.is_archive=t[n].is_archive,n+=1)})),e.current=e.current.filter((function(e){return!e.is_archive})))}))};function g(e){var t=Object(l.useQueryClient)(),n=Object(l.useInfiniteQuery)(["MessengerContentList",e],function(){var t=o()((function*(t){var n=t.pageParam;return Object(d.f)(e,n).then((function(e){return{current:e}}))}));return function(e){return t.apply(this,arguments)}}(),{select:function(e){return e.pages.length>1&&(e.pages[e.pages.length-2].next=e.pages[e.pages.length-1]),e},getNextPageParam:function(e){return null!=e&&e.current.length?e.current[e.current.length-1].id:void 0},refetchOnReconnect:!1,refetchOnWindowFocus:function(n){var r=new Date(n.state.dataUpdatedAt).toISOString(),o=h({},n.state.data);return Object(d.h)(e,r).then((function(n){if(o.pages){var r=o.pages[0].current[0].id||0,i=n.filter((function(e){return e.id>r&&0==e.is_archive})),a=n.filter((function(e){return e.id<=r})),s=i.findIndex((function(e){return e.timer}))>=0||a.length>0;o.pages[0].current=[].concat(c()(i),c()(o.pages[0].current)),O(o.pages,a),s&&t.invalidateQueries(["TimerMessageContentList",e])}})),!1}}),r=n.data,i=n.fetchNextPage,a=Object(f.c)().lastJsonMessage;return Object(u.useEffect)((function(){null!=a&&a.data.channel==e&&("next_message"==a.type&&t.setQueryData(["MessengerContentList",e],(function(e){return null!=e&&e.pages[0].current&&(null==e?void 0:e.pages[0].current[0].id)!=a.data.id&&(e.pages[0].current=[a.data].concat(c()(null==e?void 0:e.pages[0].current))),h({},e||{pages:[],pageParams:[]})})),"update_message"==a.type&&t.setQueryData(["MessengerContentList",e],(function(e){return(null==e?void 0:e.pages)&&O(e.pages,[a.data]),h({},e||{pages:[],pageParams:[]})})))}),[a]),{data:r,fetchNextPage:i}}function p(e){var t=Object(b.b)().dispatch,n=Object(l.useMutation)((function(e){return Object(d.r)(e,t)}),{onSuccess:function(){}}),r=Object(l.useMutation)(d.m);return{create:n.mutate,patch:r.mutate}}},431:function(e,t,n){"use strict";n.d(t,"a",(function(){return h})),n.d(t,"b",(function(){return O}));var r=n(17),o=n.n(r),i=n(9),c=n.n(i),a=n(43),s=n.n(a),u=n(0),l=n(11);function d(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function f(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?d(Object(n),!0).forEach((function(t){c()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):d(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var b=Object(u.createContext)({upload:{},dispatch:function(){}}),j=function(e,t){var n=s()(e[t.channel]||[]),r=n.findIndex((function(e){return e.filename==t.filename}));return r>=0?n[r]={filename:t.filename,progress:t.progress}:n.push({filename:t.filename,progress:t.progress}),f(f({},e),{},c()({},t.channel,n.filter((function(e){return(e.progress||0)<1}))))},h=function(e){var t=e.children,n=Object(u.useReducer)(j,{}),r=o()(n,2),i=r[0],c=r[1];return Object(l.jsx)(b.Provider,{value:{upload:i,dispatch:c},children:t})};function O(){return Object(u.useContext)(b)}},580:function(e,t,n){"use strict";n(0);var r=n(1164),o=n(246),i=n(11);t.a=function(e){return Object(i.jsx)(r.a,{linkDefault:!0,style:{wordBreak:"break-word"},linkStyle:{color:"#12b886"},onPress:e.onPressLink,children:Object(i.jsx)(o.a,{selectable:e.selectable,style:e.textStyle,children:e.content})})}},581:function(e,t,n){"use strict";n.d(t,"a",(function(){return p}));n(0);var r=n(577),o=n.n(r),i=n(261),c=n(259),a=n(246),s=n(90),u=n(296),l=n(271),d=n(249),f=n(107),b=n(104),j=n(430),h=n(312),O=n(582),g=n(11);function p(e){var t=e.content,n=e.isOwner,r=e.sendToScreen,y=t.message_set[0],x=t.attatchment_set.filter((function(e){return"editor"==e.type})),v=x.length>0?x[0]:void 0,m=v?v.title.concat("\r\n",v.description.replaceAll(O.b,"")):y.content,w=Object(s.b)().lang,C=Object(c.b)().setModal,P=Object(b.a)(),S=Object(j.b)(),D=function(){C(p,null)};return Object(h.a)(D,[]),Object(g.jsxs)(u.a,{children:[Object(g.jsxs)(a.b,{style:{flexDirection:"row",width:"100%"},children:[Object(g.jsx)(a.b,{style:{flex:1,flexDirection:"row"},children:Object(g.jsx)(l.c,{onPress:D,children:Object(g.jsx)(f.d,{size:20,name:"arrow-back",color:d.a[P].text})})}),Object(g.jsx)(a.b,{style:{flex:1},children:Object(g.jsx)(a.a,{style:{fontSize:20,textAlign:"center"},children:w("Message")})}),Object(g.jsx)(a.b,{style:{flex:1}})]}),Object(g.jsx)(a.b,{style:{marginBottom:20,height:1,width:"100%"},lightColor:"#ddd",darkColor:"rgba(255,255,255, 0.3)"}),Object(g.jsx)(i.a,{style:{height:40,width:"100%",maxWidth:320,justifyContent:"center"},title:w("copy"),onPress:function(){o.a.setString(m),D()}}),v&&r&&Object(g.jsx)(i.a,{style:{height:40,width:"100%",maxWidth:320,justifyContent:"center"},title:w("move to editor"),onPress:function(){r({value:v.title,editorValue:v.description}),D()}}),n&&t.timer&&Object(g.jsx)(i.a,{style:{height:40,width:"100%",maxWidth:320,justifyContent:"center"},textStyle:{color:"red"},title:w("delete timer"),onPress:function(){S.patch({id:t.id,timer:null}),D()}}),n&&Object(g.jsx)(i.a,{style:{height:40,width:"100%",maxWidth:320,justifyContent:"center"},textStyle:{color:"red"},title:w("delete"),onPress:function(){S.patch({id:t.id,is_archive:!0}),D()}})]})}},582:function(e,t,n){"use strict";n.d(t,"b",(function(){return d}));var r=n(0),o=n.n(r),i=n(297),c=n(246),a=n(104),s=n(249),u=n(11),l=o.a.lazy((function(){return n.e(5).then(n.t.bind(null,1004,7))})),d=/<\/?[^>]*>/gi;t.a=o.a.memo((function(e){var t=e.content,n=Object(a.a)();return Object(u.jsxs)(c.b,{children:[Object(u.jsx)(c.a,{style:{fontSize:18,fontWeight:"600",minWidth:140},children:t.title}),Object(u.jsx)(i.a,{containerStyle:{width:"100%",margin:0},bodyStyle:{borderWidth:0,borderRadius:0,borderTopWidth:1,padding:0,alignItems:"flex-start"},children:Object(u.jsx)(r.Suspense,{fallback:Object(u.jsx)(c.a,{children:t.description.replaceAll(d,"")}),children:Object(u.jsx)(l,{contentWidth:320,source:{html:t.description},baseStyle:{color:s.a[n].text}})})})]})}))},687:function(e,t,n){"use strict";var r=n(9),o=n.n(r),i=n(0),c=n.n(i),a=n(39),s=n(260),u=n(271),l=n(430),d=n(111),f=n(259),b=n(246),j=n(291),h=n(262),O=n(311),g=n(297),p=n(11),y=function(e){var t=e.link,n=e.isMobile,r=e.touchableRef;return Object(p.jsx)(g.a,{containerStyle:{marginHorizontal:0},bodyStyle:{padding:0},children:Object(p.jsxs)(u.c,{onPress:function(){return r.current()&&O.a.openURL(t.url)},onLongPress:function(){},style:{width:"100%",flexDirection:"row"},children:[t.image_url?Object(p.jsx)(h.a,{source:{uri:t.image_url},resizeMode:"cover",style:{width:"100%",maxWidth:n?120:150,maxHeight:n?120:150,borderWidth:1}}):void 0,Object(p.jsxs)(b.b,{style:{flex:1,marginHorizontal:20},children:[Object(p.jsx)(b.a,{style:{fontSize:18},children:t.title}),Object(p.jsx)(b.a,{style:{fontSize:14},children:t.description}),Object(p.jsx)(b.a,{style:{fontSize:12},children:t.url})]})]})})},x=n(107),v=n(104),m=n(249);function w(e){var t=0==e?0:Math.floor(Math.log(e)/Math.log(1024));return(e/Math.pow(1024,t)).toFixed(2)+" "+["B","kB","MB","GB","TB"][t]}var C=function(e){var t=e.file,n=e.isMobile,r=e.showBorder,o=e.touchableRef,i=Object(v.a)();return Object(p.jsx)(g.a,{containerStyle:{marginHorizontal:0},bodyStyle:r?{padding:10}:{borderWidth:0,padding:0},children:Object(p.jsxs)(u.c,{onPress:function(){return o.current()&&O.a.openURL(t.file)},onLongPress:function(){},style:{flexDirection:"row",alignItems:"flex-start",width:"100%"},children:[t.thumbnail?Object(p.jsx)(h.a,{source:{uri:t.thumbnail},resizeMode:"cover",style:{width:n?120:150,height:n?120:150,borderWidth:1}}):Object(p.jsx)(x.c,{name:"file-o",size:20,color:m.a[i].iconColor}),Object(p.jsxs)(b.b,{style:{flex:1,marginHorizontal:10},children:[Object(p.jsx)(b.a,{style:{fontSize:18},children:t.filename}),Object(p.jsx)(b.a,{style:{fontSize:14},children:w(t.filesize)})]})]})})},P=n(581),S=n(690),D=n(4),k=n.n(D),M=n(71),z=n(72);var E=n(582),I=n(580);function _(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function W(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?_(Object(n),!0).forEach((function(t){o()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):_(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var L=c.a.memo((function(e){for(var t,n=Object(i.useRef)(Date.now()),r=Object(i.useRef)((function(){return Date.now()-n.current>350})),o=Object(d.a)(),c=e.next;null!=(u=c)&&u.next&&0==c.current.length;){var u;c=c.next}var l=null==(t=c)?void 0:t.current[0];return Object(p.jsx)(a.a,{style:{flexDirection:e.reverse?"column-reverse":"column"},onTouchMove:function(){n.current=Date.now()},children:e.current.map((function(t,n){var i=n+1<e.current.length?e.current[n+1]:l,c=t.created.slice(0,16),u=c.slice(0,10),d=null==t.user,f=void 0==i||t.user!=i.user||c!=i.created.slice(0,16),h=e.ownerId==t.user,O=void 0==i||u!=i.created.slice(0,10),x=t.message_set[0];return d?Object(p.jsx)(a.a,{style:{flexDirection:"row",justifyContent:"center",width:"100%",marginVertical:5},children:Object(p.jsx)(b.a,{children:x.content})},t.id):Object(p.jsxs)(a.a,{children:[O?Object(p.jsx)(a.a,{style:{flexDirection:"row",justifyContent:"center",width:"100%"},children:Object(p.jsx)(b.a,{children:u})}):void 0,Object(p.jsxs)(a.a,{style:{flexDirection:"row",justifyContent:h?"space-between":"flex-start",width:"100%"},children:[f&&!h?Object(p.jsx)(a.a,{style:{marginTop:3,marginLeft:12},children:Object(p.jsx)(j.b,{name:t.name,userId:t.user,size:36})}):Object(p.jsx)(a.a,{style:{width:48}}),Object(p.jsx)(g.a,{autoScale:!0,outerContainerStyle:{maxWidth:"90%"},title:f?t.name:void 0,titleStyle:{flex:void 0},bodyStyle:{padding:10},subtitle:""+c.slice(11),children:Object(p.jsxs)(s.a,{onLongPress:null==e.getOnPress?void 0:e.getOnPress(t),children:[t.timer&&Object(p.jsxs)(a.a,{style:{flexDirection:"row",alignItems:"stretch"},children:[Object(p.jsx)(b.a,{style:{fontSize:12},children:"\u231a"}),Object(p.jsx)(b.a,{style:{fontSize:12},selectable:!o,children:Object(S.c)(t.timer)})]}),Object(p.jsx)(I.a,{selectable:!o,textStyle:{textAlign:h?"right":"left"},onPressLink:r.current()?void 0:function(){},content:x.content}),t.attatchment_set.map((function(e,t){return"editor"==e.type?Object(p.jsx)(E.a,{content:e},t):"file"==e.type?Object(p.jsx)(C,{file:e,isMobile:o,showBorder:!1,touchableRef:r},t):"link"==e.type?Object(p.jsx)(y,{link:e,isMobile:o,touchableRef:r},t):void 0}))]})})]},t.id)]},t.id)}))})}));t.a=function(e){var t=Object(i.useRef)(0),n=e.auth?Object(l.a)(e.channel_id):function(e){var t=Object(M.useInfiniteQuery)(["ViewerContentList",e],function(){var t=k()((function*(t){var n=t.pageParam;return Object(z.f)(e,n,!0).then((function(e){return{current:e}}))}));return function(e){return t.apply(this,arguments)}}(),{select:function(e){return e.pages.length>1&&(e.pages[e.pages.length-2].next=e.pages[e.pages.length-1]),e},getNextPageParam:function(e){return null!=e&&e.current.length?e.current[e.current.length-1].id:void 0},refetchOnReconnect:!1,refetchOnWindowFocus:!1});return{data:t.data,fetchNextPage:t.fetchNextPage}}(e.channel_id),r=n.data,o=n.fetchNextPage,c=Object(i.useMemo)((function(){var t,n;return null==(t=e.auth)||null==(n=t.user)?void 0:n.id}),[e.auth]),a=Object(f.b)().setModal,s=function(t){return function(){return a(P.a,{content:t,isOwner:c==t.user,sendToScreen:e.sendToScreen})}},d=Object(i.useCallback)((function(t){var n=t.item;t.index;return Object(p.jsx)(L,W(W({},n),{},{ownerId:c,reverse:e.reverse,getOnPress:s}))}),[c]);return Object(p.jsx)(u.a,{style:{flexDirection:e.reverse?"column-reverse":"column"},contentContainerStyle:{padding:10,flexGrow:1,flexDirection:e.reverse?"column-reverse":"column"},data:null==r?void 0:r.pages,renderItem:d,onScroll:function(n){n.nativeEvent.contentSize.height-t.current+(e.reverse?1:-1)*n.nativeEvent.contentOffset.y<1&&o()},onLayout:function(e){t.current=e.nativeEvent.layout.height}})}},690:function(e,t,n){"use strict";n.d(t,"b",(function(){return v})),n.d(t,"c",(function(){return w}));var r=n(17),o=n.n(r),i=n(0),c=n(341),a=n.n(c),s=n(39),u=n(260),l=n(246),d=n(43),f=n.n(d),b=n(4),j=n.n(b),h=n(71),O=n(72),g=n(326);var p=n(291),y=n(580),x=n(11);function v(e){return m(a()(e),a()())}function m(e,t){return e.year()!=t.year()?e.format("YYYY.MM"):e.month()!=t.month()||e.date()!=t.date()?e.format("MM.DD"):e.format("HH:mm")}function w(e){return a()(e).format("YYYY.MM.DD HH:mm")}var C=function(e){var t=a()(e.data.created),n=a()(e.data.timer),r=t.diff(e.now)/t.diff(n),o=e.data.message_set[0];return Object(x.jsx)(u.a,{onPress:function(){return e.setExpand(e.isExpand?void 0:e.data.id)},children:Object(x.jsxs)(s.a,{style:{backgroundColor:"lightgray",borderRadius:20,overflow:"hidden",margin:5},children:[Object(x.jsx)(s.a,{style:{backgroundColor:"darkgray",position:"absolute",width:100*r+"%",height:"100%"}}),e.isExpand?Object(x.jsxs)(s.a,{style:{paddingVertical:5,paddingHorizontal:5,maxWidth:270},children:[Object(x.jsxs)(s.a,{style:{flexDirection:"row"},children:[Object(x.jsx)(p.b,{name:e.data.name,userId:e.data.user,size:20}),Object(x.jsx)(s.a,{style:{paddingHorizontal:5},children:Object(x.jsx)(l.a,{children:e.data.name})})]}),e.data.timer&&Object(x.jsxs)(s.a,{style:{flexDirection:"row",alignItems:"stretch"},children:[Object(x.jsx)(l.a,{children:"\u231a"}),Object(x.jsx)(l.a,{selectable:!0,children:w(e.data.timer)})]}),Object(x.jsx)(y.a,{selectable:!0,content:o.preview_content||o.content})]}):Object(x.jsxs)(s.a,{style:{paddingVertical:5,paddingHorizontal:5,flexDirection:"row"},children:[Object(x.jsx)(p.b,{name:e.data.name,userId:e.data.user,size:20}),Object(x.jsx)(s.a,{style:{paddingHorizontal:5},children:Object(x.jsx)(l.a,{children:m(n,e.now)})})]})]})})};t.a=function(e){var t=function(e){var t=Object(h.useQueryClient)(),n=Object(h.useQuery)(["TimerMessageContentList",e],j()((function*(){return yield Object(O.i)(e,a()().toISOString())})),{refetchOnReconnect:!1,refetchOnWindowFocus:!1}).data,r=Object(g.c)().lastJsonMessage;Object(i.useEffect)((function(){null!=r&&r.data.channel==e&&("next_message"==r.type&&r.data.timer&&a()()<a()(r.data.timer)&&t.setQueryData(["TimerMessageContentList",e],(function(e){return[].concat(f()(e||[]),[r.data])})),"update_message"==r.type&&t.setQueryData(["TimerMessageContentList",e],(function(e){return f()((null==e?void 0:e.filter((function(e){return e.id!=r.data.id||null!=r.data.timer&&!r.data.is_archive})))||[])})))}),[r]);var o=Object(i.useMemo)((function(){return null==n?void 0:n.sort((function(e,t){return(e.timer||"")>(t.timer||"")?1:-1}))}),[n]);return Object(i.useEffect)((function(){var n;if(null!=o&&null!=(n=o[0])&&n.timer){var r=o[0].id,i=Math.min(a()(o[0].timer).diff(a()()),Number.MAX_VALUE),c=setTimeout((function(){t.setQueryData(["TimerMessageContentList",e],(function(e){return(e||[]).filter((function(e){return e.id!=r||a()(e.timer).diff(a()())>0}))}))}),i);return function(){return clearTimeout(c)}}}),[o]),o}(e.channel_id),n=Object(i.useState)(a()()),r=o()(n,2),c=r[0],u=r[1],l=Object(i.useState)(),d=o()(l,2),b=d[0],p=d[1];return Object(i.useEffect)((function(){var e=setTimeout((function(){u(a()())}),2e3);return function(){return clearTimeout(e)}}),[c]),Object(x.jsx)(s.a,{style:{flexDirection:"row",paddingTop:5,paddingHorizontal:20},children:null==t?void 0:t.map((function(e,t){return Object(x.jsx)(C,{data:e,now:c,isExpand:e.id==b,setExpand:p},t)}))})}}}]);
//# sourceMappingURL=2.abd1bb87.chunk.js.map