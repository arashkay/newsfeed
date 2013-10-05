namespace :sources do
  
  desc "Fetch news from all sources"
  task :fetch => :environment do
    Source.fetch
  end

end
