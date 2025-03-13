const express = require("express");
const { couponClaimed, getAllCoupons } = require("../controller/couponController");

const router = express.Router();

router.get("/claim-coupon", couponClaimed);
router.get("/all-coupon", getAllCoupons);

module.exports = router;
