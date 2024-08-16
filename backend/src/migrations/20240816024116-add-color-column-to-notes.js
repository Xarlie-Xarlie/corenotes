'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Notes', 'color', {
      type: Sequelize.ENUM(
        '#FFFFFF',
        '#BAE2FF',
        '#B9FFDD',
        '#FFE8AC',
        '#FFCAB9',
        '#F99494',
        '#9DD6FF',
        '#ECA1FF',
        '#DAFF8B',
        '#FFA285',
        '#CDCDCD',
        '#979797',
        '#A99A7C'
      ),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Notes', 'search');
  }
};
