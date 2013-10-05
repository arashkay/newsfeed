class Post < ActiveRecord::Base
  
  LIST_LIMIT = 100
  LATEST_LIMIT = 50
  
  attr_accessible :image, :source_id, :summary, :title, :url

  default_scope order('created_at DESC')
  scope :recent, limit(Post::LIST_LIMIT)

  def self.latest(id)
    self.where(['id>?', id]).limit(Post::LATEST_LIMIT)
  end

  def as_json(options={})
    super( :only => [ :id, :title, :summary, :url, :image, :likes ] )
  end

end
