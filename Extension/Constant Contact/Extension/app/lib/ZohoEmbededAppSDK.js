/* var ZOHO=function(){var c,l={},h=!1,n=void 0;return{embeddedApp:{on:function(b,c){l[b]=c},init:function(){if(!h){h=!0;c=new ZSDK;var b;n=new Promise(function(c,n){b=c});c.OnLoad(function(){b()});for(var t in l)c.getContext().Event.Listen(t,l[t])}return n}},CRM:function(){function b(a){a.sdkVersion="1";return c.getContext().Event.Trigger("CRM_EVENT",a,!0)}function n(a){return new File([a],a.name,{type:a.type})}function m(a,d,e,f){if(d.FileData){var c=n(d.FileData);d.FileData=c}a={category:"CREATE",
Entity:a,RelatedID:e,APIData:d};a.type=f||"RECORD";return b(a)}function l(a){a.category="BLUEPRINT";return b(a)}function h(a){a.category="APPROVALS";return b(a)}function p(a,d,e){if(d.FILE){var f=n(d.FILE.file);d.FILE.file=f}f=void 0;if(e)f=d;else{var f=d.url,c=d.params,g=d.headers,m=d.body,h=d.PARTS,l=d.PART_BOUNDARY,w=d.CONTENT_TYPE,D=d.RESPONSE_TYPE;d=d.FILE;if(!f)throw{Message:"Url missing"};if(c){var x,k=[];for(x in c)k.push(encodeURIComponent(x)+"\x3d"+encodeURIComponent(c[x]));x=k.join("\x26");
f+=(-1<f.indexOf("?")?"\x26":"?")+x}f={url:f,Header:g,Body:m,CONTENT_TYPE:w,RESPONSE_TYPE:D,PARTS:h,PARTS_BOUNDARY:l,FILE:d}}return b({category:"CONNECTOR",nameSpace:a,data:f,type:e})}function g(a){a['category'] = "UI";return b(a)}function r(a,d,e){return b({category:"CONFIG",type:a,nameSpace:d,APIData:e})}function u(a){var d={category:"USER"};a.ID?d.ID=a.ID:a.Type&&(d.Type=a.Type,a.page&&(d.page=a.page),a.per_page&&(d.per_page=a.per_page));return b(d)}function k(a){return b({category:"META",
type:a.type,Entity:a.Entity,Id:a.Id})}return{ACTION:{setConfig:function(a){return b({category:"ACTION",type:"CUSTOM_ACTION_SAVE_CONFIG",object:a})},enableAccountAccess:function(a){return b({category:"ACTION",type:"ENABLE_ACCOUNT_ACCESS",object:a})}},FUNCTIONS:{execute:function(a,d){var e={};d.auth_type="oauth";e.data=d;return b({category:"FUNCTIONS_EXECUTE",customFunctionName:a,data:e})}},CONFIG:{getOrgInfo:function(a){return r("ORG")},getCurrentUser:function(){return r("CURRENT_USER")},GetCurrentEnvironment:function(){return r("ORG_LEVEL_INFO")}},
META:{getFields:function(a){a.type="FIELD_LIST";return k(a)},getModules:function(){return k({type:"MODULE_LIST"})},getAssignmentRules:function(a){a.type="ASSIGNMENT_RULES";return k(a)},getLayouts:function(a){a.id=a.id?a.id:a.LayoutId;a.type=a.Id?"LAYOUT":"LAYOUTS";return k(a)},getRelatedList:function(a){a.type="RELATED_LIST";return k(a)},getCustomViews:function(a){a.type=a.Id?"CUSTOM_VIEW":"CUSTOM_VIEWS";return k(a)}},API:{addNotes:function(a){return m(a.Entity,{data:[{Note_Title:a.Title,Note_Content:a.Content}]},
a.RecordID,"NOTES")},addNotesAttachment:function(a){return b({category:"UPDATE",type:"NOTES",Entity:a.Entity,RecordID:a.RecordID,RelatedRecordID:a.RelatedRecordID,APIData:{Files:{FileName:File.Name,FileData:File.Content}}})},insertRecord:function(a){var d=a.Entity,e=a.APIData;e.trigger=a.Trigger;return m(d,e)},upsertRecord:function(a){var d=a.Entity,e=a.APIData;e.trigger=a.Trigger;e.action="UPSERT";a.duplicate_check_fields&&a.duplicate_check_fields instanceof Array&&(e.duplicate_check_fields=a.duplicate_check_fields.join(","));
return m(d,e)},getRecord:function(a){return b({category:"READ",APIData:{Entity:a.Entity,RecordID:a.RecordID,RelatedList:void 0}})},getBluePrint:function(a){return l({Entity:a.Entity,RecordID:a.RecordID,action:"GET_BLUEPRINT_STATUS"})},updateBluePrint:function(a){return l({Entity:a.Entity,RecordID:a.RecordID,BlueprintData:a.BlueprintData,action:"UPDATE_BLUEPRINT_STATUS"})},uploadFile:function(a){if(a.FILE){var d=n(a.FILE.file);a.FILE.file=d}return b({FileData:a,category:"FILES",type:"UPLOAD_FILE"})},
getFile:function(a){a.category="FILES";a.type="DOWNLOAD_FILE";return b(a)},getAllRecords:function(a){return b({category:"READ",APIData:a})},updateRecord:function(a){var d=a.Entity,e=a.APIData;e.trigger=a.Trigger;return b({category:"UPDATE",type:"RECORD",Entity:d,APIData:e})},deleteRecord:function(a){return b({category:"DELETE",type:"RECORD",Entity:a.Entity,RecordID:a.RecordID})},searchRecord:function(a){return b({category:"SEARCH",Entity:a.Entity,Type:a.Type,Query:a.Query,page:a.page,per_page:a.per_page,
delay:a.delay})},getAllActions:function(a){a.action="GET_ALL_ACTIONS";return h(a)},getApprovalRecords:function(a){var d={};a?a.action="GET_APPROVAL_RECORDS":(d.action="GET_APPROVAL_RECORDS",a=d);return h(a)},getApprovalById:function(a){a.action="GET_APPROVALBYID";return h(a)},getApprovalsHistory:function(){return h({action:"GET_APPROVALS_HISTORY"})},approveRecord:function(a){a.action="UPDATE_APPROVAL";return h(a)},getAllUsers:function(a){return u({Type:a.Type,page:a.page,per_page:a.per_page})},getUser:function(a){return u({ID:a.ID})},
getRelatedRecords:function(a){return b({category:"READ",APIData:a})},updateRelatedRecords:function(a){return b({category:"UPDATE",type:"RELATED_RECORD",Entity:a.Entity,RecordID:a.RecordID,RelatedList:a.RelatedList,RelatedRecordID:a.RelatedRecordID,APIData:a.APIData})},delinkRelatedRecord:function(a){return b({category:"DELETE",type:"RELATED_RECORD",Entity:a.Entity,RecordID:a.RecordID,RelatedList:a.RelatedList,RelatedRecordID:a.RelatedRecordID})},attachFile:function(a){var d=a.Entity,e=a.RecordID;
a=a.File;a={FileName:a.Name,FileData:a.Content};return m(d,a,e,"ATTACHMENT")},getAllProfiles:function(a){return b({category:"PROFILES",type:"GET_ALL_PROFILES"})},getProfile:function(a){return b({category:"PROFILES",type:"GET_PROFILE",ID:a.ID})},updateProfile:function(a){return b({category:"UPDATE",type:"PROFILE",ID:a.ID,APIData:a.APIData})},getOrgVariable:function(a){return r("VARIABLE",a)}},UI:{Resize:function(a){a={action:"RESIZE",data:{width:a.width,height:a.height}};return g(a)},Dialer:{maximize:function(){return g({action:{telephony:"MAXIMIZE"}})},
minimize:function(){return g({action:{telephony:"MINIMIZE"}})},notify:function(){return g({action:{telephony:"NOTIFY"}})}},Record:{open:function(a){a={action:{record:"OPEN"},data:{Entity:a.Entity,RecordID:a.RecordID,target:a.Target}};return g(a)},edit:function(a){a={action:{record:"EDIT"},data:{Entity:a.Entity,RecordID:a.RecordID,target:a.Target}};return g(a)},create:function(a){a={action:{record:"CREATE"},data:{Entity:a.Entity,RecordID:a.RecordID,target:a.Target}};return g(a)},populate:function(a){return g({action:{record:"POPULATE"},
data:a})}},Popup:{close:function(){return g({action:{popup:"CLOSE"}})},closeReload:function(){return g({action:{popup:"CLOSE_RELOAD"}})}},Widget:{open:function(a){a={action:{webTab:"OPEN"},data:a};return g(a)}}},HTTP:{get:function(a){return p("wget.get",a)},post:function(a){return p("wget.post",a)},put:function(a){return p("wget.put",a)},patch:function(a){return p("wget.patch",a)},delete:function(a){return p("wget.delete",a)}},CONNECTOR:{invokeAPI:function(a,d){return p(a,d,"CONNECTOR_API")},authorize:function(a){return p(a,
{},"CONNECTOR_AUTHORIZE")}},CONNECTION:{invoke:function(a,d){var e={},f={};f.url=d.url;f.method=d.method;f.param_type=d.param_type;f.parameters=JSON.stringify(d.parameters);f.headers=JSON.stringify(d.headers);e.data=f;return b({category:"CRM_CONNECTION",connectionName:a,data:e})}}}}()}}();var ZSDKUtil=function(c){function l(b){}function h(b){var c={};b=b||window.location.href;b.substr(b.indexOf("?")+1).split("\x26").forEach(function(b,n){var h=b.split("\x3d");c[h[0]]=h[1]});c.hasOwnProperty("serviceOrigin")&&(c.serviceOrigin=decodeURIComponent(c.serviceOrigin));return c}var n=h(),b;l.prototype.Info=function(){(c.isDevMode()||c.isLogEnabled())&&window.console.info.apply(null,arguments)};l.prototype.Error=function(){(c.isDevMode()||c.isLogEnabled())&&window.console.error.apply(null,
arguments)};c.GetQueryParams=h;c.isDevMode=function(){return n&&n.isDevMode};c.isLogEnabled=function(){return n&&n.isLogEnabled};c.getLogger=function(){b&&b instanceof l||(b=new l);return b};c.Sleep=function(b){for(var c=(new Date).getTime();c+b>(new Date).getTime(););};return c}(window.ZSDKUtil||{}),ZSDKMessageManager=function(c){function l(e){try{var f="string"===typeof e.data?JSON.parse(e.data):e.data}catch(c){f=e.data}var k=f.type,l=f.eventName;try{var m;if(!(m="SET_CONTEXT"===l)){var p=e.source,
q=e.origin;m=g.isAppRegistered()&&a===p&&d===q?!0:Error("Un-Authorized Message.")}if(m)switch(k){case "FRAMEWORK.EVENT":var w={SET_CONTEXT:h,UPDATE_CONTEXT:n,EVENT_RESPONSE:b,EVENT_RESPONSE_FAILURE:t}[f.eventName];w&&"function"===typeof w?w(e,f):ZSDKEventManager.NotifyEventListeners(g.AppContext,f.eventName,f.data);break;default:g.MessageInterceptor(e,f)}}catch(c){r.Error("[SDK.MessageHandler] \x3d\x3e ",c.stack)}}function h(e,b){a=window.parent;d=g.QueryParams.serviceOrigin;g.SetContext(b.data);
g.ExecuteLoadHandler()}function n(a,b){}function b(a,b){m(b.promiseid,!0,b.data)}function t(a,b){m(b.promiseid,!1,b.data)}function m(a,b,d){k.hasOwnProperty(a)&&(b?k[a].resolve(d):k[a].reject(d),k[a]=void 0,delete k[a])}function y(a){return new Promise(function(b,d){k[a]={resolve:b,reject:d,time:(new Date).getTime()}})}function v(b){"object"===typeof b&&(b.appOrigin=encodeURIComponent(p()));if(!a)throw Error("Parentwindow reference not found.");a.postMessage(b,g.QueryParams.serviceOrigin)}function p(){return window.location.protocol+
"//"+window.location.host+window.location.pathname}var g,r=ZSDKUtil.getLogger(),u=100,k={},a,d;c.Init=function(a,b){if(!a||"object"!==typeof a)throw Error("Invalid Context object passed");if(b&&"object"!==typeof b)throw Error("Invalid Configuration Passed to MessageManager");g=a;return l.bind(c)};c.RegisterApp=function(){var a={type:"SDK.EVENT",eventName:"REGISTER",appOrigin:encodeURIComponent(p())};window.parent.postMessage(a,g.QueryParams.serviceOrigin)};c.DERegisterApp=function(){var a={type:"SDK.EVENT",
eventName:"DEREGISTER",uniqueID:g.getUniqueID()};v(a)};c.SendRequest=function(a){if(!a||"object"!==typeof a)throw Error("Invalid Options passed");var b;b="Promise"+u++;a={type:"SDK.EVENT",eventName:"HTTP_REQUEST",uniqueID:g.getUniqueID(),time:(new Date).getTime(),promiseid:b,data:a};v(a);b=y(b);return b};c.TriggerEvent=function(a,b,d){if(!a)throw Error("Invalid Eventname : ",a);var c=d?"Promise"+u++:void 0;a={type:"SDK.EVENT",eventName:a,uniqueID:g.getUniqueID(),time:(new Date).getTime(),promiseid:c,
data:b};v(a);if(d)return y(c)};return c}(window.ZSDKMessageManager||{}),ZSDKEventManager=function(c){var l=ZSDKUtil.getLogger(),h={};c.AttachEventListener=function(c,b){"function"===typeof b&&(Array.isArray(h[c])||(h[c]=[]),h[c].push(b))};c.NotifyEventListeners=function(c,b,t){var m=b.match(/^\__[A-Za-z_]+\__$/gi);Array.isArray(m);if((m=h[b])&&Array.isArray(m))for(b=0;b<m.length;b++)m[b].call(c,t);else l.Info("Cannot find EventListeners for Event : ",b)};c.NotifyInternalEventHandler=function(c,b){var h=
b.eventName;"__APP_INIT__"===h?(c.SetContext(b.data),c.ExecuteLoadHandler()):"__APP_CONTEXT_UPDATE__"===h&&(c.UpdateContext(b.data),c.ExecuteContextUpdateHandler())};return c}(window.ZSDKEventManager||{});
function ZSDK(){function c(){"function"!==typeof k?z.Error("No OnLoad Handler provided to execute."):C?z.Error("OnLoad event already triggered."):(k.call(q,q),C=!0)}function l(){a.call(q,q)}function h(){return B}function n(a,b,d){return ZSDKMessageManager.TriggerEvent(a,b,d)}function b(a){z.Info("Setting AppContext data");var b=a&&a.model||{};isDevMode&&a.locale&&a.localeResource&&0===Object.keys(a.localeResource).length&&a.localeResource.constructor===Object&&a.locale&&v(a.locale);if("undefined"!==
typeof ZSDKModelManager){for(var c in b)ZSDKModelManager.AddModel(c,b[c]);q.Model=ZSDKModelManager.GetModelStore()}f=a.uniqueID;d=a.connectors;z.Info("App Connectors ",d);B=!0}function t(){return f}function m(a){}function y(){return d}function v(a){p("/app-translations/"+a+".json",function(a){A=JSON.parse(a);u()})}function p(a,b){var c=new XMLHttpRequest;c.open("GET",a,!1);c.onreadystatechange=function(){4==c.readyState&&"200"==c.status&&b(c.responseText)};c.send(null)}function g(a,b,c){for(var d=
"";d!=a;)d=a,a=a.replace(b,c);return a}function r(a,b){b=b.replace(/\[(\w+)\]/g,".$1");b=b.replace(/^\./,"");for(var c=b.split("."),d=0,e=c.length;d<e;++d){var f=c[d];if(f in a)a=a[f];else return}return a}function u(){var a=document.querySelectorAll("[data-i18n]"),b;for(b in a)if(a.hasOwnProperty(b)){var c=r(A,a[b].getAttribute("data-i18n"));if(!c)return!1;if(a[b].hasAttribute("data-options")){var d=JSON.parse(JSON.stringify(eval("("+a[b].getAttribute("data-options")+")"))),e=Object.keys(d),f;for(f in e)c=
g(c,"${"+e[f]+"}",d[e[f]])}a[b].innerHTML=c}}var k,a,d,e,f,A={},z=ZSDKUtil.getLogger(),B=!1,C=!1;this.isContextReady=!1;this.HelperContext={};this.isDevMode=!1;this.getContext=function(){return q};var q={Model:{},Event:{}};q.Event.Listen=function(a,b){ZSDKEventManager.AttachEventListener(a,b)};q.Event.Trigger=n;q.GetRequest=function(a){return ZSDKMessageManager.SendRequest(a)};q.QueryParams=e;q.Translate=function(a,b){var c="";a&&(c=r(A,a));if(!c)return!1;if(b){var d=JSON.parse(JSON.stringify(eval(b))),
e=Object.keys(d);for(a in e)c=g(c,"${"+e[a]+"}",d[e[a]])}return c};this.OnLoad=function(a){if("function"!==typeof a)throw Error("Invalid Function value is passed");k=a;B&&c()};this.OnUnLoad=function(a){};this.OnContextUpdate=function(b){a=b};(function(){e=ZSDKUtil.GetQueryParams();isDevMode=!!e.isDevMode;var a={};a.isDevMode=isDevMode;a.ExecuteLoadHandler=c;a.SetContext=b;a.UpdateContext=m;a.QueryParams=e;a.GetConnectors=y;a.TriggerEvent=n;a.ExecuteContextUpdateHandler=l;a.getUniqueID=t;a.isAppRegistered=
h;var d=ZSDKMessageManager.Init(a);window.addEventListener("message",d);window.addEventListener("unload",function(){ZSDKMessageManager.DERegisterApp()});"undefined"!==typeof ZSDKModelManager&&ZSDKModelManager.Init(a);ZSDKMessageManager.RegisterApp()})()}; */




