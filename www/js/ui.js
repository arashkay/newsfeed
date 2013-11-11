var ui = {};

$.extend(ui,{
  init: function(){
    $('[data-checkbox]').click( ui.checkbox );
  },
  checkbox: function(){
    var $t = $(this);
    if($t.is('.checked')){
      $t.removeClass('checked').find('i').attr('class','icon-check-empty');
      $('input', $t).prop('checked', false);
    }else{
      $t.addClass('checked').find('i').attr('class','icon-check-sign');
      $('input', $t).prop('checked', true);
    }
    eval($t.data('checkbox')).call($t, $('input', $t).val(), $('input', $t).is(':checked'))
  }
});
