require 'open-uri'

class Source < ActiveRecord::Base
  
  attr_accessible :name, :url, :format
  serialize :format

  validates :name, :url, :presence => true

  after_initialize :set_format

  def set_format
    self.format = { :title => '', :description => '', :url => '', :image => '', :summary => '' }
  end
  
  def self.fetch
    Source.all.each do |source|
      xml = Nokogiri::XML(open(source.url).read)
      xml.xpath("//item").each do |i|
        title = source.format["title"].blank? ? nil : i.xpath(source.format['title']).text 
        next if title.blank?
        oldpost = Post.find_by_title title
        next unless oldpost.blank?
        post = Post.new
        post.title = title
        post.source_id = source.id
        post.summary = i.xpath(source.format["description"]).text unless source.format["description"].blank? 
        post.url = i.xpath(source.format["url"]).text
        page = Nokogiri::HTML(open(post.url).read)
        image = page.css(source.format["image"])
        unless image.blank?
          post.image = image[0].attr('src')
        end
        post.save
      end
    end
  end

end
