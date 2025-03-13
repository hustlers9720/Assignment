const Coupon = require("../models/coupon");

const claimCooldown = 10 * 1000; // 10 seconds cooldown
const claimQueue = new Set(); // Track processing users

// const claimCooldown = 10 * 1000; // 10 seconds cooldown (change as needed)

// let claimQueue = []; // Queue to store pending user requests
// let isClaiming = false;

const couponClaimed = async (req, res) => {
    const userIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    if (claimQueue.has(userIP)) {
        return res.status(429).json({ message: "Too many requests. Please wait.", claimed: false });
    }

    claimQueue.add(userIP);
    try {
        const lastClaim = await Coupon.findOne({ assignedTo: userIP }).sort("-claimedAt");

        if (lastClaim) {
            const timeElapsed = new Date() - lastClaim.claimedAt;
            const remainingTime = claimCooldown - timeElapsed;

            if (timeElapsed < claimCooldown) {
                return res.status(429).json({
                    message: `You already claimed a coupon. Try again in ${Math.ceil(remainingTime / 1000)} seconds.`,
                    coupon: lastClaim.code,
                    remainingTime: Math.ceil(remainingTime / 1000),
                    claimed: true,
                });
            }
        }

        const coupon = await Coupon.findOneAndUpdate(
            { assignedTo: null },
            { assignedTo: userIP, claimedAt: new Date() },
            { new: true }
        );

        if (!coupon) {
            return res.status(400).json({ message: "No coupons available.", claimed: false });
        }

        res.cookie("claimed", userIP, { maxAge: claimCooldown, httpOnly: true });
        return res.status(200).json({ message: "Coupon claimed successfully!", coupon: coupon.code, claimed: true });
    } catch (error) {
        console.error("Claim error:", error);
        return res.status(500).json({ message: "Server error, please try again later." });
    } finally {
        claimQueue.delete(userIP);
    }
};


// const couponClaimed = (req, res) => {
//     const userIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

//     claimQueue.push({ userIP, res });

//     if (!isClaiming) {
//         isClaiming = true;
//         processQueue(); // Start processing queue
//     }
// }


// const processQueue = async () => {
//     if (isClaiming || claimQueue.length === 0) return;

//     isClaiming = true;
//     const { userIP, res } = claimQueue.shift(); // Get first user in the queue
//     console.log(userIP);
//     console.log(res);
//     try {
//         const existingClaim = await Coupon.findOne({ assignedTo: userIP });

//         if (existingClaim) {
//             res.json({ message: `Please wait ${claimCooldown / 1000} sec, you have already claimed a coupon.`, claimed: false });
//         } else {
//             const coupon = await Coupon.findOneAndUpdate(
//                 { assignedTo: null },
//                 { assignedTo: userIP, claimedAt: new Date() },
//                 { new: true }
//             );

//             if (!coupon) {
//                 res.json({ message: "No coupons available", claimed: false });
//             } else {
//                 res.cookie("claimed", userIP, { maxAge: claimCooldown, httpOnly: true });
//                 res.json({ message: "Coupon claimed successfully!", coupon, claimed: true });
//             }
//         }
//     } catch (error) {
//         res.status(500).json({ message: "Server error, please try again later." });
//     } finally {
//         isClaiming = false;
//         if (claimQueue.length > 0) {
//             processQueue(); // Process the next user in line
//         }
//     }
// };

const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find();
        return res.status(200).json(coupons);
    } catch (error) {
        console.error("Error fetching coupons:", error);
        return res.status(500).json({ message: "Error fetching coupons", error });
    }
};

module.exports = { couponClaimed, getAllCoupons };
