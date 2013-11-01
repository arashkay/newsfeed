require 'open-uri'

class RSSReader

  FULLPOST_LIMIT = 1000
  
  def read( entity, source, url, format )
    puts "#{source.name} : #{url}"
    xml = Nokogiri::XML(open(URI.parse url).read)
    xml.xpath("//item").each do |i|
      title = format["title"].blank? ? nil : i.xpath(format['title']).text 
      next if title.blank?
      url = i.xpath(format["url"]).text.strip
      olditem = entity.find_by_url url
      next unless olditem.blank?
      puts "- #{title} : #{url}"
      item = entity.new( { title: title, url: url, source_id: source.id } )
      item.summary = ActionView::Base.full_sanitizer.sanitize(i.xpath(format["description"]).text) unless format["description"].blank? 
      page = Nokogiri::HTML(open(URI.parse item.url).read)
      image = page.css(format["image"])
      unless image.blank?
        item.image = image[0].attr('src')
      end
      item.body = page.css(format["summary"]).text.truncate(FULLPOST_LIMIT) unless format["summary"].blank? 
      item.save
      PostTag.find_or_create_by_tag_id_and_post_id( { :tag_id => source.tag_id, :post_id => item.id } ) if source.tag_id
      PostTag.find_or_create_by_tag_id_and_post_id( { :tag_id => source.category_id, :post_id => item.id } ) if source.category_id
      item.auto_tag
    end
  end

end

