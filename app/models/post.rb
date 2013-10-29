class Post < ActiveRecord::Base
  
  LIST_LIMIT = 100
  LATEST_LIMIT = 50
  
  attr_accessible :image, :source_id, :summary, :title, :url, :body
  belongs_to :source
  has_many :post_tags
  has_many :tags, :through => :post_tags

  default_scope order('created_at DESC')
  scope :recent, limit(Post::LIST_LIMIT)

  def self.latest(id)
    self.where(['id>?', id]).limit(Post::LATEST_LIMIT)
  end
  
  def self.auto_tag_last100
    Post.first(100).each do |post|
      post.auto_tag
    end
  end

  def auto_tag
    tags = Tag.select( [:id, :name] ).all
    tags.each do |tag|
      tag.add_to_post self
    end
  end

  def as_json(options={})
    super( :only => [ :id, :title, :summary, :url, :image, :likes, :body ] )
  end

end
