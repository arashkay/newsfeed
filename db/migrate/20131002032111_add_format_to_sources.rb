class AddFormatToSources < ActiveRecord::Migration
  def change
    add_column :sources, :format, :text
  end
end
