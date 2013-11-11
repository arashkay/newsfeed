$.extend( main,{
  database: {
    name: 'Kalagheh',
    db: null,
    migrations: {
      versions: [
        {
          version: '',
        },
        {
          version: '1.0',
          transaction: function(tx){
            tx.executeSql(
              'CREATE TABLE IF NOT EXISTS posts (id INTEGER UNIQUE, title VARCHAR, summary TEXT, url VARCHAR, image VARCHAR, likes INTEGER, liked BOOLEAN)',
              [],
              function(){}
            );
          }
        },
        {
          version: '2.0',
          transaction: function(tx){
            tx.executeSql(
              'ALTER TABLE posts ADD COLUMN body TEXT',
              [],
              function(){}
            );
            tx.executeSql(
              'ALTER TABLE posts ADD COLUMN date INTEGER',
              [],
              function(){}
            );
          }
        }
      ],
      migrate: function(callback){
        var m = main.database.migrations.versions;
        if(main.database.db.version == m[m.length-1].version ) return callback();
        var current = null;
        $.each( m, function(k, v){
          if(v.version!=main.database.db.version) return true;
          current = k;
          return false;
        });
        main.database.db.changeVersion( m[current].version, m[current+1].version, m[current+1].transaction, main.database.migrations.error, function(){ main.database.migrations.migrate(callback) } );
      },
      error: function(e){
        alert(JSON.stringify(e))
      }
    },
    init: function(){
      main.database.db = window.openDatabase(main.database.name, "", main.database.name, 500000);
      //main.database.reset();
      main.database.migrations.migrate( function(){
        main.database.ready();
      });
    },
    reset: function(tx){
      tx.executeSql('DROP TABLE IF EXISTS posts');
      main.cache.max(0);
    },
    ready: function(){
      var id = main.cache.max();
      if(id==0)
        return main.posts.load(true);
      main.database.load( function(list){
        main.posts.list(list);
        main.posts.likes();
        main.posts.load(true);
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
          tx.executeSql( main.database.query(['INSERT INTO posts (id, title, summary, url, image, likes, body) VALUES (?+?,"?+?","?+?","?+?","?+?",?+?,"?+?")', v.id, v.title, v.summary, v.url, v.image, v.likes, v.body]));
        });
      }, function(){ main.cache.findMax(list) }, function(){
        main.cache.findMax(list);
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
        tx.executeSql( 'SELECT * FROM posts ORDER BY id DESC LIMIT 60', [],
        function(tx, re){
          var size = re.rows.length;
          var list = [];
          for(i=0;i<size;i++){
            var o = re.rows.item(i);
            list.push({ id: o.id, title: o.title, summary: o.summary, url: o.url, image: o.image, likes: o.likes, liked: o.liked, body: o.body });
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
  }
});
