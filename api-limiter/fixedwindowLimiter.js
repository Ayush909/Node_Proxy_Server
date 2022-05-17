const redis = require('redis');
const client = redis.createClient();


client.on('error', (err) => console.log('Redis Client Error', err));

client.connect();

const getRemainingTime = (storedTime) => {
    const currTime = new Date().getTime();
    const adjustedStoredTime = new Date(storedTime).getTime();

    const remainingTime = currTime - adjustedStoredTime;
    return remainingTime;
}

const myLimiter = async (req,res,next) => {
    try{
        if(!client){
            console.log('Redis client does not exist!');
            process.exit(1);
        }

        // we can use req.ip as the key for inserting data into redis.
        // u1 is used for testing purposes.
        const value = await client.get('u1');

        //if no record of particular user found, make a new record and insert
        if(!value){
            const newUserReq = {
                lastTime : new Date(),
                count : 1
            }
            await client.set('u1',JSON.stringify(newUserReq));
            next();
        }else{
            //if record found, do request count calculations based on last request time
            const storedData = JSON.parse(value);
         
            const remainingTime = getRemainingTime(storedData.lastTime);
            // console.log("remaining Time: ",remainingTime)

            //if request is made within 60seconds of the previously stored request time
            if(remainingTime <= 60000) {
                 if(storedData.count <= 5){
                     console.log("request can proceed");
                     //increase counter
                     const newUserReq = {
                         lastTime : storedData.lastTime,
                         count : storedData.count + 1
                     }
                     await client.set('u1',JSON.stringify(newUserReq));
                     next();
                 }else if(storedData.count > 5){
                     console.log("drop the request , 5 reqs reached");
                     res.json({message: 'Drop the request , 5 reqs reached'})
                 }
            }else{ //if request is made after 60seconds of the previously stored request time, make a brand new entry in database with request count 1
             const newUserReq = {
                 lastTime : new Date(),
                 count : 1
            }
                await client.set('u1',JSON.stringify(newUserReq));
                next();
            }
        }

    }catch(err){
        res.json({err});
    }
}

module.exports = myLimiter;