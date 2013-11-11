var main = {
  defaults: {
    news: {
      general: 42,
      sports: 44,
      politics: 86,
      technology: 87
    },
    url: 'http://www.kalagheh.com/',
    debug: false
  }
};
$.extend( main,{
  init: function(){
    $('.fn-options').click(main.menu.toggle);
    $('.fn-refresh').click(main.posts.refresh);
    main.pages.init();
    $('.fn-close').click(main.pages.close);
    $('[data-href]').click( main.open );
    ui.init();
    main.settings.init();
    if(!main.defaults.debug)
      main.database.init();
  },
  open: function(){
    $('.fn-blocker').fadeIn().delay(4000).fadeOut();
    var url = $(this).data('href');
    setTimeout( function(){window.open(url, '_system');}, 600);
  },
  loading: {
    popup: function(){
      $.mobile.loading( 'show' );
      setTimeout( function(){ $.mobile.loading('hide'); }, 5000);
    }
  },
  network: {
    exists: function(){
      return navigator.network.connection.type != Connection.NONE
    }
  },
  menu: {
    toggle: function(){
      $('.fn-menu').slideToggle();
    }
  },
  pages: {
    init: function(){
      $('[data-page]').click(main.pages.show);
    },
    close: function(){
      $(this).parents('.fn-page').slideUp('fast');
    },
    show: function(){
      var name = $(this).data('page');
      $('.fn-menu, .fn-page').not(name).slideUp();
      $(name).slideDown();
    }
  },
  posts: {
    refresh: function(){
      $('.fn-menu').slideUp();
      if(main.network.exists())
        main.posts.load();
    },
    load: function(firstLoad){
      if (firstLoad==true) navigator.splashscreen.hide();
      $.get(main.defaults.url+main.cache.max()+'.json', { types: main.settings.types() }, function(d){$('.fn-loader').hide(); main.posts.list(d, true) });
      $('.fn-loader').show();
    },
    list: function(data, save){
      if(save)
        main.database.write(data);
      var list = $('.template .fn-post').template(data);
      list.prependTo('.fn-posts');
      main.posts.actions(list);
    },
    liked: function(tmp, data){
      if(data.liked){
        tmp = tmp.replace('post', 'post liked');
      }
      return tmp;
    },
    actions: function(list){
      main.drag.init(list);
      $('.fn-more', list).click( main.posts.more );
      $('.fn-read', list).click( main.posts.read );
      $('.fn-sms', list).click( main.posts.sms );
      $('.fn-like', list).click( main.posts.like );
      $('.fn-dislike', list).click( main.posts.dislike );
      $('[data-href]', list).click( main.posts.open );
    },
    more: function(){
      var post = $(this).parents('.fn-post');
      main.posts.toggle(post);
    },
    read: function(){
      var post = $(this).parents('.fn-post');
      if(post.is('.expanded:not(.long)'))
        return post.addClass('long');
      post.addClass('long');
      main.posts.toggle(post);
    },
    open: function(e){
      e.stopPropagation();
      var url = $(this).data('href');
      $('.fn-blocker').fadeIn().delay(4000).fadeOut();
      setTimeout( function(){window.open(url, '_blank', 'location=yes');}, 600);
      //yoyo.wallet.window.addEventListener('loadstart', yoyo.wallet.change );
    },
    toggle: function(post){
      post.find('.fn-description').slideToggle(200);
      post.toggleClass('expanded');
      (post.is('.expanded')) ? post.removeClass('shrinked') : post.addClass('shrinked');
    },
    sms: function(e){
      e.stopPropagation();
      var post = $(this).parents('.fn-post');
      var title = post.find('.title').text();
      var link = post.find('[data-href]').data('href');
      var url = "sms:?body=" + title + "[kalagheh App]" ;
      setTimeout( function(){window.open(url, '_system');}, 600);
    },
    like: function(){
      var post = $(this).parents('.fn-post').addClass('liked');
      var cnt = $('.counts', post);
      cnt.text( parseInt(cnt.text())+1 );
      var id = post.data('dbid');
      $.post(main.defaults.url+'posts/'+id+'/like.json');
      main.database.like(id, 1);
    },
    dislike: function(){
      var post = $(this).parents('.fn-post').removeClass('liked');
      var cnt = $('.counts', post);
      cnt.text( parseInt(cnt.text())-1 );
      var id = post.data('dbid');
      $.post(main.defaults.url+'posts/'+id+'/dislike.json');
      main.database.like(id, 0);
    },
    likes: function(){
      var ids = [];
      $('.fn-post:visible').each(function(){
        ids.push($(this).data('dbid'));
      });
      $.post(main.defaults.url+'posts/likes.json', { ids: ids }, function(data){
        $.each( data, function(i,v){
          var cnt = $('[data-dbid='+v.id+'] .counts')
          if(cnt.text()==v.likes) return true;
          cnt.text(v.likes);
          main.database.likes(v.id, v.likes);
        })
      });
    },
    remove: function(target){
      target.animate({ left: -$(window).outerWidth() }, function(){ target.slideUp() } );
      main.database.remove( target.data('dbid') );
    }
  },
  settings: {
    init: function(){
      if(main.cache.def('news.general', true)=='true')
        $('[data-checkbox]:has([value="news.general"])').click();
      if(main.cache.def('news.sports', false)=='true')
        $('[data-checkbox]:has([value="news.sports"])').click();
      if(main.cache.def('news.politics', false)=='true')
        $('[data-checkbox]:has([value="news.politics"])').click();
      if(main.cache.def('news.technology', false)=='true')
        $('[data-checkbox]:has([value="news.technology"])').click();
    },
    news: function(val, state){
      main.cache.val(val, state);
    },
    types: function(){
      var types = [];
      if(main.cache.val('news.general')=='true')
        types.push( main.defaults.news.general );
      if(main.cache.val('news.sports')=='true')
        types.push( main.defaults.news.sports );
      if(main.cache.val('news.politics')=='true')
        types.push( main.defaults.news.politics );
      if(main.cache.val('news.technology')=='true')
        types.push( main.defaults.news.technology );
      return types;
    }
  },
  cache: {
    storage: window.localStorage,
    max: function(id){
      if(id!=undefined)
        main.cache.storage.setItem('max', id);
      if(main.cache.storage.getItem('max')==null) return 0;
      return main.cache.storage.getItem('max');
    },
    findMax: function(list){
      if(list.length>0){
        $.each(list, function(k,i){
          if(i.id>main.cache.max())
            main.cache.max(i.id);
        });
      }
    },
    val: function(key, val){
      if(val!=undefined)
        main.cache.storage.setItem(key, val);
      return main.cache.storage.getItem(key);
    },
    def: function(key, def){
      if(main.cache.storage.getItem(key)==null)
        main.cache.storage.setItem(key, def);
      return main.cache.storage.getItem(key);
    }
  },
  drag: {
    init: function(target){
      $(target).on({
        touchstart: function(e){
          var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
          $(this).data({ touchx: touch.pageX }).on('touchmove', main.drag.move);
        },
        touchend: function(e){
          var touchx = $(this).data('touchx');
          var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
          var target = $(this);
          if(touchx-touch.pageX>target.width()/3)
            main.posts.remove(target);
          else
            target.css( { left: '' } );
          target.data('touchx', null).off('touchmove', main.drag.move);
        }
      })
    },
    move: function(e){
      var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
      var touchx = $(this).data('touchx');
    }
  }
});

if(main.defaults.debug)
  setTimeout(main.init, 1000);
