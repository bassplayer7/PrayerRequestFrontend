define(["jquery","PubSub","evt","../Model/Request"],function($,e,t,n){var o=[],s="http://prayer.dev/bassplayer7/request/",u=function(n){$.ajax(s+"all",{method:"GET",dataType:"json"}).done(function(e,t){i(e,t,n)}).fail(function(n,o){e.publish(t.ERROR,{data:n,status:o})})},i=function(n,o,s){if(n.hasOwnProperty("prayer_requests")){var u=n.prayer_requests;for(var i in u)a(u[i])}else e.publish(t.ERROR_UNKNOWN,o);s&&s(n)},a=function(s){return typeof s!==n&&(s=new n(s)),o.push(s),e.publish(t.REQUEST_ADD,s),s},r=function(){this.buildInitialList=function(){u()},e.subscribe(t.REQUEST_NEW_INIT,this.requestNew.bind(this)),e.subscribe(t.REQUEST_DELETE_INIT,this.requestDelete.bind(this)),e.subscribe(t.REQUEST_ANSWERED_INIT,this.requestAnswered.bind(this)),e.subscribe(t.REQUEST_UPDATE_SAVE,this.requestUpdate.bind(this))};return r.prototype.requestNewComplete=function(n,s){e.publish(t.REQUEST_ADD,s),s.Id=n.id,o.push(s)},r.prototype.requestDelete=function(n,o){var u=this;$.ajax(s+"delete/"+o.model.Id,{dataType:"json",method:"DELETE"}).done(function(e,t){console.log(t),u.requestDeleteComplete(t,o.model,o.element)}).fail(function(n){e.publish(t.ERROR,n)})},r.prototype.requestDeleteComplete=function(n,s,u){for(var i in o)o[i]===s&&o.splice(i,1);e.publish(t.REQUEST_DELETE_COMPLETE,{status:n,model:s,element:u})},r.prototype.requestUpdate=function(n,o){$.ajax(s+"update/"+o.Id,{dataType:"json",method:"PUT",data:{prayer_request:o}}).done(function(n,o){e.publish(t.REQUEST_UPDATE_COMPLETE,o)}).fail(function(n,s){console.log(s),e.publish(t.ERROR,{data:n,model:o})})},r.prototype.requestAnswered=function(n,o){$.ajax(s+"update/"+o.model.Id,{dataType:"json",method:"PUT",data:{prayer_request:{Answered:!0}}}).done(function(n,s){e.publish(t.REQUEST_ANSWERED_COMPLETE,{status:s,element:o.element,model:o.model})}).fail(function(n,s){console.log(s),e.publish(t.ERROR,{data:n,model:o})})},r.prototype.requestNew=function(o,u){"object"==typeof o&&(u=o);var i=new n(u);$.ajax({url:s+"new",dataType:"json",method:"PUT",data:{prayer_request:i}}).done(function(e,t){console.log(t),i.Id=e.id,a(i)}).fail(function(n){e.publish(t.ERROR,n)})},r});