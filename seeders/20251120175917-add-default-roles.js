/** @type {import('sequelize-cli').SeedFunction} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      {
        name: 'Admin',
        ability: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'User',
        ability: 'user',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Collector',
        ability: 'collector',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', {
      name: ['User', 'Admin', 'Collector']
    }, {});
  }
};