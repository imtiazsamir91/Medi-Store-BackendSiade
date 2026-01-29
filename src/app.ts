import express, { Application } from 'express';
import { medicineRouter } from './modules/medicine/medicine.router';
import { categoryRouter } from './modules/catagory/category.router';



const app:Application =express();
app.use(express.json());

// Category routes
app.use("/categories", categoryRouter);


app.use('/medi',medicineRouter);


app.get('/',(req,res)=>{
    res.send('Welcome to MediStore Backend!');
});


export default app;
