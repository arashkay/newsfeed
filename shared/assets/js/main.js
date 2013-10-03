var main = {
  init: function(){
    $('.fn-refresh').click(main.posts.refresh).click();
  },
  loading: {
    popup: function(){
      $.mobile.loading( 'show' );
      setTimeout( function(){ $.mobile.loading('hide'); }, 5000);
    }
  },
  posts: {
    refresh: function(){
      main.posts.load();
    },
    load: function(){
      main.posts.list();
      //$.post('http://www.herherkerker.com/messages/more', { offset: 0 }, main.posts.list);
    },
    list: function(data){
      var data = [
        { image: 'http://images.hamshahrionline.ir/images/position36/2013/10/musighe-920709-as.jpg', title: 'ادعاهای نتانیاهو در مجمع عمومی سازمان ملل درباره ایران' }, 
        { image: 'http://images.hamshahrionline.ir/images/position36/2013/10/obama.jpg', title: 'شهردار تهران در اردوی استقلال حاضر شد/ مدیرعامل سابق پرسپولیس هم به هتل المپیک رفت' },
        { image: 'http://images.hamshahrionline.ir/images/position36/2013/10/netanyaho.jpg', title: 'خروج از رکود تورمی؛ چگونه؟' },
        { image: 'http://images.hamshahrionline.ir/images/position36/2013/10/musighe-920709-as.jpg', title: 'ادعاهای نتانیاهو در مجمع عمومی سازمان ملل درباره ایران' }, 
        { image: 'http://images.hamshahrionline.ir/images/position36/2013/10/obama.jpg', title: 'شهردار تهران در اردوی استقلال حاضر شد/ مدیرعامل سابق پرسپولیس هم به هتل المپیک رفت' },
        { image: 'http://images.hamshahrionline.ir/images/position36/2013/10/netanyaho.jpg', title: 'خروج از رکود تورمی؛ چگونه؟' } 
      ];
      var list = $('.template .fn-post').template( data, { appendTo: '.fn-posts' } );
      main.posts.actions(list);
    },
    actions: function(list){
    /*  $(list).swipe({
        swipe:function(event, direction, distance, duration, fingerCount) {
          $(this).animate({ left: -$(window).outerWidth() }, function(){ $(this).slideUp() } );
        }
      });*/
      main.drag.init(list);
      $('.fn-more', list).click( main.posts.more );
      $('.fn-like', list).click( main.posts.like );
      $('.fn-dislike', list).click( main.posts.dislike );
    },
    more: function(){
      $(this).parents('.fn-post').find('.fn-description').slideToggle();
      $(this).parents('.fn-post').toggleClass('expanded');
    },
    like: function(){
      $(this).parents('.fn-post').addClass('liked');
    },
    dislike: function(){
      $(this).parents('.fn-post').removeClass('liked');
    }
  },
  drag: {
    init: function(target){
      $(target).on({
        touchstart: function(e){
        //  e.preventDefault();
          var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
          $(this).data({ touchx: touch.pageX }).on('touchmove', main.drag.move);
        },
        touchend: function(e){
        //  e.preventDefault();
          var touchx = $(this).data('touchx');
          var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
          var target = $(this);
          if(Math.abs(touchx-touch.pageX)>target.width()/3)
          //if(Math.abs(target.position().left)>target.width()/3)
            target.animate({ left: -$(window).outerWidth() }, function(){ target.slideUp() } );
          else
            target.css( { left: '' } );
          target.data('touchx', null).off('touchmove', main.drag.move);
        }
      })
    },
    move: function(e){
      //e.preventDefault();
      var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
      var touchx = $(this).data('touchx');
      //$(this).css( { left: touch.pageX - touchx } );
    }
  }
};
