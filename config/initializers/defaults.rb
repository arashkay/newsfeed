module Kalagheh
  
  yaml = File.join(Rails.root, 'config', 'defaults.yml')
  if File.exist?(yaml) then
    hash = YAML.load_file(yaml)
    configs = (hash.has_key?('general') && !hash['general'].blank?) ? hash['general'] : {}
    configs = configs.merge(hash[Rails.env]) unless hash[Rails.env].blank?
  else
    puts "Please create #{yaml}"
    raise "Missing file"
  end

  CONFIGS = configs
  
  module NEWS
    GENERAL = CONFIGS['news']['general']
    SPORTS = CONFIGS['news']['sports']
    POLITICS = CONFIGS['news']['politics']
    ECONOMICS = CONFIGS['news']['economics']
    TECHNOLOGY = CONFIGS['news']['technology']
    SOCIOLOGY = CONFIGS['news']['sociology']
  end
  
end
