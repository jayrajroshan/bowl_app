const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const path = require('path')
const converter = require('json-2-csv')
const fs = require('fs')

const { Pool, Client } = require('pg')

const pool = new Pool({
    user: 'pgbowl',
    host: '180.151.15.18',
    database: 'bowling',
    password: 'pgsql@321#',
    port: 5432,
})

//const db = require('./queries')


var sensorQuery1 = null;
var sensorQuery2 = null;
var sensorQuery3 = null;



pool.query('SELECT * FROM sensordata1 ORDER BY serial_no ASC', (err, res1) => {
    if (err) throw err
    sensorQuery1 = res1;

    pool.query('SELECT * FROM sensordata2 ORDER BY serial_no ASC', (err, res2) => {
        if (err) throw err
        sensorQuery2 = res2;

        pool.query('SELECT * FROM sensordata2 ORDER BY serial_no ASC', (err, res3) => {
            if (err) throw err
            sensorQuery3 = res3;
            myFun();
            
          
          });
       
      
      });
   
  
  });


function myFun(){
    console.log("Sensor Query 1 :");
    console.log(sensorQuery1);
    console.log("Sensor Query 2 :");
    console.log(sensorQuery2);
    console.log("Sensor Query 3 :");
    console.log(sensorQuery3);
} 






app.set('view engine', 'ejs');
//app.use(express.static('./public'));
app.use('/public', express.static(path.join(__dirname, 'public')));


app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    }),
)

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})


var x = [];
var y = [];
var diff = [];


// pool.query(
//     'SELECT * FROM sensordata11 ORDER BY serial_no DESC LIMIT 50',
//     (error, results) => {
//         if (error) {
//             throw error
//         }
//         var temp = results.rows;

//         for (var i in temp) x.push((temp[i].imu1_roll) - (temp[0].imu1_roll))
//         console.log(x[1])

//         pool.query(
//             'SELECT * FROM sensordata31 ORDER BY serial_no DESC LIMIT 50',
//             (error, results) => {
//                 if (error) {
//                     throw error
//                 }

//                 var temp = results.rows;
//                 for (var i in temp) y.push((temp[i].imu3_roll) - (temp[0].imu3_roll))
//                 console.log(y[1])

//                 diff = y.map(function (num, idx) {
//                     return num - x[idx];
//                 });
//                 console.log(diff)

//                 const sum = diff.reduce((a, b) => a + b, 0);
//                 const avg = (sum / diff.length) || 0;

//                 console.log(`The sum is: ${sum}. The average is: ${avg}.`);
//             })

//     })





const gets3 = (request, response) => {
    pool.query(
        'SELECT * FROM sensordata31 ORDER BY serial_no DESC LIMIT 50',
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)

            var res3 = results.rows

            var z = []

            for (var i in res3) z.push((res3[i].imu3_pitch) - (res3[0].imu3_pitch))
            console.log(z)


            // converter.json2csv(res3, (err, csv) => {
            //     if (err) {
            //         throw err
            //     }

            //     // print CSV string
            //     fs.writeFileSync('sensor3.csv', csv)
            // })
        },

    )
}



app.get('/s3', gets3)

app.get('/home', (req, res) =>
    res.render('speedo'),
)


app.post('/home', function (req, res) {

    var avg;
    pool.query(
        'SELECT * FROM sensordata11 ORDER BY serial_no DESC LIMIT 50',
        (error, results) => {
            if (error) {
                throw error
            }
            var temp = results.rows;

            for (var i in temp) x.push((temp[i].imu1_roll) - (temp[0].imu1_roll))
            console.log(x[1])

            pool.query(
                'SELECT * FROM sensordata31 ORDER BY serial_no DESC LIMIT 50',
                (error, results) => {
                    if (error) {
                        throw error
                    }

                    var temp = results.rows;
                    for (var i in temp) y.push((temp[i].imu3_roll) - (temp[0].imu3_roll))
                    console.log(y[1])

                    diff = y.map(function (num, idx) {
                        return num - x[idx];
                    });
                    console.log(diff)

                    const sum = diff.reduce((a, b) => a + b, 0);
                    avg = (sum / diff.length) || 0;

                    console.log(`The sum is: ${sum}. The average is: ${avg}.`);

                })

        })


    console.log("average" + avg)
    res.send(JSON.stringify({ first: '${avg}', second: 4, third: 16 }),);
})
