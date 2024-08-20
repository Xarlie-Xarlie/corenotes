'use strict'

const { faker } = require('@faker-js/faker')

const color = [
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
  '#A99A7C',
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    var notes = []
    var jobArea
    for (var i = 0; i < 50; i++) {
      jobArea = faker.person.jobArea()
      notes.push({
        title: jobArea,
        description: faker.lorem.lines(4),
        favorite: faker.datatype.boolean(),
        color: faker.helpers.arrayElement(color),
        search: Sequelize.fn('to_tsvector', jobArea),
        createdAt: faker.date.anytime(),
        updatedAt: faker.date.anytime(),
      })
    }
    await queryInterface.bulkInsert('Notes', notes, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Notes', null, {})
  },
}
