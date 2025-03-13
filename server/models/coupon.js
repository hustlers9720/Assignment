const  mongoose = require ("mongoose");

const couponSchema = new mongoose.Schema({
    code: String,
    assignedTo: String,
    claimedAt: Date
});

const Coupon = mongoose.model("coupons", couponSchema);

module.exports =  Coupon;