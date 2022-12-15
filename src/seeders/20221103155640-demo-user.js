'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [{
      email: 'admin@gmail.com',
      password: '',
      firstName: 'Minh',
      lastName: 'Pham',
      address: 'VietNam',
      phonenumber: '09833244535',
      gender: 'R1',
      image: 'image.svg',
      roleId: 'R1',
      positionId: '2',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
