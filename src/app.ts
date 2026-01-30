import express, { Application } from 'express';

import { categoryRouter } from './modules/catagory/category.router';

import { authRouter } from './modules/auth/auth.router';

import { medicineRouter } from './modules/medicine/medicine.router';
import { orderRouter } from './modules/orders/order.router';
 





const app:Application =express();
//app.all("/api/auth/*splat", toNodeHandler(auth));



app.use(express.json());

// Custom Auth Routes
app.use("/api/auth", authRouter);

// Category routes
app.use("/categories", categoryRouter);

app.use('/api', orderRouter);


app.use('/api', medicineRouter);


app.get('/',(req,res)=>{
    res.send('Welcome to MediStore Backend!');
});


export default app;
