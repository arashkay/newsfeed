set :application, "kalagheh"
set :deploy_to,  "/var/www/kalagheh.com"
server "106.186.120.146", :web, :app, :db, :primary => true
set :user, "webmaster"
ssh_options[:keys] = [~/.ssh/ashmaclinode]
#set :deploy_to,  "/home/arashvps/kalagheh.com"
#server "ps49055.dreamhost.com", :web, :app, :db, :primary => true
#set :user, "arashvps"
set :use_sudo, false

default_run_options[:pty] = true  # Must be set for the password prompt from git to work
set :repository, "git@github.com:tectual/newsfeed.git"  # Your clone URL
set :scm, "git"
ssh_options[:forward_agent] = true
set :branch, "web"
set :deploy_via, :remote_cache

namespace :deploy do
  task :start do ; end
  task :stop do ; end
  task :restart, :roles => :app, :except => { :no_release => true } do
    set :bundle_cmd, 'source $HOME/.bash_profile && bundle'
 #   run "cd #{release_path} && bundle"
 #   run "cd #{release_path} && bundle exec rake assets:precompile RAILS_ENV=production RAILS_GROUPS=assets"
 #   run "touch #{File.join(current_path,'tmp','restart.txt')}"
  end
end


before "deploy:create_symlink", "symlinks:create"
namespace :symlinks do
  task :create, :roles => :app do
    #run "cd #{release_path}/public && rm system -rf"
    #run "cd #{release_path}/public && ln -s #{shared_path}/system system"
  end
end
