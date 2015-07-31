define(["jquery","PubSub","evt","./Request","./Add","HandleBars","text!./template/empty.html"],function($,e,t,i,s,n,r){var d=function(d,a,o){var u=this;this.answeredContainer=a,this.unansweredContainer=d,this.collection=o,this.lists=["answered","unanswered"],this.addView=new s,this.getListElement=function(e){var t=e?"answered":"unanswered",i=this[t+"Container"].find(".list-group");return 0===i.length&&(i=$("<ul></ul>").addClass("list-group"),this[t+"Container"].append(i)),i},this.addRequestToList=function(s,n){var r=new i(n),d=r.getElement();this.getListElement(n.Answered).append(d),e.publish(t.REQUEST_NEW_COMPLETE,d)},this.addEmptyListMessage=function(){var e=$(".list-group");e.each(function(){if(0===$(this).children("li").length){var e=n.compile(r);$(this).before(e).remove()}})},this.removeMessageIfPopulated=function(e){var t=e.children(".empty-list");e instanceof $&&t.length>0&&e.children(".list-group").length>0&&e.children(".empty-list").remove()},this.clearEmptyListMessages=function(){this.removeMessageIfPopulated(this.unansweredContainer),this.removeMessageIfPopulated(this.answeredContainer)},this.markAsAnswered=function(i,s){var n=s.element;n.find(".action-answer").remove(),this.answeredContainer.find(".list-group").append(n),e.publish(t.LIST_ACTION_COMPLETE,n)},this.endEdit=function(){$(".list-group-item").removeClass("edit-mode")},this.finishEdit=function(i,s){s.siblings(".item-title").text(s.val()),i.OldTitle=i.Title,i.Title=s.val(),u.endEdit(),e.publish(t.REQUEST_UPDATE_SAVE,i),s.off("keydown")},this.keyActions=function(e,t){e.keydown(function(i){13===i.which&&u.finishEdit(t,e),27===i.which&&u.endEdit()})},this.initRequestUpdate=function(e,t){var i=t.element,s=t.model,n=i.parents(".list-group-item"),r=n.find(".item-edit");n.addClass("edit-mode"),r.val(s.Title).focus(),this.keyActions(r,s,i)},this.completeRequestUpdate=function(e,t){console.log("Request updated successfully!")},this.removeRequestFromList=function(i,s){var n=s.element;n&&(n.parents(".list-group-item").remove(),e.publish(t.REQUEST_DELETE_CLEANUP,n.parents(".list-group")),n.remove())},this.buildInitialList=function(){this.collection.buildInitialList()},this.setup=function(){e.subscribe(t.REQUEST_ADD,this.addRequestToList.bind(this)),e.subscribe(t.REQUEST_UPDATE_INIT,this.initRequestUpdate.bind(this)),e.subscribe(t.REQUEST_UPDATE_COMPLETE,this.completeRequestUpdate.bind(this)),e.subscribe(t.REQUEST_DELETE_CLEANUP,this.addEmptyListMessage),e.subscribe(t.REQUEST_DELETE_COMPLETE,this.removeRequestFromList.bind(this)),e.subscribe(t.REQUEST_ANSWERED_COMPLETE,this.markAsAnswered.bind(this)),e.subscribe(t.LIST_ACTION_COMPLETE,this.addEmptyListMessage),e.subscribe(t.REQUEST_NEW_COMPLETE,this.clearEmptyListMessages.bind(this))},this.setup()};return d});