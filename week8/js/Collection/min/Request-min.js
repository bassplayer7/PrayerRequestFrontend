define(["jquery","PubSub","evt","../Model/Request"],function($,e,t,n){var s=[],E="http://api.js101.net/jessemaxwell1/request/",i=function(n){$.ajax(E+"all",{method:"GET",dataType:"json"}).done(function(e,t){u(e,t,n)}).fail(function(n,s){e.publish(t.ERROR,{data:n,status:s}),e.publish(t.INITIALIZE_SYSTEM)})},u=function(n,s,E){if(n.hasOwnProperty("prayer_requests")){var i=n.prayer_requests;for(var u in i)o(i[u])}else e.publish(t.ERROR_UNKNOWN,s);E&&E(n)},o=function(E,i){return typeof E!==n&&(E=new n(E)),s.push(E),"new"===i?e.publish(t.REQUEST_NEW_ADD,E):e.publish(t.REQUEST_ADD,E),E},r=function(){this.buildInitialList=function(){i()},e.subscribe(t.REQUEST_NEW_INIT,this.requestNew.bind(this)),e.subscribe(t.REQUEST_DELETE_INIT,this.requestDelete.bind(this)),e.subscribe(t.REQUEST_ANSWERED_INIT,this.requestUpdate.bind(this)),e.subscribe(t.REQUEST_UPDATE_SAVE,this.requestUpdate.bind(this))};return r.prototype.requestNew=function(s,i){"object"==typeof s&&(i=s);var u=new n(i);$.ajax({url:E+"new",dataType:"json",method:"PUT",data:{prayer_request:u}}).done(function(n){u.Id=n.id,e.publish(t.REQUEST_NEW_COMPLETE,n),o(u,"new")}).fail(function(n){e.publish(t.REQUEST_NEW_ERROR,n)})},r.prototype.requestDelete=function(n,s){var i=this;$.ajax(E+"delete/"+s.model.Id,{dataType:"json",method:"DELETE"}).done(function(e,t){i.requestDeleteComplete(t,s.model,s.element)}).fail(function(n){e.publish(t.ERROR,n)})},r.prototype.requestDeleteComplete=function(n,E,i){for(var u in s)s[u]===E&&s.splice(u,1);e.publish(t.REQUEST_DELETE_COMPLETE,{status:n,model:E,element:i})},r.prototype.requestUpdate=function(n,s){var i=t.REQUEST_UPDATE_COMPLETE;n===t.REQUEST_ANSWERED_INIT&&(s.model.Answered=s.model.Answered?!1:!0,i=t.REQUEST_ANSWERED_COMPLETE),$.ajax(E+"update/"+s.model.Id,{dataType:"json",method:"PUT",data:{prayer_request:s.model}}).done(function(t,n){e.publish(i,{status:n,element:s.element,model:s.model})}).fail(function(n){e.publish(t.ERROR_UPDATE,{response:n,model:s,element:s.element})})},r});