class Tag < ActiveRecord::Base
  
  attr_accessible :name

  validates :name, :uniqueness => true

  def name=(value)
    write_attribute :name, value.strip
  end

  def as_json(options={})
    super(:only => [ :id, :name ])
  end

  def add_to_post( post )
    word = /\b#{name}\b/
    PostTag.find_or_create_by_tag_id_and_post_id( { :tag_id => id, :post_id => post.id } ) if post.title.match(word) || post.summary.match(word)
  end

end
