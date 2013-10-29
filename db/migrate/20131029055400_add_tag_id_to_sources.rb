class AddTagIdToSources < ActiveRecord::Migration
  def change
    add_column :sources, :tag_id, :integer
    add_column :sources, :category_id, :integer
    
    add_foreign_key :sources, :tags
  end
end
