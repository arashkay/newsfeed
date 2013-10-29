class AddRelationToPosts < ActiveRecord::Migration
  def change
    add_foreign_key :posts, :sources
  end
end
