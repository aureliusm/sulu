define(["jquery","services/suluaudiencetargeting/target-group-manager","text!/admin/target-groups/template/target-group-details.html","text!/admin/target-groups/template/rule-overlay.html"],function(a,b,c,d){var e={ruleFormSelector:"#rule-form",newRecordPrefix:"newrecord",conditionType:"type",conditionKey:"condition"},f=1;return{type:"form-tab",defaults:{templates:{form:c,ruleOverlay:d},translations:{all:"public.all",active:"sulu_audience_targeting.is-active",conditions:"sulu_audience_targeting.conditions",conditionsDescription:"sulu_audience_targeting.conditions-description",description:"public.description",frequency:"sulu_audience_targeting.frequency",pleaseChoose:"public.please-choose",priority:"sulu_audience_targeting.priority",ruleOverlayTitle:"sulu_audience_targeting.rule-overlay-title",ruleSets:"sulu_audience_targeting.rule-sets",ruleSetsDescription:"sulu_audience_targeting.rule-sets-descriptions",title:"public.title",webspaces:"sulu_audience_targeting.webspaces"}},rulesData:[],layout:function(){return{content:{width:"max",leftSpace:!1,rightSpace:!1}}},tabInitialize:function(){this.sandbox.on("sulu.content.changed",this.setDirty.bind(this)),this.sandbox.on("husky.datagrid.record.add",this.setDirty.bind(this)),this.sandbox.on("husky.datagrid.records.change",this.setDirty.bind(this)),this.sandbox.on("husky.toggler.is-active.changed",this.setDirty.bind(this))},parseData:function(a){return this.parsedData=a,a.webspaces=this.parseWebspaceForSelect(a.webspaces),this.rulesData=a.rules,a},save:function(a){a.webspaces=this.parseWebspaceSelection(this.retrieveSelectValue("#webspaces")),a.rules=this.rulesData.map(function(a){var b=this.sandbox.util.deepCopy(a);return"string"==typeof b.id&&b.id.startsWith(e.newRecordPrefix)&&delete b.id,b}.bind(this)),b.save(a).then(function(a){this.rulesData=a.rules,this.updateRulesDatagrid(),this.saved(a)}.bind(this))},updateRulesDatagrid:function(){this.sandbox.emit("husky.datagrid.records.set",this.rulesData.map(function(a){return this.parseRuleForDatagrid(a)}.bind(this)))},parseWebspaceSelection:function(a){var b=[];if(!a)return b;for(var c=0;c<a.length;c++)b.push({webspaceKey:a[c]});return b},parseWebspaceForSelect:function(a){var b=[];if(!a)return b;for(var c=0;c<a.length;c++)b.push(a[c].webspaceKey);return b},getTemplate:function(){return this.templates.form({data:this.parsedData,translations:this.translations,translate:this.sandbox.translate})},getFormId:function(){return"#target-group-form"},retrieveSelectValue:function(b){var c=[],d=a(b);return d.length&&"undefined"!=typeof d.data("selection")&&(c=d.data("selection")),c},rendered:function(){this.startRulesList()},startRulesList:function(){var a=this.rulesData.map(function(a){return this.parseRuleForDatagrid(a)}.bind(this));this.sandbox.sulu.initListToolbarAndList.call(this,"rules",null,{el:this.$find("#rules-list-toolbar"),template:this.sandbox.sulu.buttons.get({add:{options:{position:0,callback:this.startRuleOverlay.bind(this)}},deleteSelected:{options:{position:1,callback:this.deleteRules.bind(this)}}}),hasSearch:!1},{el:this.$find("#rules-list"),data:a,actionCallback:this.startRuleOverlay.bind(this),matchings:[{name:"title",content:this.translations.title},{name:"frequency",content:this.translations.frequency},{name:"conditions",content:this.translations.conditions}]},"rules")},editRule:function(){var a,b,c;return this.sandbox.form.validate(e.ruleFormSelector)?(a=this.sandbox.form.getData(e.ruleFormSelector),a.id||(a.id=e.newRecordPrefix+f++,this.rulesData.push(a),this.sandbox.emit("husky.datagrid.record.add",this.parseRuleForDatagrid(a))),"string"!=typeof a.id||a.id.startsWith(e.newRecordPrefix)||(a.id=parseInt(a.id),b=this.findRule(a.id),c=this.rulesData.indexOf(b),this.rulesData[c]=a),void this.sandbox.emit("husky.datagrid.records.change",this.parseRuleForDatagrid(a))):!1},startRuleOverlay:function(a){var b=this.sandbox.dom.createElement('<div class="overlay-element"/>');this.sandbox.dom.append(this.$el,b),this.sandbox.once("husky.overlay.rule.opened",this.createRuleForm.bind(this,a)),this.sandbox.once("husky.overlay.rule.opened",this.bindRuleFormListener.bind(this,a)),this.sandbox.start([{name:"overlay@husky",options:{el:b,title:this.translations.ruleOverlayTitle,instanceName:"rule",data:this.templates.ruleOverlay({translations:this.translations}),skin:"medium",openOnStart:!0,removeOnClose:!0,okCallback:this.editRule.bind(this)}}])},createRuleForm:function(a){var b={};a&&(b=this.findRule(a)),this.sandbox.form.create(e.ruleFormSelector).initialized.then(function(){this.sandbox.form.setData(e.ruleFormSelector,b).then(function(){this.sandbox.start(e.ruleFormSelector),this.sandbox.start([{name:"target-groups/edit/details/conditions@suluaudiencetargeting",options:{el:e.ruleFormSelector+" #conditions"}}])}.bind(this))}.bind(this))},bindRuleFormListener:function(){this.sandbox.dom.on(e.ruleFormSelector,"form-add",function(a,b,c,d){var e=this.sandbox.dom.children(this.$find("#"+b)),f=void 0!==d&&e.length>d?e[d]:this.sandbox.dom.last(e);this.sandbox.start(f)}.bind(this))},deleteRules:function(){this.sandbox.emit("husky.datagrid.items.get-selected",function(a){this.sandbox.emit("husky.datagrid.records.remove",a);var b=[];this.rulesData.forEach(function(c,d){a.indexOf(c.id)>-1&&b.push(d)}.bind(this)),b.forEach(function(a){this.rulesData.splice(a,1)}.bind(this))}.bind(this))},parseRuleForDatagrid:function(a){var b=this.sandbox.util.deepCopy(a);return b.conditions=b.conditions.map(function(a){return a[e.conditionType]}).join(" & "),b},findRule:function(a){return this.rulesData.filter(function(b){return b.id===a})[0]}}});