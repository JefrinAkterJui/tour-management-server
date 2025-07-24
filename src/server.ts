/* eslint-disable no-console */

import {Server} from 'http'
import { connectDB } from './app/config/db';
import app from './app';
import { seedSuperAdmin } from './app/utils/seedSuperAdmin';

const PORT = 5000
let server : Server;

async function main(){
    try {
        connectDB()
        server = app.listen(PORT, ()=>{
            console.log(`App Listening on PORT ${PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}

(async ()=>{
    await main()
    await seedSuperAdmin()
})()

// 1. unhandeled rejection error
process.on("unhandledRejection", ()=>{
    console.log("Unhandeled Rejection detected... Server is Shutting down")
    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }
    process.exit(1)
});
// Promise.reject(new Error("I forgot catch this error "))

// 2. uncought exseption error
process.on("uncaughtException", ()=>{
    console.log("Uncought Exception detected... Server is Shutting down")
    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }
    process.exit(1)
});
// throw new Error("I forgot to handel this local error")

// 3. signal termination sigterm
process.on("SIGTERM", ()=>{
    console.log("SIGTERM Signal resived... Server is Shutting down")
    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }
    process.exit(1)
});

// 4. SIGINT 
process.on("SIGINT", ()=>{
    console.log("SIGINT Signal resived... Server is Shutting down")
    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }
    process.exit(1)
});