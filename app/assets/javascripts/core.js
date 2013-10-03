var core = {};

$(function(){

core = {
  security: { authenticity_token: $('[name=csrf-token]').attr('content') },
  /*
    * if data-busy no re-submit
    * i tag inside the element will be faded
    * 
    <span class='btn' data-remote='YOUR_SUBMIT_URL' data-busy='true' data-method='DELETE' data-form='.fn-form' data-parent='li' data-target='#target' data-success='system.namespace.success_method'>ajax submit button</span>
  */
  init: function(){
    $.ajaxSetup( { headers: { 'X-CSRF-Token' : $('meta[name="csrf-token"]').attr('content') } } );
    
    core.form.init();
  },
  form: {
    init: function(){
      core.form.files();
      core.validation.init();
      $('[data-remote]:not([data-on])').bind('click', core.form.remote );
      $('[data-remote][data-on=type]').bind('input', function(){
        var $t = $(this);
        var action = $t.data('remote.timeout');
        if(action!=undefined)
          clearTimeout(action);
        action = setTimeout(function(){core.form.remote.call($t)}, 1000);
        $t.data('remote.timeout', action);
      });
      $('[data-updatable=remote]').on('click', '[data-remote]', core.form.remote );
    },
    remote: function() {
      var $t = $(this);
      if($t.data('busy')) return;
      var data = {};
      if($t.is('[data-method]')) data._method = $t.data('method');
      var form = null;
      if($t.is('[data-form]')) form = $t.data('form'); 
      if($t.is('[data-parent]')) form = $t.parents($t.data('parent')+':first');
      if( form != null ){
        core.validation.validate(form);
        $.extend(data, core.form.read(form));
      }
      var target = $($t.is('[data-target]')? $t.data('target') : $t);
      $t.data('busy', true);
      core.loader.show($t);
      $.post( $t.data('remote'), data ).success( function(d){
        $t.data('busy', false);
        core.loader.hide($t);
        if($t.is('[data-success]')) eval($t.data('success')).call( target, d);
      });
    },
    read: function(form){
      form = $(form);
      var data = {};
      $('input:not([type=radio], [type=checkbox]), select, textarea', form).each(function(){
        data[$(this).attr('name')] = $(this).val();
      });
      $('input[type=radio]:checked, input[type=checkbox]:checked', form).each(function(){
        data[$(this).attr('name')] = $(this).val();
      });
      return data;
    },
    files: function(){
      if(!$.isFunction($.fn.fileupload)) return;
      $('[data-uploader]').fileupload({
        dataType: 'json',
        formData: core.security,
        send: function(){
          core.loader.show();
        },
        done: function (e, data) {
          core.loader.hide();
          var $this = $(data.fileInput);
          eval($this.data('callback')).call($this, data.result);
        }
      });
    }
  },
  validation: {
    init: function(){
      $('form[action]').submit(function(event){
        core.validation.validate($(this));
        if( $('.error', this).size()>0 )
          event.preventDefault();
      });
    },
    colorize: function(fields){
      $('.error', this).removeClass('error');
      $.each( fields, function(){ 
        if($(this).is('[data-error]'))
          $($(this).data('error')).addClass('error');
        else
          $(this).addClass('error'); 
      });
    },
    validate: function(form){
      var errors = [];
      $('input:not([type=radio], [type=checkbox]), select, textarea', form).each(function(){
        var $t = $(this);
        $.each( core.validation.find( this.attributes ), function(i,v){
          if(!eval('core.validation.'+v[0]).call($t, v[1]))
            errors.push($t);
        });
      });
      core.validation.colorize.call(form, errors);
    },
    find: function(attributes){
      var list = [];
      $.each( attributes, function(i, v){
        if( v.name.match(/data-validate/) )
          list.push( [v.name.split('-')[2], v.value] );
      });
      return list;
    },
    presence: function(validation){
      return this.val()!='';
    }
  },
  loader: {
    count: 0,
    show: function($this){
      if(core.loader.count!=0) return;
      $('i', $this).animate( { opacity: 0.1 } );
      $('.fn-loading').fadeIn()
      core.loader.count++;
    },
    hide: function($this){
      core.loader.count--;
      if(core.loader.count>0) return;
      core.loader.count=0;
      $('i', $this).animate( { opacity: 1 } );
      $('.fn-loading').fadeOut()
    }
  }
}
core.init();

});
