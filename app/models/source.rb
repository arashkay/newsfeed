class Source < ActiveRecord::Base
  
  attr_accessible :name, :url, :format
  serialize :format

  validates :name, :url, :presence => true

  def self.new_with_format
    object = self.new
    object.format = { :title => '', :description => '', :url => '', :image => '', :summary => '' }
    object
  end
  
  def self.fetch
    Source.all.each do |source|
      source.fetch
    end
  end

  def fetch
    reader = RSSReader.new
    reader.read Post, self, url, format
  end

end
