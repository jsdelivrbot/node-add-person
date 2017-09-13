//Load connections
var connection = require('../config');
//Load PG library version 6 not version 7.
var pg = require("pg");
//Needed for Heroku Promises or APP crashes
pg.defaults.ssl = true;

var bodyParser = require("body-parser");

module.exports = function (app){

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));

   
    //Home Page
    app.get('/', function(req, res) {
        //Get Table schema quick and dirty way for POSTGRES
        //Could use select column_name, data_type, character_maximum_length from INFORMATION_SCHEMA.COLUMNS where table_name = ''
        var results = [];
        pg.connect(connection.getDBConnStr, function(err, client) {
            if (err) throw err;
            
            client
              .query("select * from people limit 1")
              .on('row', function(row) {
                
                results.push(row);
              })
              .on('end',()=>{
                    //res.send(results);
                    res.render('./pages/index',{title:"Add Person",results:results,insert:0});
                });
             
          });
        
    });
    //Add a User to the Database
    app.post('/', function(req, res) {

        var keys = [];
        var values = [];
        for(var key in req.body)
        {
            if(req.body[key]!="")
                {
                    keys.push(key);
                    values.push(req.body[key]);
                }
        }
        //res.send("insert into people ("+keys.join(",")+") values ('"+values.join("','")+"')");
        
       //Insert Record
      
        pg.connect(connection.getDBConnStr, function(err, client) {
            if (err) throw err;
            client
              .query("insert into people ("+keys.join(",")+") values ('"+values.join("','")+"')")
              
              .on('end',()=>{

                    res.render('./pages/index',{title:"Search Results", results:{},insert:1});
                });
              
          });
        
        
    });

    
}