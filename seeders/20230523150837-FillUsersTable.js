'use strict';

/** @type {import('sequelize-cli').Migration} */

var crypt = require('../helpers/crypt');

module.exports = {
    up(queryInterface, Sequelize) {

        return queryInterface.bulkInsert('users', [
            {
                username: 'admin',
                password: crypt.encryptPassword('1234', 'aaaa'),
                salt: 'aaaa', //prueba 2
                email: "admin@core.example",
                isAdmin: true,
                createdAt: new Date(), updatedAt: new Date()
            },
            // },
            {
                username: 'pepe',
                password: crypt.encryptPassword('5678', 'bbbb'),
                salt: 'bbbb',
                email: "pepe@core.example",
                // isAdmin: true,
                createdAt: new Date(), updatedAt: new Date()
            }
        ]);
    },

    down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete('users', null, {});
    }
};