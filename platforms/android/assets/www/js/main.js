var main = {
  defaults: {
    url: 'http://www.cliiz.com/',
    debug: false
  }
};
$.extend( main,{
  init: function(){
    $('.fn-options').click(main.menu.toggle);
    $('.fn-refresh').click(main.posts.refresh);
    $('.fn-about-btn').click(main.page.about);
    $('.fn-close').click(main.page.close);
    $('[data-href]').click( function(){
      window.open($(this).data('href'), '_system');
    });
    if(!main.defaults.debug)
      main.database.init();
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
  page: {
    close: function(){
      $(this).parents('.fn-page').slideUp('fast');
    },
    about: function(){
      $('.fn-menu').slideUp();
      $('.fn-about').slideDown();
    }
  },
  posts: {
    refresh: function(){
      $('.fn-menu').slideUp();
      if(main.network.exists())
        main.posts.load();
    },
    load: function(firstLoad){
      //alert('http://www.cliiz.com/'+main.cache.max()+'.json');
      if (firstLoad==true) navigator.splashscreen.hide();
      $.get(main.defaults.url+main.cache.max()+'.json', function(d){$('.fn-loader').hide(); main.posts.list(d, true) });
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
      $('.fn-like', list).click( main.posts.like );
      $('.fn-dislike', list).click( main.posts.dislike );
    },
    more: function(){
      var post = $(this).parents('.fn-post')
      post.find('.fn-description').slideToggle(200);
      post.toggleClass('expanded');
      (post.is('.expanded')) ? post.removeClass('shrinked') : post.addClass('shrinked');
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
  database: {
    db: (main.defaults.debug)? null : window.openDatabase("Kalagheh", "1.0", "Kalagheh", 500000),
    init: function(){
      main.database.db.transaction(main.database.create, main.database.error, main.database.success);
    },
    reset: function(tx){
      tx.executeSql('DROP TABLE IF EXISTS posts');
      main.cache.max(0);
    },
    create: function(tx){
      //main.database.reset(tx);
      tx.executeSql('CREATE TABLE IF NOT EXISTS posts (id INTEGER UNIQUE, title VARCHAR, summary TEXT, url VARCHAR, image VARCHAR, likes INTEGER, liked BOOLEAN)', [],function(){
        var id = main.cache.max();
        if(id==0)
          return main.posts.load(true);
        main.database.load( function(list){
          main.posts.list(list);
          main.posts.likes();
          main.posts.load(true);
        });
      });
    },
    error: function(err){
      //$.each( err, function(i,v){
      //  alert(i+':'+v);
      //});
      alert('db failed')
    },
    success: function(){
      //alert('yey!')
    },
    query: function(arg){
      var q = arg[0];
      var size = q.split('?').length-1;
      for(i=0;i<size;i++){
        var v = arg[i+1];
        v = ((typeof v == 'string')? v.replace(/\"/g,"'") : v);
        if(v==null) v = '';
        q = q.replace('?+?', v );
      }
      return q;
    },
    write: function(list){
      main.database.db.transaction( function(tx){
        $.each( list, function(i,v){
          tx.executeSql( main.database.query(['INSERT INTO posts (id, title, summary, url, image, likes) VALUES (?+?,"?+?","?+?","?+?","?+?",?+?)', v.id, v.title, v.summary, v.url, v.image, v.likes]));
        });
      }, main.database.error, function(){
        if(list.length>0){
          main.cache.max(list[0].id);
        }
      });
    },
    like: function(id, like){
      main.database.db.transaction( function(tx){
        tx.executeSql( 'UPDATE posts SET liked = '+like+', likes = likes+1 WHERE id = '+ id);
      });
    },
    likes: function(id, likes){
      main.database.db.transaction( function(tx){
        tx.executeSql( 'UPDATE posts SET likes = '+likes+' WHERE id = '+ id);
      });
    },
    load: function(callback){
      main.database.db.transaction( function(tx){
        tx.executeSql( 'SELECT * FROM posts ORDER BY id DESC', [],
        function(tx, re){
          var size = re.rows.length;
          var list = [];
          for(i=0;i<size;i++){
            var o = re.rows.item(i);
            list.push({ id: o.id, title: o.title, summary: o.summary, url: o.url, image: o.image, likes: o.likes, liked: o.liked });
          }
          callback(list);
        }, main.database.error);
      }, main.database.error, main.database.success);
    },
    max: function(callback){
      main.database.db.transaction( function(tx){
        tx.executeSql( 'SELECT * FROM posts ORDER BY id DESC LIMIT 1', [], 
          function(tx, re){
            if(re.rows.length==0)
              return callback(null);
            callback(re.rows.item(0).id);
          }, main.database.error);
      }, main.database.error, main.database.success);
    },
    remove: function(id){
      main.database.db.transaction( function(tx){
        tx.executeSql( 'DELETE FROM posts WHERE id = '+id )
      });
    }
  },
  cache: {
    storage: window.localStorage,
    max: function(id){
      if(id==undefined)
        main.cache.storage.getItem('max');
      else
        main.cache.storage.setItem('max', id);
      if(main.cache.storage.getItem('max')==null) return 0;
      return main.cache.storage.getItem('max');
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
