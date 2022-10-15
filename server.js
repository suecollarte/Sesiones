/* ---------------------- Modulos ----------------------*/
import express from "express";
import session from "express-session";
import dotenv from 'dotenv';
import { engine } from 'express-handlebars';
//npm install --save-dev @types/node
import * as path from 'path';
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();

const app = express();

/* BD */
const DB_PRODUCTOS = [ {
  "id": 9,
  "timeproducto": "2022-08-08 23:01",
  "nombre": "Serrucho2",
  "descripcion": "Serrucho util para tareas precisas",
  "codigoprod": "AA04",
  "precio": "130523.45",
  "stock": 500,
  "foto": "https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/340_Tripadvisor_logo-512.png"
}];

/* --- Middlewares express ---*/
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('./public'));

/* --- Handlebars ---*/
app.engine('hbs', engine({
  defaultLayout: 'main',
  layoutsDir: './views/layouts',
  partialsDir: './views/partials',
  extname: 'hbs'
}));
app.set('view engine', 'hbs');
//app.set('views', './views');
app.set("views", path.resolve(__dirname, "./views"));





/* ---------------------- Middlewares ---------------------- */
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: true,
  saveUninitialized: true,
  cookie:{
    maxAge: 1000,
    httpOnly: true

  }
}));

function auth(req, res, next) {
  if(req.session?.user === 'coder' && req.session?.admin){
    return next()
  }

  return res.status(401).send('Forbbiden access')
}

/* ---------------------- Routes ---------------------- */
let contador = 1;

app.get('/', (req, res) => {
  res.render("login");

    
});
app.get('/sin-session', (req, res)=>{
  res.json({contador: contador++});
})

app.get('/con-session', (req, res)=>{
  if (!req.session.contador) {
    req.session.contador = 1
    res.send("Bienvenido primer login");
  } else {
    req.session.contador++
    res.send(`Usted ha ingresado ${req.session.contador} veces!`);
  }
})
let usuario="";
app.get('/login', (req, res)=>{
      const {username, password } = req.query;
      console.log(username);
      if(username !== 'coder' || password !== 'house'){
        return res.send('Login failed!');
      }
      req.session.user = username;
      usuario=username;
      req.session.admin = true;
      if (!req.session.contador) {
        req.session.contador = 1
        //res.send("Bienvenido primer login");
      } else {
        req.session.contador++
        //res.send(`Usted ha ingresado ${req.session.contador} veces!`);
      }

      console.log('session: ',req.session);
    
     
   
      res.render("logout",{
        username: usuario
      });

  //res.send('Login sucess!');
})

app.get('/privado', auth, (req, res)=>{
  res.send('Se encuentra logeado')
})

app.get('/logout', (req, res)=>{
  req.session.destroy(err=>{
    if (err) {
     res.json({err}) 
    } else{
      res.render("logout",{
        username: usuario
      });
      //es.send('Logout ok');
    }
  })
})






/* ---------------------- Server ---------------------- */
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servidor express escuchando en el puerto ${PORT}`);
});