require 'open-uri'

class RSSReader

  def read( entity, source, url, format )
    puts "#{source.name} : #{url}"
    xml = Nokogiri::XML(open(URI.parse url).read)
    xml.xpath("//item").each do |i|
      title = format["title"].blank? ? nil : i.xpath(format['title']).text 
      next if title.blank?
      olditem = entity.find_by_title title
      next unless olditem.blank?
      item = entity.new
      item.title = title
      item.source_id = source.id
      item.summary = i.xpath(format["description"]).text unless format["description"].blank? 
      item.url = i.xpath(format["url"]).text.strip
      puts "- #{title} : #{item.url}"
      page = Nokogiri::HTML(open(URI.parse item.url).read)
      image = page.css(format["image"])
      unless image.blank?
        item.image = image[0].attr('src')
      end
      item.body = page.css(format["summary"]).text.truncate(700) unless format["summary"].blank? 
      item.save
      PostTag.find_or_create_by_tag_id_and_post_id( { :tag_id => source.tag_id, :post_id => item.id } ) if source.tag_id
      PostTag.find_or_create_by_tag_id_and_post_id( { :tag_id => source.category_id, :post_id => item.id } ) if source.category_id
      item.auto_tag
    end
  end

end

