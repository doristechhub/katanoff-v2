const functions = require("firebase-functions");
const express = require("express");
const app = express();
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
require("./firebase");

const { rateLimitMiddleware, appCheckVerification } = require("./middleware");

app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(express.json({ limit: "30mb", extended: true }));

app.use(cors());
app.use(compression()); // Compress all routes
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(rateLimitMiddleware());
// app.use(appCheckVerification());

const stripeRoutes = require("./routes/stripe");
const orderRoutes = require("./routes/order");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const addressRoutes = require("./routes/address");
const appointmentsRoutes = require("./routes/appointments");
const returnsRoutes = require("./routes/returns");
const contactRoutes = require("./routes/contact");
const paypalRoutes = require("./routes/paypal");
/*   Routes   */
app.use("/stripe", stripeRoutes);
app.use("/order", orderRoutes);
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/address", addressRoutes);
app.use("/appointments", appointmentsRoutes);
app.use("/returns", returnsRoutes);
app.use("/contact", contactRoutes);
app.use("/paypal", paypalRoutes);

exports.cloudFunctionsApi = functions.https.onRequest(app);

exports.helloWorld = functions.https.onRequest((req, res) => {
  res.send("hello response from hello world functions");
});

// exports.api = functions.https.onRequest((req,res)=>{
//     switch (req.method) {
//         case 'GET':
//             res.send("it was Get request")
//             break;
//         case 'POST':
//             const body = req.body
//             res.send(body)
//             break;

//         default:
//             break;
//     }
// });

// exports.userAdded = functions.auth.user().onCreate((user)=>{
//     console.log(`${user.email} is created`)
//     return Promise.resolve()
// })

// exports.userDeleted = functions.auth.user().onDelete((user)=>{
//     console.log(`${user.email} is deleted`)
//     return Promise.resolve()
// })

// exports.orderAdded = functions.database.ref(`/cms/order/{documentId}`).onCreate((snapshot,context)=>{
//     console.log(snapshot.val(),"created order")
//     // send order created mail
//     return Promise.resolve()
// })

// exports.orderDeleted = functions.database.ref('/cms/order/{documentId}').onDelete((snapshot,context)=>{
//     console.log(snapshot.val(),"deleted order")
//     return Promise.resolve()
// })

// exports.orderUpdated = functions.database.ref('/cms/order/{documentId}').onUpdate((snapshot,context)=>{
//     console.log("update order before",snapshot.before.val())
//     console.log("update order after",snapshot.after.val())
//     return Promise.resolve()
// })

// exports.scheduleFunctions = functions.pubsub.schedule('* * * * *').onRun((context)=>{
//     console.log("i am running or executing every minute")
//     return null
// })
