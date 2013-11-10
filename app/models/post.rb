class Post < ActiveRecord::Base
  
  attr_accessible :image, :source_id, :summary, :title, :url, :body
  belongs_to :source
  has_many :post_tags, :dependent => :destroy
  has_many :tags, :through => :post_tags

  default_scope order('created_at DESC')
  scope :recent, limit(Kalagheh::CONFIGS['wall_limit'])
  
  def self.types( ids=[] )
    return self if ids.blank?
    ids = [ids] unless ids.is_a? Array
    ids.empty? ? self : joins(:post_tags).where( post_tags: { tag_id: ids } ) 
  end

  def self.latest(id)
    where(['posts.id>?', id]).limit(Kalagheh::CONFIGS['mobile_limit'])
  end

  def self.customise( types, last )
    posts = Post.types(types).latest(last).all
    if posts.blank?
      return []
    elsif posts.size<=30
      return posts
    end
    max = 30 if (posts.size>30) 
    posts.sample max
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

  def self.clean_oldies
    oldest_item = Post.limit(Kalagheh::CONFIGS['news_stack']).select(:id).last.id
    destroy_all [ 'id < ?', oldest_item ]
  end

end
