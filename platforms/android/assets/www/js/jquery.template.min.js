/*
  jQuery Template (jTemplate) 1.0.0
  
  Date: Aug 21 2012
  Source: www.tectual.com.au, www.arashkarimzadeh.com
  Author: Arash Karimzadeh (arash@tectual.com.au)
 
  Copyright (c) 2012 Tectual Pty. Ltd.
  http://www.opensource.org/licenses/mit-license.php
*/
(function($){$.extend({isString:function(n){return(typeof n=='string');}});$.fn.extend({parse:function(keepOrigin){return $.parse(this.toHtml(keepOrigin));},toHtml:function(keepOrigin){var $this=(keepOrigin!=false)?this.clone():this;var html=$('<div/>').append($this).html();$('<div/>').remove();return html;}});$.parse=function(strng){var expression=function(collection){if((/<[\w]*(?=[^>]*fn=)/i).test(collection['jl.template']))
  collection['jl.fn']=collection['jl.template'].match(/fn=('|")[^\<]*('|")/i)[0].split(/'|"/)[1];if((/<[\w]*(?=[^>]*object=)/i).test(collection['jl.template']))
  collection['jl.object']=collection['jl.template'].match(/object=('|")[^\<]*('|")/i)[0].split(/'|"/)[1];if((/<[\w]*(?=[^>]*end=)/i).test(collection['jl.template']))
  collection['jl.end']=collection['jl.template'].match(/end=('|")[^\<]*('|")/i)[0].split(/'|"/)[1];}
var parse=function(str){var loop=str.match(/<[\w]*(?=[^>]*loop=)/i);if(loop==null)return false;var tag=loop[0].replace('<','');var scope=str.substr(loop.index);scope=scope.replace('loop','looped');var tags=scope.match(new RegExp('<'+tag+'|</'+tag+'>','ig'));var open=0;var close=0;$.each(tags,function(){(this.indexOf('/')==-1)?open++:close++;if(open==close)return false;});var end=0;for(var i=0;i<close;i++)
  end=scope.indexOf('</'+tag+'>',end+1);var splits=[str.substring(0,loop.index),scope.substring(0,end+tag.length+3),str.substring(loop.index+end+tag.length+1)];var key=splits[1].match(/looped=('|")[^.]*('|")/i)[0].split(/'|"/)[1];splits[0]+=['<!--',key,'-->'].join('');var collection={'jl.template':splits[0],'jl.ending':splits[2]};var splitted1=parse(splits[1]);if(splitted1!=false){splits[1]=splitted1;collection[key]=splits[1];}else{collection[key]={'jl.template':splits[1]};}
var splitted2=parse(splits[2]);if(splitted2!=false){collection['jl.template']+=splitted2['jl.template'];collection['jl.ending']=splitted2['jl.ending'];$.each(splitted2,function(k,v){if(k!='jl.ending'&&k!='jl.template')
  collection[k]=v;});}else{collection['jl.template']+=collection['jl.ending'];}
delete collection['jl.ending'];return collection;}
var collection=parse(strng.replace(/(\n|\r|\r\n)\s+/mg,''));var extract=function(collection){expression(collection);$.each(collection,function(k,v){if(k!='jl.template'&&k!='jl.fn'&&k!='jl.object'&&k!='jl.end')
  extract(v);});}
extract(collection);return collection;}
$.fn.template=function(data,options){var opt={autoFix:true,appendTo:null,raw:false,keepOrigin:true,show:true};$.extend(true,opt,options);var pos=(opt.keepOrigin)?this:$("<b/>").hide().insertAfter(this);var tmp=this.parse(opt.keepOrigin);var merge=function(data,tmp,current,key){if(!$.isPlainObject(data)&&!$.isArray(data)){switch(true){case(typeof data=='string'):case(typeof data=='number'):tmp=tmp.replace(new RegExp(['%#',key,'%'].join(''),'ig'),data);break;case(typeof data=='boolean'):tmp=tmp.replace(new RegExp(['%#',key,'%'].join(''),'ig'),(data)?'true':'false');break;case(data==null):tmp=tmp.replace(new RegExp(['%#',key,'%'].join(''),'ig'),'');break;}}else if($.isArray(data)){if(current[key]!==undefined){var str='';$.each(data,function(k,v){if($.isPlainObject(v)){var s=merge(v,tmp,current,key);if(current[key]['jl.object']!=undefined)
  $.each(v[current[key]['jl.object']],function(kk,vv){s=merge(vv,s,null,kk);});str+=s;}else if($.isArray(v)){var tmp_str=merge(v,current[key]['jl.template'],current[key],'true');if(current[key]['jl.fn']!=undefined)
    tmp_str=eval(current[key]['jl.fn'])(tmp_str,data,key,current[key]);str+=tmp_str;}else{var tmp_str=merge(v,current[key]['jl.template'],current[key],'field');if(current[key]['jl.fn']!=undefined)
      tmp_str=eval(current[key]['jl.fn'])(tmp_str,data,key,current[key]);str+=tmp_str;}});tmp=tmp.replace(new RegExp(['<!--',key,'-->'].join(''),'ig'),str);if(current[key]['jl.end'])
  tmp=eval(current[key]['jl.end'])(tmp,data,key,current[key]);}}else{var current=current[key];if(current==undefined)return;var tmp=current['jl.template'];$.each(data,function(k,v){switch(typeof v){case'string':case'number':case'boolean':tmp=merge(v,tmp,current,k);break;case'object':tmp=(v==null)?merge(v,tmp,current,k):(v.length!=undefined)?tmp.replace(new RegExp(['<!--',k,'-->'].join(''),'ig'),merge(v,['<!--',k,'-->'].join(''),current,k)):tmp.replace(new RegExp(['<!--',k,'-->'].join(''),'ig'),merge(v,tmp,current,k));break;}});if(current['jl.fn']!=undefined)
    tmp=eval(current['jl.fn'])(tmp,data,key,current);}
return tmp;};var key='true';$.each(tmp,function(k,v){if(k!='jl.template'&&k!='jl.fn')
  key=k;});var str=merge(data,tmp['jl.template'],tmp,key);if(opt.autoFix)
  str=str.replace(/%#[^(#|%)]*%/ig,'');var result=(opt.appendTo!=null)?$(str).appendTo(opt.appendTo):((opt.raw)?str:$(str).insertAfter(pos));if(!opt.keepOrigin)pos.remove();if(!$.isString(result)&&opt.show)result.show();return result;};})(jQuery);
