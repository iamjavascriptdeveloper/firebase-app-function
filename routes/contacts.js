const express = require('express');
const router = express.Router();

const moment = require('moment');

//Loading Firebase Package
const firebase = require("firebase-admin");
const serviceAccount = require(process.env.SERVICEACCOUNT);


/**
* Update your Firebase Project
* Credentials and Firebase Database
* URL
*/
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASEURL
});  //by adding your credentials, you get authorized to read and write from the database


/**
* Loading Firebase Database and refering 
* to user_data Object from the Database
*/
var db = firebase.database();
var ref = db.ref("/contacts");  //Set the current directory you are working in

// get all contacts
router.get('/', (req, res) => {
    ref.once("value", function(snapshot) {
        var data = snapshot.val();   //Data is in JSON format.
        
        if( !data ){
            res.send( [] )
        }else{
            let values = Object.entries ( data )
            values = values.map( item => {
                return {
                    id: item[0],
                    name: item[1].name,
                    telephoneNumber: item[1].telephoneNumber,
                    cellphoneNumber: item[1].cellphoneNumber
                }
            })

            res.send( values )
        }
        

    });      
})

// get specific contact
router.get('/:id',async (req, res) => {

    try {
        const id = req.params.id;
    
        res.send( await ref.child(id).get() )
    } catch (error) {
        res.status(400).send( error)   
    }

})

// edit all info in contact
router.put('/:id',async (req, res) => {
    
    try {
        const id = req.params.id;
        const telephoneNumber = req.body.telephoneNumber;
        const cellphoneNumber = req.body.cellphoneNumber;
        const name = req.body.name;
        const updatedAt = moment().format("YY-MM-DD HH:mm:ss");
        
        const newContact = {name, telephoneNumber, cellphoneNumber, updatedAt};
        
        res.send( await ref.child(id).update( newContact ) );

    } catch (error) {
        res.status(400).send( error )   
    }
    
})


// delete contact
router.delete('/:id', (req, res)=> {
    const id = req.params.id;
    let userRef = db.ref("contacts/" + id);
    userRef.remove();

    ref.once("value", function(snapshot) {
        var data = snapshot.val();   //Data is in JSON format.
        res.send( data )
    });
})

router.post('/', (req, res) => {
    const telephoneNumber = req.body.telephoneNumber;
    const cellphoneNumber = req.body.cellphoneNumber;
    const name = req.body.name;  

    const createdAt = moment().format("YY-MM-DD HH:mm:ss");

    const newContact = {name, telephoneNumber, cellphoneNumber, createdAt}

    ref.push( newContact, (error) => {
        if (error){
            res.status(400).send( error ) 
        }else{
            res.send( newContact )
        }
    } )

})

module.exports = router;