var ZOHO = function() {
    var c, l = {},
        h = !1,
        n = void 0;
    return {
        embeddedApp: { on: function(b, c) { l[b] = c }, init: function() { if (!h) { h = !0;
                    c = new ZSDK; var b;
                    n = new Promise(function(c, n) { b = c });
                    c.OnLoad(function() { b() }); for (var t in l) c.getContext().Event.Listen(t, l[t]) } return n } },
        CRM: function() {
            function b(a) { a.sdkVersion = "1"; return c.getContext().Event.Trigger("CRM_EVENT", a, !0) }

            function n(a) { return new File([a], a.name, { type: a.type }) }

            function m(a, d, e, f) {
                if (d.FileData) { var c = n(d.FileData);
                    d.FileData = c }
                a = {
                    category: "CREATE",
                    Entity: a,
                    RelatedID: e,
                    APIData: d
                };
                a.type = f || "RECORD";
                return b(a)
            }

            function l(a) { a.category = "BLUEPRINT"; return b(a) }

            function h(a) { a.category = "APPROVALS"; return b(a) }

            function p(a, d, e) {
                if (d.FILE) { var f = n(d.FILE.file);
                    d.FILE.file = f }
                f = void 0;
                if (e) f = d;
                else {
                    var f = d.url,
                        c = d.params,
                        g = d.headers,
                        m = d.body,
                        h = d.PARTS,
                        l = d.PART_BOUNDARY,
                        w = d.CONTENT_TYPE,
                        D = d.RESPONSE_TYPE;
                    d = d.FILE;
                    if (!f) throw { Message: "Url missing" };
                    if (c) {
                        var x, k = [];
                        for (x in c) k.push(encodeURIComponent(x) + "\x3d" + encodeURIComponent(c[x]));
                        x = k.join("\x26");
                        f += (-1 < f.indexOf("?") ? "\x26" : "?") + x
                    }
                    f = { url: f, Header: g, Body: m, CONTENT_TYPE: w, RESPONSE_TYPE: D, PARTS: h, PARTS_BOUNDARY: l, FILE: d }
                }
                return b({ category: "CONNECTOR", nameSpace: a, data: f, type: e })
            }

            function g(a) { a['category'] = "UI"; return b(a) }

            function r(a, d, e) { return b({ category: "CONFIG", type: a, nameSpace: d, APIData: e }) }

            function u(a) { var d = { category: "USER" };
                a.ID ? d.ID = a.ID : a.Type && (d.Type = a.Type, a.page && (d.page = a.page), a.per_page && (d.per_page = a.per_page)); return b(d) }

            function k(a) {
                return b({
                    category: "META",
                    type: a.type,
                    Entity: a.Entity,
                    Id: a.Id
                })
            }
            return {
                ACTION: { setConfig: function(a) { return b({ category: "ACTION", type: "CUSTOM_ACTION_SAVE_CONFIG", object: a }) }, enableAccountAccess: function(a) { return b({ category: "ACTION", type: "ENABLE_ACCOUNT_ACCESS", object: a }) } },
                FUNCTIONS: { execute: function(a, d) { var e = {};
                        d.auth_type = "oauth";
                        e.data = d; return b({ category: "FUNCTIONS_EXECUTE", customFunctionName: a, data: e }) } },
                CONFIG: { getOrgInfo: function(a) { return r("ORG") }, getCurrentUser: function() { return r("CURRENT_USER") }, GetCurrentEnvironment: function() { return r("ORG_LEVEL_INFO") } },
                META: { getFields: function(a) { a.type = "FIELD_LIST"; return k(a) }, getModules: function() { return k({ type: "MODULE_LIST" }) }, getAssignmentRules: function(a) { a.type = "ASSIGNMENT_RULES"; return k(a) }, getLayouts: function(a) { a.id = a.id ? a.id : a.LayoutId;
                        a.type = a.Id ? "LAYOUT" : "LAYOUTS"; return k(a) }, getRelatedList: function(a) { a.type = "RELATED_LIST"; return k(a) }, getCustomViews: function(a) { a.type = a.Id ? "CUSTOM_VIEW" : "CUSTOM_VIEWS"; return k(a) } },
                API: {
                    addNotes: function(a) {
                        return m(a.Entity, { data: [{ Note_Title: a.Title, Note_Content: a.Content }] },
                            a.RecordID, "NOTES")
                    },
                    addNotesAttachment: function(a) { return b({ category: "UPDATE", type: "NOTES", Entity: a.Entity, RecordID: a.RecordID, RelatedRecordID: a.RelatedRecordID, APIData: { Files: { FileName: File.Name, FileData: File.Content } } }) },
                    insertRecord: function(a) { var d = a.Entity,
                            e = a.APIData;
                        e.trigger = a.Trigger; return m(d, e) },
                    upsertRecord: function(a) {
                        var d = a.Entity,
                            e = a.APIData;
                        e.trigger = a.Trigger;
                        e.action = "UPSERT";
                        a.duplicate_check_fields && a.duplicate_check_fields instanceof Array && (e.duplicate_check_fields = a.duplicate_check_fields.join(","));
                        return m(d, e)
                    },
                    getRecord: function(a) { return b({ category: "READ", APIData: { Entity: a.Entity, RecordID: a.RecordID, RelatedList: void 0 } }) },
                    getBluePrint: function(a) { return l({ Entity: a.Entity, RecordID: a.RecordID, action: "GET_BLUEPRINT_STATUS" }) },
                    updateBluePrint: function(a) { return l({ Entity: a.Entity, RecordID: a.RecordID, BlueprintData: a.BlueprintData, action: "UPDATE_BLUEPRINT_STATUS" }) },
                    uploadFile: function(a) { if (a.FILE) { var d = n(a.FILE.file);
                            a.FILE.file = d } return b({ FileData: a, category: "FILES", type: "UPLOAD_FILE" }) },
                    getFile: function(a) { a.category = "FILES";
                        a.type = "DOWNLOAD_FILE"; return b(a) },
                    getAllRecords: function(a) { return b({ category: "READ", APIData: a }) },
                    updateRecord: function(a) { var d = a.Entity,
                            e = a.APIData;
                        e.trigger = a.Trigger; return b({ category: "UPDATE", type: "RECORD", Entity: d, APIData: e }) },
                    deleteRecord: function(a) { return b({ category: "DELETE", type: "RECORD", Entity: a.Entity, RecordID: a.RecordID }) },
                    searchRecord: function(a) {
                        return b({
                            category: "SEARCH",
                            Entity: a.Entity,
                            Type: a.Type,
                            Query: a.Query,
                            page: a.page,
                            per_page: a.per_page,
                            delay: a.delay
                        })
                    },
                    getAllActions: function(a) { a.action = "GET_ALL_ACTIONS"; return h(a) },
                    getApprovalRecords: function(a) { var d = {};
                        a ? a.action = "GET_APPROVAL_RECORDS" : (d.action = "GET_APPROVAL_RECORDS", a = d); return h(a) },
                    getApprovalById: function(a) { a.action = "GET_APPROVALBYID"; return h(a) },
                    getApprovalsHistory: function() { return h({ action: "GET_APPROVALS_HISTORY" }) },
                    approveRecord: function(a) { a.action = "UPDATE_APPROVAL"; return h(a) },
                    getAllUsers: function(a) { return u({ Type: a.Type, page: a.page, per_page: a.per_page }) },
                    getUser: function(a) { return u({ ID: a.ID }) },
                    getRelatedRecords: function(a) { return b({ category: "READ", APIData: a }) },
                    updateRelatedRecords: function(a) { return b({ category: "UPDATE", type: "RELATED_RECORD", Entity: a.Entity, RecordID: a.RecordID, RelatedList: a.RelatedList, RelatedRecordID: a.RelatedRecordID, APIData: a.APIData }) },
                    delinkRelatedRecord: function(a) { return b({ category: "DELETE", type: "RELATED_RECORD", Entity: a.Entity, RecordID: a.RecordID, RelatedList: a.RelatedList, RelatedRecordID: a.RelatedRecordID }) },
                    attachFile: function(a) {
                        var d = a.Entity,
                            e = a.RecordID;
                        a = a.File;
                        a = { FileName: a.Name, FileData: a.Content };
                        return m(d, a, e, "ATTACHMENT")
                    },
                    getAllProfiles: function(a) { return b({ category: "PROFILES", type: "GET_ALL_PROFILES" }) },
                    getProfile: function(a) { return b({ category: "PROFILES", type: "GET_PROFILE", ID: a.ID }) },
                    updateProfile: function(a) { return b({ category: "UPDATE", type: "PROFILE", ID: a.ID, APIData: a.APIData }) },
                    getOrgVariable: function(a) { return r("VARIABLE", a) }
                },
                UI: {
                    Resize: function(a) { a = { action: "RESIZE", data: { width: a.width, height: a.height } }; return g(a) },
                    Dialer: {
                        maximize: function() { return g({ action: { telephony: "MAXIMIZE" } }) },
                        minimize: function() { return g({ action: { telephony: "MINIMIZE" } }) },
                        notify: function() { return g({ action: { telephony: "NOTIFY" } }) }
                    },
                    Record: {
                        open: function(a) { a = { action: { record: "OPEN" }, data: { Entity: a.Entity, RecordID: a.RecordID, target: a.Target } }; return g(a) },
                        edit: function(a) { a = { action: { record: "EDIT" }, data: { Entity: a.Entity, RecordID: a.RecordID, target: a.Target } }; return g(a) },
                        create: function(a) { a = { action: { record: "CREATE" }, data: { Entity: a.Entity, RecordID: a.RecordID, target: a.Target } }; return g(a) },
                        populate: function(a) {
                            return g({
                                action: { record: "POPULATE" },
                                data: a
                            })
                        }
                    },
                    Popup: { close: function() { return g({ action: { popup: "CLOSE" } }) }, closeReload: function() { return g({ action: { popup: "CLOSE_RELOAD" } }) } },
                    Widget: { open: function(a) { a = { action: { webTab: "OPEN" }, data: a }; return g(a) } }
                },
                HTTP: { get: function(a) { return p("wget.get", a) }, post: function(a) { return p("wget.post", a) }, put: function(a) { return p("wget.put", a) }, patch: function(a) { return p("wget.patch", a) }, delete: function(a) { return p("wget.delete", a) } },
                CONNECTOR: {
                    invokeAPI: function(a, d) { return p(a, d, "CONNECTOR_API") },
                    authorize: function(a) {
                        return p(a, {}, "CONNECTOR_AUTHORIZE")
                    }
                },
                CONNECTION: { invoke: function(a, d) { var e = {},
                            f = {};
                        f.url = d.url;
                        f.method = d.method;
                        f.param_type = d.param_type;
                        f.parameters = JSON.stringify(d.parameters);
                        f.headers = JSON.stringify(d.headers);
                        e.data = f; return b({ category: "CRM_CONNECTION", connectionName: a, data: e }) } }
            }
        }()
    }
}();
var ZSDKUtil = function(c) {
        function l(b) {}

        function h(b) { var c = {};
            b = b || window.location.href;
            b.substr(b.indexOf("?") + 1).split("\x26").forEach(function(b, n) { var h = b.split("\x3d");
                c[h[0]] = h[1] });
            c.hasOwnProperty("serviceOrigin") && (c.serviceOrigin = decodeURIComponent(c.serviceOrigin)); return c }
        var n = h(),
            b;
        l.prototype.Info = function() {
            (c.isDevMode() || c.isLogEnabled()) && window.console.info.apply(null, arguments) };
        l.prototype.Error = function() {
            (c.isDevMode() || c.isLogEnabled()) && window.console.error.apply(null,
                arguments)
        };
        c.GetQueryParams = h;
        c.isDevMode = function() { return n && n.isDevMode };
        c.isLogEnabled = function() { return n && n.isLogEnabled };
        c.getLogger = function() { b && b instanceof l || (b = new l); return b };
        c.Sleep = function(b) { for (var c = (new Date).getTime(); c + b > (new Date).getTime();); };
        return c
    }(window.ZSDKUtil || {}),
    ZSDKMessageManager = function(c) {
        function l(e) {
            try { var f = "string" === typeof e.data ? JSON.parse(e.data) : e.data } catch (c) { f = e.data }
            var k = f.type,
                l = f.eventName;
            try {
                var m;
                if (!(m = "SET_CONTEXT" === l)) {
                    var p = e.source,
                        q = e.origin;
                    m = g.isAppRegistered() && a === p && d === q ? !0 : Error("Un-Authorized Message.")
                }
                if (m) switch (k) {
                    case "FRAMEWORK.EVENT":
                        var w = { SET_CONTEXT: h, UPDATE_CONTEXT: n, EVENT_RESPONSE: b, EVENT_RESPONSE_FAILURE: t }[f.eventName];
                        w && "function" === typeof w ? w(e, f) : ZSDKEventManager.NotifyEventListeners(g.AppContext, f.eventName, f.data); break;
                    default:
                        g.MessageInterceptor(e, f) }
            } catch (c) { r.Error("[SDK.MessageHandler] \x3d\x3e ", c.stack) }
        }

        function h(e, b) {
            a = window.parent;
            d = g.QueryParams.serviceOrigin;
            g.SetContext(b.data);
            g.ExecuteLoadHandler()
        }

        function n(a, b) {}

        function b(a, b) { m(b.promiseid, !0, b.data) }

        function t(a, b) { m(b.promiseid, !1, b.data) }

        function m(a, b, d) { k.hasOwnProperty(a) && (b ? k[a].resolve(d) : k[a].reject(d), k[a] = void 0, delete k[a]) }

        function y(a) { return new Promise(function(b, d) { k[a] = { resolve: b, reject: d, time: (new Date).getTime() } }) }

        function v(b) { "object" === typeof b && (b.appOrigin = encodeURIComponent(p())); if (!a) throw Error("Parentwindow reference not found.");
            a.postMessage(b, g.QueryParams.serviceOrigin) }

        function p() {
            return window.location.protocol +
                "//" + window.location.host + window.location.pathname
        }
        var g, r = ZSDKUtil.getLogger(),
            u = 100,
            k = {},
            a, d;
        c.Init = function(a, b) { if (!a || "object" !== typeof a) throw Error("Invalid Context object passed"); if (b && "object" !== typeof b) throw Error("Invalid Configuration Passed to MessageManager");
            g = a; return l.bind(c) };
        c.RegisterApp = function() { var a = { type: "SDK.EVENT", eventName: "REGISTER", appOrigin: encodeURIComponent(p()) };
            window.parent.postMessage(a, g.QueryParams.serviceOrigin) };
        c.DERegisterApp = function() {
            var a = {
                type: "SDK.EVENT",
                eventName: "DEREGISTER",
                uniqueID: g.getUniqueID()
            };
            v(a)
        };
        c.SendRequest = function(a) { if (!a || "object" !== typeof a) throw Error("Invalid Options passed"); var b;
            b = "Promise" + u++;
            a = { type: "SDK.EVENT", eventName: "HTTP_REQUEST", uniqueID: g.getUniqueID(), time: (new Date).getTime(), promiseid: b, data: a };
            v(a);
            b = y(b); return b };
        c.TriggerEvent = function(a, b, d) {
            if (!a) throw Error("Invalid Eventname : ", a);
            var c = d ? "Promise" + u++ : void 0;
            a = {
                type: "SDK.EVENT",
                eventName: a,
                uniqueID: g.getUniqueID(),
                time: (new Date).getTime(),
                promiseid: c,
                data: b
            };
            v(a);
            if (d) return y(c)
        };
        return c
    }(window.ZSDKMessageManager || {}),
    ZSDKEventManager = function(c) {
        var l = ZSDKUtil.getLogger(),
            h = {};
        c.AttachEventListener = function(c, b) { "function" === typeof b && (Array.isArray(h[c]) || (h[c] = []), h[c].push(b)) };
        c.NotifyEventListeners = function(c, b, t) { var m = b.match(/^\__[A-Za-z_]+\__$/gi);
            Array.isArray(m); if ((m = h[b]) && Array.isArray(m))
                for (b = 0; b < m.length; b++) m[b].call(c, t);
            else l.Info("Cannot find EventListeners for Event : ", b) };
        c.NotifyInternalEventHandler = function(c, b) {
            var h =
                b.eventName;
            "__APP_INIT__" === h ? (c.SetContext(b.data), c.ExecuteLoadHandler()) : "__APP_CONTEXT_UPDATE__" === h && (c.UpdateContext(b.data), c.ExecuteContextUpdateHandler())
        };
        return c
    }(window.ZSDKEventManager || {});

