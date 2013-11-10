namespace :sources do
  
  desc "Fetch news from all sources"
  task :fetch => :environment do
    Source.fetch
    Post.clean_oldies
  end

end
