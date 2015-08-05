define(["jquery","PubSub","evt","errorMsg","./Request","../Model/Request","./Add","HandleBars","text!./template/empty.html"],function($,e,t,s,i,n,a,r,o){var d=function(s,i,n){this.answeredContainer=i,this.unansweredContainer=s,this.collection=n,this.updateButtonText="Update",this.getParent=function(e){return e.parents(".list-group-item")},this.setup=function(){e.subscribe(t.REQUEST_ADD,this.addRequestToList.bind(this)),e.subscribe(t.REQUEST_NEW_ADD,this.addRequestToList.bind(this)),e.subscribe(t.REQUEST_UPDATE_INIT,this.initRequestUpdate.bind(this)),e.subscribe(t.REQUEST_UPDATE_CANCEL,this.cancelEdit.bind(this)),e.subscribe(t.REQUEST_UPDATE_PREPARE_COMPLETE,this.finishEdit.bind(this)),e.subscribe(t.REQUEST_UPDATE_COMPLETE,this.completeRequestUpdate.bind(this)),e.subscribe(t.REQUEST_DELETE_INIT,this.initRequestRemove.bind(this)),e.subscribe(t.REQUEST_DELETE_CLEANUP,this.addEmptyListMessage),e.subscribe(t.REQUEST_DELETE_COMPLETE,this.removeRequestFromList.bind(this)),e.subscribe(t.REQUEST_ANSWERED_INIT,this.initToggleAnswered.bind(this)),e.subscribe(t.REQUEST_ANSWERED_COMPLETE,this.toggleAnsweredComplete.bind(this)),e.subscribe(t.REQUEST_NEW_ADD,this.clearEmptyListMessages.bind(this)),e.subscribe(t.LIST_ACTION_COMPLETE,this.addEmptyListMessage),e.subscribe(t.INITIALIZE_SYSTEM,this.addEmptyListMessage.bind(this)),e.subscribe(t.ERROR_UPDATE,this.updateError.bind(this)),e.subscribe(t.ERROR,this.generalError.bind(this))},this.setup()};return d.prototype.lists=["answered","unanswered"],d.prototype.addView=new a,d.prototype.getListElement=function(e){var t=e?"answered":"unanswered",s=this[t+"Container"].find(".list-group");return 0===s.length&&(s=$("<ul></ul>").addClass("list-group"),this[t+"Container"].append(s)),s},d.prototype.addRequestToList=function(e,s){var n=new i(s),a=n.getElement();e===t.REQUEST_NEW_ADD&&(a.addClass("new"),setTimeout(function(){a.removeClass("new")},1500)),this.getListElement(s.Answered).append(a)},d.prototype.addEmptyListMessage=function(){var e=$(".list-group"),t=r.compile(o);e.length<1&&(this.answeredContainer.append(t),this.unansweredContainer.append(t)),e.each(function(){0===$(this).children("li").length&&$(this).before(t).remove()})},d.prototype.removeMessageIfPopulated=function(e){var t=e.children(".empty-list");e instanceof $&&t.length>0&&e.children(".list-group").length>0&&e.children(".empty-list").remove()},d.prototype.clearEmptyListMessages=function(){this.removeMessageIfPopulated(this.unansweredContainer),this.removeMessageIfPopulated(this.answeredContainer)},d.prototype.initToggleAnswered=function(e,t){var s=this.getParent(t.element),i=$('<span class="status-text green">(updating)</span>');s.addClass("answer"),s.find(".item-title").after(i)},d.prototype.toggleAnsweredComplete=function(s,i){var n=i.element;n.removeClass("answer").find(".status-text").remove(),i.model.Answered?(n.find(".action-answer").addClass("hover"),this.answeredContainer.find(".list-group").append(n),$('[href="#answered"]').addClass("success")):(n.find(".action-answer").removeClass("hover"),this.unansweredContainer.find(".list-group").append(n),$('[href="#unanswered"]').addClass("success")),setTimeout(function(){$(".nav .success").removeClass("success")},1500),e.publish(t.LIST_ACTION_COMPLETE,n)},d.prototype.cancelEdit=function(e,t){var s=t.element,i=t.model;i.Title=i.OldTitle,i.Date=i.OldDate,s.find(".item-title").text(i.OldTitle),s.find(".item-date").text(i.OldDate),this.endEdit()},d.prototype.endEdit=function(){$(".list-group-item").off("keydown").removeClass("edit-mode").find(".error-message").text("").removeClass("active"),$(".button-update").text(this.updateButtonText).prop("disabled",!1)},d.prototype.finishEdit=function(s,i){s===t.REQUEST_UPDATE_PREPARE_COMPLETE&&(s=i.model,i=this.getParent(i.element));var n=i.find(".title-edit").val(),a=i.find(".date-edit").val(),r=i.find(".button-update");i.find(".item-title").text(n),i.find(".item-date").text(a),s.Title=n,s.Date=a,r.text("saving...").prop("disabled",!0),e.publish(t.REQUEST_UPDATE_SAVE,{model:s,element:i})},d.prototype.initRequestUpdate=function(e,t){var s=t.element,i=t.model,n=this.getParent(s),a=n.find(".title-edit"),r=n.find(".date-edit");i.OldTitle=i.Title,i.OldDate=i.Date,n.addClass("edit-mode"),a.val(i.Title).focus(),r.val(i.Date),this.keyActions(n,i,s)},d.prototype.completeRequestUpdate=function(e,t){this.endEdit(),t.element.addClass("new"),setTimeout(function(){t.element.removeClass("new")},1500)},d.prototype.updateError=function(e,t){var i=t.element,n=t.response.status,a=i.find(".error-message").addClass("active");i.find(".title-edit").focus(),i.find(".button-update").prop("disabled",!1).text("Try again"),a.text(s[n])},d.prototype.initRequestRemove=function(e,t){var s=this.getParent(t.element),i=$('<span class="status-text">(deleting)</span>');s.addClass("delete"),s.find(".item-title").after(i)},d.prototype.removeRequestFromList=function(s,i){var n=i.element;if(n){var a=this.getParent(n);a.addClass("fade-out"),setTimeout(function(){a.remove(),e.publish(t.REQUEST_DELETE_CLEANUP,n.parents(".list-group")),n.remove()},500)}},d.prototype.generalError=function(e,t){var i=s[t.data.status]||"I'm sorry, but there has been an error.",n=$(".global.error-message");n.addClass("active").text(i),setTimeout(function(){n.text("").removeClass("active")},3e3)},d.prototype.buildInitialList=function(){this.collection.buildInitialList()},d.prototype.keyActions=function(s,i){var n=this;s.keydown(function(a){13===a.which&&n.finishEdit(i,s),27===a.which&&e.publish(t.REQUEST_UPDATE_CANCEL,{model:i,element:s})})},d});