function ZSDK() {
    function c() { "function" !== typeof k ? z.Error("No OnLoad Handler provided to execute.") : C ? z.Error("OnLoad event already triggered.") : (k.call(q, q), C = !0) }

    function l() { a.call(q, q) }

    function h() { return B }

    function n(a, b, d) { return ZSDKMessageManager.TriggerEvent(a, b, d) }

    function b(a) {
        z.Info("Setting AppContext data");
        var b = a && a.model || {};
        isDevMode && a.locale && a.localeResource && 0 === Object.keys(a.localeResource).length && a.localeResource.constructor === Object && a.locale && v(a.locale);
        if ("undefined" !==
            typeof ZSDKModelManager) { for (var c in b) ZSDKModelManager.AddModel(c, b[c]);
            q.Model = ZSDKModelManager.GetModelStore() }
        f = a.uniqueID;
        d = a.connectors;
        z.Info("App Connectors ", d);
        B = !0
    }

    function t() { return f }

    function m(a) {}

    function y() { return d }

    function v(a) { p("/app-translations/" + a + ".json", function(a) { A = JSON.parse(a);
            u() }) }

    function p(a, b) { var c = new XMLHttpRequest;
        c.open("GET", a, !1);
        c.onreadystatechange = function() { 4 == c.readyState && "200" == c.status && b(c.responseText) };
        c.send(null) }

    function g(a, b, c) {
        for (var d =
                ""; d != a;) d = a, a = a.replace(b, c);
        return a
    }

    function r(a, b) { b = b.replace(/\[(\w+)\]/g, ".$1");
        b = b.replace(/^\./, ""); for (var c = b.split("."), d = 0, e = c.length; d < e; ++d) { var f = c[d]; if (f in a) a = a[f];
            else return } return a }

    function u() {
        var a = document.querySelectorAll("[data-i18n]"),
            b;
        for (b in a)
            if (a.hasOwnProperty(b)) {
                var c = r(A, a[b].getAttribute("data-i18n"));
                if (!c) return !1;
                if (a[b].hasAttribute("data-options")) {
                    var d = JSON.parse(JSON.stringify(eval("(" + a[b].getAttribute("data-options") + ")"))),
                        e = Object.keys(d),
                        f;
                    for (f in e) c =
                        g(c, "${" + e[f] + "}", d[e[f]])
                }
                a[b].innerHTML = c
            }
    }
    var k, a, d, e, f, A = {},
        z = ZSDKUtil.getLogger(),
        B = !1,
        C = !1;
    this.isContextReady = !1;
    this.HelperContext = {};
    this.isDevMode = !1;
    this.getContext = function() { return q };
    var q = { Model: {}, Event: {} };
    q.Event.Listen = function(a, b) { ZSDKEventManager.AttachEventListener(a, b) };
    q.Event.Trigger = n;
    q.GetRequest = function(a) { return ZSDKMessageManager.SendRequest(a) };
    q.QueryParams = e;
    q.Translate = function(a, b) {
        var c = "";
        a && (c = r(A, a));
        if (!c) return !1;
        if (b) {
            var d = JSON.parse(JSON.stringify(eval(b))),
                e = Object.keys(d);
            for (a in e) c = g(c, "${" + e[a] + "}", d[e[a]])
        }
        return c
    };
    this.OnLoad = function(a) { if ("function" !== typeof a) throw Error("Invalid Function value is passed");
        k = a;
        B && c() };
    this.OnUnLoad = function(a) {};
    this.OnContextUpdate = function(b) { a = b };
    (function() {
        e = ZSDKUtil.GetQueryParams();
        isDevMode = !!e.isDevMode;
        var a = {};
        a.isDevMode = isDevMode;
        a.ExecuteLoadHandler = c;
        a.SetContext = b;
        a.UpdateContext = m;
        a.QueryParams = e;
        a.GetConnectors = y;
        a.TriggerEvent = n;
        a.ExecuteContextUpdateHandler = l;
        a.getUniqueID = t;
        a.isAppRegistered =
            h;
        var d = ZSDKMessageManager.Init(a);
        window.addEventListener("message", d);
        window.addEventListener("unload", function() { ZSDKMessageManager.DERegisterApp() });
        "undefined" !== typeof ZSDKModelManager && ZSDKModelManager.Init(a);
        ZSDKMessageManager.RegisterApp()
    })()
};