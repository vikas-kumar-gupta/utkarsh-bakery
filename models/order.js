const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const orderSchema = new Schema({
    orderDate: {
        type: String,
        required: true
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }],
    orderStatus: {
        type: String,
        enum: ['Processing', 'On hold', 'Pending Payment', 'Failed', 'Completed', 'Canceled', 'Refunded', 'Authentication require'],
        required: true
    },
    deliveryMethod: {
        type: String,
        enum: ['Home delivery', 'Self Picking'],
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['Online', 'Cash on delivery'],
        required: true
    },
    deliveryCharge: {
        type: Number,
    },
    nameOnCake: {
        type: String
    },
    expectedDeliveryDate: {
        type: String
    },
    shippingAddress: {
        type: String,
        required: true
    },
    totalPrice: {
        type: Number,
    },
    isOrderCompleted: {
        type: Boolean,
        required: true
    }
})

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;