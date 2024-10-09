import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const app = express();
const port = 3000;
const db=new pg.Client({
  host:"localhost",
  user:"postgres",
  password:"postgres_11",
  database:"permalist",
  port:5432,
})
if(db.connect()){
  console.log("connected");

}
else{
  console.log("not connected")

}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// let items = [
//   { id: 1, title: "Buy milk" },
//   { id: 2, title: "Finish homework" },
// ];

app.get("/", async (req, res) =>{
  try{
    const result=await db.query("SELECT * FROM items ORDER BY id ASC");
    res.render("index.ejs", {
    listTitle: "Today",
    listItems:result.rows, 
  });
  }catch{
    res.status(500).send("Error rendering page");
  }
});
app.post("/add",async (req, res) => {
   const item = req.body.newItem;
   await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
   res.redirect("/");
   //  data.push({ title: item });
  //  res.redirect("/");
});
 app.post("/edit", async(req, res) => {
   const title=req.body.updatedItemTitle;
   const id=req.body.updatedItemId;
   console.log(title)
   console.log(id)
   await db.query("UPDATE items SET title=$1 WHERE id=$2",[title,id])
   res.redirect("/")
 });
app.post("/delete", async(req, res) => {
  console.log(req.body)
  const id=(req.body.deleteItemId);
  console.log(id);
  try{
    if(id){
      await db.query("DELETE FROM items WHERE id=$1",[id]);
      res.redirect("/");
    }else{
      console.log("no id found")
    }
  }catch{
    console.log("error")
  }
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
