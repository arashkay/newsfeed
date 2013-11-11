require 'open-uri'

class RSSReader

  FULLPOST_LIMIT = 1000
  SUMMARY_LIMIT = 160
  
  def read( entity, source, url, format )
    logger = Logger.new "#{Rails.root}/log/rss_reader.log"
    puts "#{source.name} : #{url}"
    uri = URI.parse url
    xml = Nokogiri::XML(open(uri).read)
    xml.xpath("//item").each do |i|
      title = format["title"].blank? ? nil : i.xpath(format['title']).text 
      next if title.blank?
      url = i.xpath(format["url"]).text.strip
      trashed_item = Trash.find_by_url url
      next unless trashed_item.blank?
      olditem = entity.find_by_url url
      next unless olditem.blank?
      puts "- #{title} : #{url}"
      item = entity.new( { title: title, url: url, source_id: source.id } )
      item.summary = ActionView::Base.full_sanitizer.sanitize(i.xpath(format["description"]).text) unless format["description"].blank? 
      begin
        page = Nokogiri::HTML(open(URI.parse URI.escape item.url).read)
        image = page.css(format["image"])
        if image.blank? # just list posts which has images
          Trash.create( :url => item.url )
          next 
        end
        item.image = image[0].attr('src')
        item.image = "http://#{uri.host}/#{item.image.sub(/^\//,'')}" unless item.image.match /^http/
        item.body = page.css(format["summary"]).text.truncate(FULLPOST_LIMIT) unless format["summary"].blank? 
        item.summary = item.body.truncate(SUMMARY_LIMIT) if item.summary.blank?
        item.likes = Random.rand 20
        item.save
        PostTag.find_or_create_by_tag_id_and_post_id( { :tag_id => source.tag_id, :post_id => item.id } ) if source.tag_id
        PostTag.find_or_create_by_tag_id_and_post_id( { :tag_id => source.category_id, :post_id => item.id } ) if source.category_id
        item.auto_tag
      rescue
        logger.info url
      end
    end
  end

end

