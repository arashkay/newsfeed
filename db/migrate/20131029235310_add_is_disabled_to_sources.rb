class AddIsDisabledToSources < ActiveRecord::Migration
  def change
    add_column :sources, :is_disabled, :boolean, :default => false
  end
end
