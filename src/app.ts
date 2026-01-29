import express, { Application } from 'express';

import { categoryRouter } from './modules/catagory/category.router';
import { auth } from './lib/auth';
import { toNodeHandler } from "better-auth/node";
import { authRouter } from './modules/auth/auth.router';
import { medicineService } from './modules/medicine/medicine.service';
import { medicineRouter } from './modules/medicine/medicine.router';



const app:Application =express();
//app.all("/api/auth/*splat", toNodeHandler(auth));



app.use(express.json());

// Custom Auth Routes
app.use("/api/auth", authRouter);

// Category routes
app.use("/categories", categoryRouter);


app.use('/api', medicineRouter);


app.get('/',(req,res)=>{
    res.send('Welcome to MediStore Backend!');
});


export default app;
