/** @type {import('sequelize-cli').SeedFunction} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('status', [
      {
        name: 'Em Análise',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Aceito',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Encerrado',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Recusado',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('status', {
      name: ['Em Análise', 'Aceito', 'Encerrado', 'Aprovado', 'Recusado']
    }, {});
  }
};
