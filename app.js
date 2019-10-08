const Sequelize = require('sequelize');

const sequelize = new Sequelize('test','root','',{
    host : 'localhost',
    dialect : 'sqlite', 
    storage : './database.sqlite'
});


const Restaurant = sequelize.define('restaurant', {
    name : {
        type : Sequelize.STRING, 
        allowNull : false
    }
});


const Types = sequelize.define('types', {
    type : {
      type : Sequelize.STRING, 
      allowNull : false
    }
});

const RestaurantTypes = sequelize.define('RestaurantTypes', {
    restaurantId : {
        type : Sequelize.INTEGER, 
        allowNull : false
    }, 
    typeId : {
        type : Sequelize.INTEGER, 
        allowNull : false
    }
});

Restaurant.belongsToMany(Types, {through : 'RestaurantTypes', foreignKey : 'restaurantId'});
Types.belongsToMany(Restaurant, {through : 'RestaurantTypes', foreignKey : 'typeId'});


sequelize.sync({force : true}).then(async () => {

    try{

        await Restaurant.create({
            name : 'Wok House'
        })

        await Types.bulkCreate([
            {type : 'Asian'},
            {type : 'Chinese'},
            {type : 'Oriental'}
        ]);

        await RestaurantTypes.bulkCreate([
            {restaurantId : 1, typeId : 1}, 
            {restaurantId : 1, typeId : 2}
        ]);

        const result = await Restaurant.findAll({
            include : [
                {
                    model : Types
                }
            ]
        });

        result[0].types.forEach(type => {
            console.log(type.type);
        })

    }catch(e){

        console.log('There was an error:', e);
    }

})