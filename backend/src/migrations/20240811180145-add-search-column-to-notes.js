'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Notes', 'search', {
      type: Sequelize.TSVECTOR,
      allowNull: false,
    });
    await queryInterface.addIndex('Notes', ['search'], {
      using: 'gist',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Notes', 'search');
  }
};
