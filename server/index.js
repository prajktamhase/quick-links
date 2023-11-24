import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config();
import Link from "./models/Link.js";

const app = express();
app.use(express.json());

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    if (conn) {
        console.log(`MongoDB connected...💖!`);
    }
};
connectDB();

app.post("/link", async (req, res) => {
    const { url, slug } = req.body;
    const randomslug = Math.random().toString(36).substring(2, 7);

    const link = new Link({
        url:url,
        slug: slug || randomslug,
    })

    try {
        const saveLink = await link.save();
        return res.json({
            success: true,
            data:
            {
                shortUrl: `${process.env.BASE_URL}/${saveLink.slug}`
            },
            message: "Link saved successfully"
        });
    }
    catch (err) {
        return res.json({
            success: false,
            message: err.message,
        })
    }
})

app.get("/:slug", async (req, res) => {
    const { slug } = req.params;

    const link = await Link.findOne({ slug: slug });

    await Link.updateOne({slug : slug},{$set:{
            clicks:link.clicks+1
        }})

    if (!link) {
        return res.json({
            success: false,
            message: "Link not found"
        })
    }
    res.redirect(link.url);
})

app.get('/api/links',async(req,res)=>{
    const links = await Link.find();

    res.json({
        success:true,
        data:links,
        message:'Links fetch successfully'
    })
})


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server is start ${PORT}`);
});



