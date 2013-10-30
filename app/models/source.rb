class Source < ActiveRecord::Base
  
  attr_accessible :name, :url, :format, :tag_id, :category_id
  belongs_to :tag
  belongs_to :category, :class_name => 'Tag'
  serialize :format

  validates :name, :url, :presence => true

  scope :active, where( :is_disabled => false )

  def self.new_with_format
    object = self.new
    object.format = { :title => '', :description => '', :url => '', :image => '', :summary => '' }
    object
  end
  
  def self.fetch
    Source.active.all.each do |source|
      source.fetch
    end
  end

  def fetch
    begin
      reader = RSSReader.new
      reader.read Post, self, url, format
    rescue
      update_attribute :is_disabled, true
    end
  end

end
