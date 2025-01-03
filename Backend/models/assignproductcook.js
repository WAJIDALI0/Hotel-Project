import mongoose from 'mongoose';

const assignProductCookSchema = new mongoose.Schema(
    {
        cook: {
            // type: mongoose.Schema.Types.ObjectId,
            // ref: 'User',
            // required: true,
            // type: mongoose.Schema.Types.ObjectId,
            // ref: 'Cook',
            type:String,
            required: true,
        },
        product: {
            // type: mongoose.Schema.Types.ObjectId,
            // ref: 'Product',
            // required: true,
            type:String,
            required: true,

        },
        quantity: {
            type: Number,
            required: true,
        },
       
        assignedDate: {
            type: Date,
            required: true,
        },
        // completedDate: {
        //     type: Date,
        // },
        // status: {
        //     type: String,
        //     required: true,
        //     enum: ['pending', 'in progress', 'completed'],
        // },
        // comments: {
        //     type: String,
        // },
    },
    {
        timestamps: true,
    }
);

const AssignProductCookModel = mongoose.model('AssignProductCook', assignProductCookSchema);

export default AssignProductCookModel;