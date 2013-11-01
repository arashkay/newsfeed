class Tag < ActiveRecord::Base
  
  attr_accessible :name, :type_id
  has_many :post_tags

  validates :name, :uniqueness => true
  default_scope order('name ASC')
  scope :trends, unscoped.select( 'tags.id, name, post_tags.id, count(tags.id) as cnt' ).where( 'type_id NOT IN (1, 2) OR type_id IS NULL' ).group('tags.id').joins(:post_tags).order('cnt DESC').limit(10)

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
